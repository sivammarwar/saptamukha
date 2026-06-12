import * as faceapi from '@vladmandic/face-api';

const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';

let modelsLoaded = false;

export async function loadFaceApiModels() {
  if (modelsLoaded) return;
  await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
  await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
  modelsLoaded = true;
}

export function isModelsLoaded() {
  return modelsLoaded;
}

/**
 * Detect face from video element for UI overlay only.
 * Returns detections with landmarks.
 * ── UNCHANGED — twin detection depends on this signature ──
 */
const detectOptions = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.3 });

export async function detectFace(videoElement) {
  if (!modelsLoaded) return null;
  try {
    const detections = await faceapi
      .detectAllFaces(videoElement, detectOptions)
      .withFaceLandmarks();
    return detections;
  } catch (err) {
    console.warn('Face detection error:', err);
    return null;
  }
}

/**
 * Draw detection overlay on canvas.
 * ── UNCHANGED — used by twin detection ──
 */
export function drawOverlay(canvas, detections, options = {}) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  detections.forEach(det => {
    const box = det.detection.box;
    const landmarks = det.landmarks;

    ctx.strokeStyle = '#ff6b35';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 4]);
    ctx.lineDashOffset = -Date.now() / 20;
    ctx.strokeRect(box.x, box.y, box.width, box.height);
    ctx.setLineDash([]);

    ctx.fillStyle = '#c8960c';
    landmarks.positions.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, 2 * Math.PI);
      ctx.fill();
    });
  });
}

/**
 * Quality checks based on face-api.js detections.
 * ── UNCHANGED — used by twin detection ──
 */
export function checkQuality(detections, videoWidth, videoHeight) {
  if (!detections || detections.length === 0) {
    return { ok: false, message: 'camera.no_face', type: 'none' };
  }
  if (detections.length > 1) {
    return { ok: false, message: 'camera.multiple', type: 'multiple' };
  }

  const det = detections[0].detection;
  const box = det.box;
  const frameArea = videoWidth * videoHeight;
  const faceArea = box.width * box.height;
  const faceRatio = faceArea / frameArea;

  if (faceRatio < 0.15) {
    return { ok: false, message: 'camera.too_far', type: 'distance' };
  }

  const brightness = estimateBrightness(det, videoWidth, videoHeight);
  if (brightness < 60) {
    return { ok: false, message: 'camera.low_light', type: 'lighting' };
  }

  return { ok: true, message: 'camera.face_locked', type: 'good' };
}

function estimateBrightness(detection, vw, vh) {
  return detection.score * 255;
}

// ═══════════════════════════════════════════════════════════════════════════
// IMPROVED POSE ESTIMATION USING ENHANCED HEURISTICS
// ═══════════════════════════════════════════════════════════════════════════
//
// This improved heuristic properly detects both left and right profiles
// by using a combination of eye width ratio and nose offset.
//
// Convention (matches ScanPanel.jsx POSE_THRESHOLDS):
//   Yaw   positive → subject's LEFT cheek toward camera (turning left)
//   Yaw   negative → subject's RIGHT cheek toward camera (turning right)
//   Pitch positive → head tilted up (chin up)
//   Roll  positive → head tilts clockwise from subject's POV
// ═══════════════════════════════════════════════════════════════════════════

export function estimatePosePnP(landmarks, videoWidth, videoHeight) {
  const positions = landmarks.positions;
  
  // Get key facial landmarks
  const leftEyeOuter = positions[36];
  const leftEyeInner = positions[39];
  const rightEyeInner = positions[42];
  const rightEyeOuter = positions[45];
  const leftJaw = positions[0];
  const rightJaw = positions[16];
  const noseTip = positions[33];
  const chin = positions[8];
  
  // Calculate eye widths
  const leftEyeWidth = Math.abs(leftEyeInner.x - leftEyeOuter.x);
  const rightEyeWidth = Math.abs(rightEyeOuter.x - rightEyeInner.x);
  
  // Calculate eye ratio for yaw detection
  const eyeTotal = leftEyeWidth + rightEyeWidth;
  let eyeRatio = 0;
  if (eyeTotal > 0.1) {
    eyeRatio = (leftEyeWidth - rightEyeWidth) / eyeTotal;
  }
  
  // Calculate nose offset relative to jaw center
  const faceCentreX = (leftJaw.x + rightJaw.x) / 2;
  const faceWidth = Math.abs(rightJaw.x - leftJaw.x);
  let noseOffset = 0;
  if (faceWidth > 0.1) {
    noseOffset = (noseTip.x - faceCentreX) / (faceWidth / 2);
  }
  
  // Combine signals with adaptive weights
  let yaw;
  const absEyeRatio = Math.abs(eyeRatio);
  
  if (absEyeRatio > 0.7) {
    // Extreme profile view - trust eye ratio more
    yaw = eyeRatio * 90;
  } else if (absEyeRatio > 0.4) {
    // Moderate profile - balance both signals
    const combined = eyeRatio * 0.6 + noseOffset * 0.4;
    yaw = combined * 90;
  } else {
    // Near frontal - trust nose offset more
    const combined = eyeRatio * 0.3 + noseOffset * 0.7;
    yaw = combined * 90;
  }
  
  // Clamp yaw to valid range
  yaw = Math.max(-90, Math.min(90, yaw));
  
  // Calculate pitch (up/down head movement)
  const chinDist = chin.y - noseTip.y;
  const browY = (positions[19].y + positions[24].y) / 2;
  const browDist = noseTip.y - browY;
  const pitchTotal = Math.abs(chinDist) + Math.abs(browDist);
  let pitch = 0;
  if (pitchTotal > 0.1) {
    pitch = ((chinDist - browDist) / pitchTotal) * 45;
  }
  pitch = Math.max(-45, Math.min(45, pitch));
  
  // Calculate roll (head tilt)
  let roll = Math.atan2(
    rightEyeOuter.y - leftEyeOuter.y,
    rightEyeOuter.x - leftEyeOuter.x
  ) * (180 / Math.PI);
  roll = Math.max(-30, Math.min(30, roll));
  
  return {
    yaw: yaw,
    pitch: pitch,
    roll: roll,
  };
}

// Legacy function kept for compatibility
function _legacyHeuristicPose(landmarks) {
  const positions = landmarks.positions;

  const leftEyeOuter  = positions[36];
  const leftEyeInner  = positions[39];
  const rightEyeInner = positions[42];
  const rightEyeOuter = positions[45];
  const leftJaw  = positions[0];
  const rightJaw = positions[16];
  const noseTip  = positions[33];
  const chin     = positions[8];
  const browMid  = {
    x: (positions[19].x + positions[24].x) / 2,
    y: (positions[19].y + positions[24].y) / 2,
  };

  const leftEyeWidth  = Math.abs(leftEyeInner.x  - leftEyeOuter.x);
  const rightEyeWidth = Math.abs(rightEyeOuter.x - rightEyeInner.x);
  const eyeTotal = leftEyeWidth + rightEyeWidth;
  const eyeRatio = eyeTotal > 1 ? (leftEyeWidth - rightEyeWidth) / eyeTotal : 0;

  const faceCentreX = (leftJaw.x + rightJaw.x) / 2;
  const faceWidth   = Math.abs(rightJaw.x - leftJaw.x);
  const noseOffset  = faceWidth > 1 ? (noseTip.x - faceCentreX) / (faceWidth / 2) : 0;

  const combined = eyeRatio * 0.65 + noseOffset * 0.35;
  const yaw = Math.max(-90, Math.min(90, (combined / 0.7) * 90));

  const chinDist   = chin.y    - noseTip.y;
  const browDist   = noseTip.y - browMid.y;
  const pitchTotal = chinDist + browDist;
  const pitch = pitchTotal > 0 ? Math.max(-45, Math.min(45, ((chinDist - browDist) / pitchTotal) * 45)) : 0;

  const roll = Math.atan2(
    rightEyeOuter.y - leftEyeOuter.y,
    rightEyeOuter.x - leftEyeOuter.x
  ) * (180 / Math.PI);

  return {
    yaw:   Math.max(-90, Math.min(90, yaw)),
    pitch: Math.max(-45, Math.min(45, pitch)),
    roll:  Math.max(-30, Math.min(30, roll)),
  };
}