// lib/mediapipeFaceMesh.js
// Uses official @mediapipe/drawing_utils + FACEMESH_TESSELATION
// CDN: https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh
//      https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils

let faceMesh = null;
let warmupComplete = false;
let isLoading = false;
let loadPromise = null;
let scanPhase = 0;

let metrics = {
  symmetry: 0, confidence: 0, depth: 0, landmarks: 0,
  yaw: 0, pitch: 0, roll: 0, meshDensity: 0, trackingQuality: 0, faceArea: 0,
};

export function getMetrics() { return { ...metrics }; }
export function updatePoseMetrics(yaw, pitch, roll) {
  metrics.yaw = yaw; metrics.pitch = pitch; metrics.roll = roll;
}
export function isMeshPreloaded() { return warmupComplete; }
export function getMeshStatus() {
  return { initialized: warmupComplete, warmedUp: warmupComplete, loading: isLoading };
}

// ── Load official MediaPipe scripts from CDN ─────────────────────────────────
function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src; s.crossOrigin = 'anonymous';
    s.onload = resolve; s.onerror = reject;
    document.head.appendChild(s);
  });
}

async function ensureMediaPipeLoaded() {
  // Load official mediapipe packages from CDN
  await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js');
  await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js');
  await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js');

  // Wait for globals
  let tries = 0;
  while ((!window.FaceMesh || !window.drawConnectors) && tries < 80) {
    await new Promise(r => setTimeout(r, 100));
    tries++;
  }
  if (!window.FaceMesh) throw new Error('MediaPipe FaceMesh failed to load');
  if (!window.drawConnectors) throw new Error('MediaPipe drawing_utils failed to load');
}

// ── Init ─────────────────────────────────────────────────────────────────────
export async function preloadFaceMesh() {
  if (warmupComplete) return faceMesh;
  if (isLoading) return loadPromise;
  isLoading = true;

  loadPromise = (async () => {
    try {
      await ensureMediaPipeLoaded();

      faceMesh = new window.FaceMesh({
        locateFile: file =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      });
      window.faceMeshInstance = faceMesh;

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true, 
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      // Warmup with blank canvas
      const c = document.createElement('canvas');
      c.width = 640; c.height = 480;
      await faceMesh.send({ image: c });

      warmupComplete = true;
      isLoading = false;
      console.log('[MediaPipe] Ready via CDN');
      return faceMesh;
    } catch (err) {
      isLoading = false;
      console.error('[MediaPipe] Load error:', err);
      throw err;
    }
  })();
  return loadPromise;
}

export async function initFaceMesh(onResults) {
  await preloadFaceMesh();
  if (onResults && faceMesh) faceMesh.onResults(onResults);
  return faceMesh;
}

// ── Canvas size sync ──────────────────────────────────────────────────────────
// Call this once on init and on window resize to keep the canvas draw buffer
// exactly matching its CSS display size. Mismatch causes landmark drift,
// most noticeably on small features like irises.
export function syncCanvasSize(canvas) {
  const rect = canvas.getBoundingClientRect();
  const w = Math.round(rect.width);
  const h = Math.round(rect.height);
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
}

// ── Metrics helpers ───────────────────────────────────────────────────────────
function computeSymmetry(lms, width, height) {
  const cx = lms[1]?.x * width || width / 2;
  const pairs = [[33,263],[133,362],[159,386],[145,374],[61,291],[48,278]];
  let diff = 0, count = 0;
  pairs.forEach(([l, r]) => {
    if (!lms[l] || !lms[r]) return;
    const ld = Math.abs(lms[l].x * width - cx);
    const rd = Math.abs(lms[r].x * width - cx);
    diff += Math.abs(ld - rd) / (Math.max(ld, rd) + 1);
    count++;
  });
  return count ? Math.max(0, Math.min(100, Math.round((1 - diff / count) * 100))) : 0;
}

// ── Draw iris circles precisely ───────────────────────────────────────────────
// MediaPipe iris landmarks (refineLandmarks=true):
//   Right iris: 468 (center), 469 (right), 470 (top), 471 (left), 472 (bottom)
//   Left  iris: 473 (center), 474 (right), 475 (top), 476 (left), 477 (bottom)
//
// THE REAL BUG (confirmed from MediaPipe drawing_utils source):
//   drawConnectors internally scales landmarks by ctx.canvas.width/height —
//   NOT by any width/height parameter. So when drawIrisCircles used the
//   `width` and `height` function parameters, it was scaling to different
//   pixel coordinates than every other drawConnectors call, causing the offset.
//
// THE FIX: read ctx.canvas.width and ctx.canvas.height directly, exactly
//   as MediaPipe's own drawConnectors does. This guarantees iris circles are
//   in the exact same coordinate space as all other mesh drawing.
function drawIrisCircles(ctx, landmarks) {
  // Use the same source of truth as drawConnectors
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;

  const irisDefs = [
    { center: 468, perim: [469, 470, 471, 472] }, // right iris
    { center: 473, perim: [474, 475, 476, 477] }, // left iris
  ];

  for (const { center, perim } of irisDefs) {
    const cl = landmarks[center];
    if (!cl) continue;

    const perimPts = perim.map(i => landmarks[i]).filter(Boolean);
    if (perimPts.length < 2) continue;

    // Center: use the annotated center landmark (index 468/473),
    // scaled exactly as drawConnectors scales it
    const cx = cl.x * W;
    const cy = cl.y * H;

    // Radius: average distance from center to all 4 perimeter points
    const radius = perimPts.reduce((s, p) => {
      const dx = p.x * W - cx;
      const dy = p.y * H - cy;
      return s + Math.sqrt(dx * dx + dy * dy);
    }, 0) / perimPts.length;

    if (radius < 1) continue;

    // Outer iris ring
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.92)';
    ctx.lineWidth = 1.4;
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 5;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Inner pupil ring
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.55, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 200, 255, 0.55)';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Center dot
    ctx.beginPath();
    ctx.arc(cx, cy, 1.8, 0, Math.PI * 2);
    ctx.fillStyle = '#00ffff';
    ctx.fill();
  }
}

// ── MAIN DRAW ─────────────────────────────────────────────────────────────────
const DEFAULT_OVERLAY_LABELS = {
  biometricScan: 'BIOMETRIC SCAN',
  landmarks: 'LANDMARKS',
  symmetry: 'SYMMETRY',
  confidence: 'CONFIDENCE',
  trackingLabel: 'TRACKING',
  faceArea: 'FACE AREA',
  depth: 'DEPTH',
  lockAcquired: 'BIOMETRIC LOCK ACQUIRED',
  scanningHold: 'SCANNING — HOLD POSITION',
  aligning: 'ALIGNING',
};

export function drawFaceScannerOverlay(ctx, landmarks, width, height, quality = 0.85, shouldMirror = true, labels = DEFAULT_OVERLAY_LABELS) {
  if (!landmarks || landmarks.length < 468) return false;

  // drawConnectors / FACEMESH_TESSELATION must be loaded
  if (!window.drawConnectors || !window.FACEMESH_TESSELATION) {
    // Fallback minimal draw until scripts load
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.font = '11px monospace';
    ctx.fillStyle = '#00ffff';
    ctx.textAlign = 'center';
    ctx.fillText('LOADING MESH ENGINE...', width / 2, height / 2);
    ctx.restore();
    return false;
  }

  scanPhase = (scanPhase + 0.018) % (Math.PI * 2);

  // ── Metrics ──
  const zVals = landmarks.map(l => l.z);
  const zMin = Math.min(...zVals), zMax = Math.max(...zVals);
  metrics.landmarks = landmarks.length;
  metrics.symmetry = computeSymmetry(landmarks, width, height);
  metrics.depth = Math.round(Math.abs(zMax - zMin) * 1000);
  metrics.confidence = Math.round(quality * 100);
  metrics.meshDensity = 100;
  metrics.trackingQuality = Math.round(metrics.symmetry * 0.5 + metrics.confidence * 0.5);
  if (landmarks[10] && landmarks[152] && landmarks[234] && landmarks[454]) {
    metrics.faceArea = Math.round(
      Math.abs(landmarks[234].x - landmarks[454].x) *
      Math.abs(landmarks[10].y - landmarks[152].y) * 100
    );
  }

  ctx.save();
  ctx.clearRect(0, 0, width, height);

  // CRITICAL: use ctx.canvas.width/height for ALL transforms — this is the
  // same value drawConnectors reads internally. Using the `width` parameter
  // causes the mirror pivot to be wrong, visibly shifting iris circles
  // relative to the rest of the mesh whenever canvas buffer != param size.
  const CW = ctx.canvas.width;
  const CH = ctx.canvas.height;

  // Mirror transform to match video
  if (shouldMirror) {
    ctx.translate(CW, 0);
    ctx.scale(-1, 1);
  }

  // ── Official MediaPipe rendering ──

  // Tesselation (full wireframe)
  window.drawConnectors(ctx, landmarks, window.FACEMESH_TESSELATION, {
    color: 'rgba(0, 220, 255, 0.35)',
    lineWidth: 0.6,
  });

  // Face oval
  window.drawConnectors(ctx, landmarks, window.FACEMESH_FACE_OVAL, {
    color: 'rgba(0, 255, 160, 0.9)',
    lineWidth: 1.8,
  });

  // Left eye
  window.drawConnectors(ctx, landmarks, window.FACEMESH_LEFT_EYE, {
    color: 'rgba(0, 220, 255, 0.95)',
    lineWidth: 1.4,
  });
  // Right eye
  window.drawConnectors(ctx, landmarks, window.FACEMESH_RIGHT_EYE, {
    color: 'rgba(0, 220, 255, 0.95)',
    lineWidth: 1.4,
  });
  // Left eyebrow
  window.drawConnectors(ctx, landmarks, window.FACEMESH_LEFT_EYEBROW, {
    color: 'rgba(120, 180, 255, 0.7)',
    lineWidth: 1.0,
  });
  // Right eyebrow
  window.drawConnectors(ctx, landmarks, window.FACEMESH_RIGHT_EYEBROW, {
    color: 'rgba(120, 180, 255, 0.7)',
    lineWidth: 1.0,
  });
  // Lips
  window.drawConnectors(ctx, landmarks, window.FACEMESH_LIPS, {
    color: 'rgba(0, 200, 255, 0.85)',
    lineWidth: 1.3,
  });

  // ── Iris circles (precise manual draw — replaces drawConnectors for irises) ──
  // drawConnectors on FACEMESH_LEFT_IRIS / FACEMESH_RIGHT_IRIS is removed
  // because it produces subpixel drift on small features. Instead we compute
  // an exact circle from center + perimeter landmark distance.
  if (landmarks.length >= 478) {
    drawIrisCircles(ctx, landmarks);
  }

  // Key landmark dots
  window.drawLandmarks(ctx, [
    landmarks[1], landmarks[10], landmarks[152],
    landmarks[234], landmarks[454],
    landmarks[33], landmarks[263],
    landmarks[61], landmarks[291],
  ], {
    color: '#00ffff',
    lineWidth: 1,
    radius: 2.5,
  });

  // Undo mirror before drawing HUD
  if (shouldMirror) {
    ctx.scale(-1, 1);
    ctx.translate(-CW, 0);
  }

  // ── Animated scan line ──
  const fTop = landmarks[10] ? landmarks[10].y * CH : 0;
  const fBot = landmarks[152] ? landmarks[152].y * CH : CH;
  const scanRaw = fTop + (Math.sin(scanPhase) * 0.5 + 0.5) * (fBot - fTop);
  const scanY = scanRaw;
  const sg = ctx.createLinearGradient(0, scanY, CW, scanY);
  sg.addColorStop(0, 'transparent');
  sg.addColorStop(0.2, 'rgba(0,255,220,0.5)');
  sg.addColorStop(0.5, 'rgba(0,255,255,0.95)');
  sg.addColorStop(0.8, 'rgba(0,255,220,0.5)');
  sg.addColorStop(1, 'transparent');
  ctx.strokeStyle = sg; ctx.lineWidth = 1.3;
  ctx.shadowColor = '#00ffff'; ctx.shadowBlur = 12;
  ctx.beginPath(); ctx.moveTo(0, scanY); ctx.lineTo(CW, scanY); ctx.stroke();
  ctx.shadowBlur = 0;

  // ── HUD corners ──
  const bS = 24, bP = 10;
  ctx.strokeStyle = '#00ffff'; ctx.lineWidth = 2.2; ctx.lineCap = 'square';
  ctx.shadowColor = '#00ffff'; ctx.shadowBlur = 10;
  [[bP,bP,1,1],[CW-bP,bP,-1,1],[CW-bP,CH-bP,-1,-1],[bP,CH-bP,1,-1]].forEach(([x,y,dx,dy]) => {
    ctx.beginPath();
    ctx.moveTo(x, y+dy*bS); ctx.lineTo(x,y); ctx.lineTo(x+dx*bS, y);
    ctx.stroke();
  });
  ctx.shadowBlur = 0;

  // Tick marks
  ctx.strokeStyle = 'rgba(0,255,255,0.25)'; ctx.lineWidth = 0.8;
  for (let i = 1; i < 8; i++) {
    const y = CH * i / 8, x = CW * i / 8;
    [[0,y,9,y],[CW,y,CW-9,y],[x,0,x,9],[x,CH,x,CH-9]].forEach(([x1,y1,x2,y2]) => {
      ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
    });
  }

  // ── Metrics panel (left) ──
  ctx.font = '10px "Courier New", monospace';
  [
    { l: labels.landmarks, v: metrics.landmarks,           bar: metrics.landmarks/468 },
    { l: labels.symmetry,  v: metrics.symmetry+'%',        bar: metrics.symmetry/100 },
    { l: labels.confidence, v: metrics.confidence+'%',      bar: metrics.confidence/100 },
    { l: labels.trackingLabel, v: metrics.trackingQuality+'%', bar: metrics.trackingQuality/100 },
    { l: labels.faceArea, v: metrics.faceArea+'%',        bar: Math.min(metrics.faceArea/60,1) },
    { l: labels.depth,    v: metrics.depth+'u',           bar: Math.min(metrics.depth/300,1) },
  ].forEach((m, i) => {
    const y = 50 + i * 28;
    ctx.fillStyle = 'rgba(0,180,255,0.5)'; ctx.textAlign = 'left';
    ctx.fillText(m.l, 12, y);
    ctx.fillStyle = 'rgba(0,255,255,0.08)';
    ctx.fillRect(12, y+3, 60, 3);
    ctx.fillStyle = m.bar > 0.7 ? 'rgba(0,255,160,0.85)' : m.bar > 0.4 ? 'rgba(0,200,255,0.85)' : 'rgba(255,150,0,0.85)';
    ctx.fillRect(12, y+3, 60*Math.min(m.bar,1), 3);
    ctx.fillStyle = 'rgba(0,255,255,0.9)';
    ctx.fillText(m.v, 76, y+4);
  });

  // Pose (right)
  const rX = CW - 88;
  [['YAW',metrics.yaw.toFixed(1)+'°'],['PITCH',metrics.pitch.toFixed(1)+'°'],['ROLL',metrics.roll.toFixed(1)+'°']].forEach(([l,v],i) => {
    const y = 50 + i*22;
    ctx.fillStyle = 'rgba(0,180,255,0.5)'; ctx.textAlign = 'left'; ctx.fillText(l, rX, y);
    ctx.fillStyle = 'rgba(0,255,255,0.9)'; ctx.fillText(v, rX+40, y);
  });

  // Header
  ctx.textAlign = 'center'; ctx.font = '600 11px "Courier New", monospace';
  ctx.fillStyle = 'rgba(0,255,255,0.85)'; ctx.shadowColor='#00ffff'; ctx.shadowBlur=7;
  ctx.fillText(`◈  ${labels.biometricScan}  ◈`, CW/2, 18);
  ctx.shadowBlur = 0;

  // Status
  const sc = metrics.trackingQuality > 70 ? '#00ff88' : metrics.trackingQuality > 40 ? '#00ccff' : '#ffaa33';
  const st = metrics.trackingQuality > 70 ? labels.lockAcquired : metrics.trackingQuality > 40 ? labels.scanningHold : labels.aligning;
  ctx.font = '600 10px "Courier New", monospace'; ctx.fillStyle = sc;
  ctx.shadowColor = sc; ctx.shadowBlur = 9;
  ctx.fillText('● ' + st, CW/2, CH-12);
  ctx.shadowBlur = 0;

  ctx.restore();
  return true;
}

export function drawFallbackOverlay(ctx, box, width, height) {
  if (!box) return;
  ctx.save();
  ctx.strokeStyle = '#00ffff'; ctx.lineWidth = 1.2; ctx.globalAlpha = 0.6;
  ctx.shadowColor = '#00ffff'; ctx.shadowBlur = 6;
  ctx.setLineDash([6,8]);
  ctx.strokeRect(box.x, box.y, box.width, box.height);
  ctx.setLineDash([]);
  const c=14,ins=4;
  [[box.x-ins,box.y+c,box.x-ins,box.y-ins,box.x+c,box.y-ins],
   [box.x+box.width-c,box.y-ins,box.x+box.width+ins,box.y-ins,box.x+box.width+ins,box.y+c],
   [box.x+box.width+ins,box.y+box.height-c,box.x+box.width+ins,box.y+box.height+ins,box.x+box.width-c,box.y+box.height+ins],
   [box.x+c,box.y+box.height+ins,box.x-ins,box.y+box.height+ins,box.x-ins,box.y+box.height-c]
  ].forEach(p=>{ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(p[2],p[3]);ctx.lineTo(p[4],p[5]);ctx.stroke();});
  ctx.restore();
}

// ── sendVideoToFaceMesh ───────────────────────────────────────────────────────
// ROOT CAUSE OF IRIS MISALIGNMENT:
// MediaPipe normalizes landmark X/Y to [0,1] based on the INPUT IMAGE aspect
// ratio. drawConnectors maps those back using ctx.canvas.width/height.
// If video AR (e.g. 4:3 landscape) !== canvas AR (e.g. 9:16 portrait mobile),
// X coords are compressed — iris circles appear shifted toward the nose.
// The eye outline mesh looks OK because all points distort equally, but
// absolute positions are wrong.
//
// Fix: crop video into an offscreen canvas matching the overlay canvas AR
// before sending to faceMesh.send(). Landmarks are then normalized to the
// same proportions the canvas uses — perfect overlap on both pupils.
//
// Replace: await faceMesh.send({ image: videoElement })
// With:    await sendVideoToFaceMesh(videoElement, overlayCanvas)
let _offscreen = null;
export async function sendVideoToFaceMesh(video, overlayCanvas) {
  if (!faceMesh) return;
  const cw = overlayCanvas.width;
  const ch = overlayCanvas.height;
  const canvasAR = cw / ch;
  const vw = video.videoWidth  || video.width  || 640;
  const vh = video.videoHeight || video.height || 480;
  const videoAR = vw / vh;
  if (!_offscreen) _offscreen = document.createElement('canvas');
  if (_offscreen.width !== cw || _offscreen.height !== ch) {
    _offscreen.width = cw;
    _offscreen.height = ch;
  }
  const octx = _offscreen.getContext('2d');
  let sx = 0, sy = 0, sw = vw, sh = vh;
  if (videoAR > canvasAR) {
    sw = Math.round(vh * canvasAR);
    sx = Math.round((vw - sw) / 2);
  } else {
    sh = Math.round(vw / canvasAR);
    sy = Math.round((vh - sh) / 2);
  }
  octx.drawImage(video, sx, sy, sw, sh, 0, 0, cw, ch);
  await faceMesh.send({ image: _offscreen });
}