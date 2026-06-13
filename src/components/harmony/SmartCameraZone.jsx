import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { loadFaceApiModels, detectFace, estimatePosePnP } from '../../lib/faceapiUI';
import { preloadFaceMesh, initFaceMesh, drawFaceScannerOverlay, isMeshPreloaded } from '../../lib/mediapipeFaceMesh';
import { getOverlayLabels } from '../../lib/i18nHelpers';

const SILHOUETTES = {
  front: (
    <svg viewBox="0 0 100 120" className="w-full h-full opacity-25">
      <ellipse cx="50" cy="35" rx="22" ry="26" stroke="#7f5af0" strokeWidth="1.5" fill="none" />
      <path d="M28 55 Q50 115 72 55" stroke="#7f5af0" strokeWidth="1.5" fill="none" />
      <line x1="28" y1="55" x2="20" y2="80" stroke="#7f5af0" strokeWidth="1.5" />
      <line x1="72" y1="55" x2="80" y2="80" stroke="#7f5af0" strokeWidth="1.5" />
    </svg>
  ),
  left: (
    <svg viewBox="0 0 100 120" className="w-full h-full opacity-25">
      <path d="M60 20 C40 20 35 35 35 50 C35 70 45 85 60 90" stroke="#7f5af0" strokeWidth="1.5" fill="none" />
      <path d="M60 90 Q65 100 55 115" stroke="#7f5af0" strokeWidth="1.5" fill="none" />
      <line x1="60" y1="50" x2="75" y2="70" stroke="#7f5af0" strokeWidth="1.5" />
    </svg>
  ),
  right: (
    <svg viewBox="0 0 100 120" className="w-full h-full opacity-25">
      <path d="M40 20 C60 20 65 35 65 50 C65 70 55 85 40 90" stroke="#7f5af0" strokeWidth="1.5" fill="none" />
      <path d="M40 90 Q35 100 45 115" stroke="#7f5af0" strokeWidth="1.5" fill="none" />
      <line x1="40" y1="50" x2="25" y2="70" stroke="#7f5af0" strokeWidth="1.5" />
    </svg>
  ),
};

const STABILITY_FRAMES = {
  front: 15,
  left: 12,
  right: 10,
};

const BOX_STABILITY_TOLERANCE = {
  front: 60,
  left: 80,
  right: 90,
};

const POSE_THRESHOLDS = {
  front: { yaw: { min: -30, max: 30  }, pitch: { min: -20, max: 20 }, roll: { min: -20, max: 20 } },
  left:  { yaw: { min: 42,  max: 90  }, pitch: { min: -20, max: 20 }, roll: { min: -25, max: 25 } },
  right: { yaw: { min: -90, max: -40 }, pitch: { min: -20, max: 20 }, roll: { min: -25, max: 25 } },
};

function getPoseGuidance(viewType, pose, faceBox, videoWidth, videoHeight, t) {
  const { yaw, pitch, roll } = pose;
  const thresholds = POSE_THRESHOLDS[viewType];
  const dir = (which) => t(`harmony.dir.${which}`);

  if (viewType === 'front') {
    if (yaw < thresholds.yaw.min || yaw > thresholds.yaw.max) {
      return {
        needsAdjustment: true,
        message: t('harmony.pose.turn_dir', { dir: yaw > 0 ? dir('left') : dir('right') }),
        color: '#ffaa33',
      };
    }
    if (pitch < thresholds.pitch.min) {
      return { needsAdjustment: true, message: t('harmony.pose.lift_chin'), color: '#ffaa33' };
    }
    if (pitch > thresholds.pitch.max) {
      return { needsAdjustment: true, message: t('harmony.pose.lower_chin'), color: '#ffaa33' };
    }
    if (roll < thresholds.roll.min || roll > thresholds.roll.max) {
      return { needsAdjustment: true, message: t('harmony.pose.straighten_head'), color: '#ffaa33' };
    }
    const faceCenterX = faceBox.x + faceBox.width / 2;
    const faceCenterY = faceBox.y + faceBox.height / 2;
    if (Math.abs(faceCenterX - videoWidth / 2) / (videoWidth / 2) > 0.40) {
      return {
        needsAdjustment: true,
        message: t('harmony.pose.move_dir', { dir: faceCenterX < videoWidth / 2 ? dir('left') : dir('right') }),
        color: '#ffaa33',
      };
    }
    if (Math.abs(faceCenterY - videoHeight / 2) / (videoHeight / 2) > 0.40) {
      return {
        needsAdjustment: true,
        message: t('harmony.pose.move_vertical', { dir: faceCenterY < videoHeight / 2 ? dir('down') : dir('up') }),
        color: '#ffaa33',
      };
    }
  }

  if (viewType === 'left') {
    if (yaw < -20) return { needsAdjustment: true, message: t('harmony.pose.wrong_left'), color: '#ff5454' };
    if (yaw < thresholds.yaw.min) return { needsAdjustment: true, message: t('harmony.pose.turn_more_left'), color: '#ffaa33' };
    if (yaw > thresholds.yaw.max) return { needsAdjustment: true, message: t('harmony.pose.turn_back'), color: '#ffaa33' };
    if (pitch < thresholds.pitch.min || pitch > thresholds.pitch.max) {
      return { needsAdjustment: true, message: t('harmony.pose.head_tilted'), color: '#ff5454' };
    }
    if (roll < thresholds.roll.min || roll > thresholds.roll.max) {
      return { needsAdjustment: true, message: t('harmony.pose.chin_level'), color: '#ffaa33' };
    }
  }

  if (viewType === 'right') {
    if (yaw > 20) return { needsAdjustment: true, message: t('harmony.pose.wrong_right'), color: '#ff5454' };
    if (yaw > thresholds.yaw.max) return { needsAdjustment: true, message: t('harmony.pose.turn_more_right'), color: '#ffaa33' };
    if (yaw < thresholds.yaw.min) return { needsAdjustment: true, message: t('harmony.pose.turn_back'), color: '#ffaa33' };
    if (pitch < thresholds.pitch.min || pitch > thresholds.pitch.max) {
      return { needsAdjustment: true, message: t('harmony.pose.head_tilted'), color: '#ff5454' };
    }
    if (roll < thresholds.roll.min || roll > thresholds.roll.max) {
      return { needsAdjustment: true, message: t('harmony.pose.chin_level'), color: '#ffaa33' };
    }
  }

  return { needsAdjustment: false, message: t('harmony.pose.hold_still'), color: '#00ff88' };
}

// Mirrored frame helper — mirrors video into offscreen canvas before sending to MediaPipe
let _mirrorCanvas = null;
function getMirroredFrame(video, overlayCanvas) {
  const cw = overlayCanvas?.width  || video.videoWidth  || 640;
  const ch = overlayCanvas?.height || video.videoHeight || 480;
  const vw = video.videoWidth  || 640;
  const vh = video.videoHeight || 480;

  if (!_mirrorCanvas) _mirrorCanvas = document.createElement('canvas');
  if (_mirrorCanvas.width !== cw || _mirrorCanvas.height !== ch) {
    _mirrorCanvas.width = cw;
    _mirrorCanvas.height = ch;
  }

  const ctx = _mirrorCanvas.getContext('2d');
  const canvasAR = cw / ch;
  const videoAR  = vw / vh;
  let sx = 0, sy = 0, sw = vw, sh = vh;
  if (videoAR > canvasAR) { sw = Math.round(vh * canvasAR); sx = Math.round((vw - sw) / 2); }
  else                    { sh = Math.round(vw / canvasAR); sy = Math.round((vh - sh) / 2); }

  ctx.save();
  ctx.translate(cw, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, sx, sy, sw, sh, 0, 0, cw, ch);
  ctx.restore();
  return _mirrorCanvas;
}

export default function SmartCameraZone({
  viewType, active = false, capture, errorMessage,
  disableAutoCapture = false, onCapture, onRetake,
  onUpload, hideHeader = false,
}) {
  const { t, lang } = useLanguage();
  const overlayLabelsRef = useRef(getOverlayLabels(t));
  const videoRef     = useRef(null);
  const canvasRef    = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef    = useRef(null);
  const rafRef       = useRef(null);
  const stableRef    = useRef(0);
  const lastBoxRef   = useRef(null);
  const activeRef    = useRef(active);
  const capturedRef  = useRef(false);
  const startingRef  = useRef(false);
  const meshRafRef   = useRef(null);
  const mediaPipeReady        = useRef(false);
  const mediaPipeInitialized  = useRef(false);
  const frameCountRef = useRef(0); // Frame counter for throttling

  const [hudText,   setHudText]   = useState('');
  const [hudColor,  setHudColor]  = useState('#9d7fe3');
  const [status,    setStatus]    = useState('idle');
  const [meshReady, setMeshReady] = useState(false);

  const hasPreview = Boolean(capture?.preview);
  const requiredStabilityFrames = STABILITY_FRAMES[viewType] ?? STABILITY_FRAMES.front;
  const boxTolerance = BOX_STABILITY_TOLERANCE[viewType] ?? BOX_STABILITY_TOLERANCE.front;

  useEffect(() => {
    overlayLabelsRef.current = getOverlayLabels(t);
  }, [lang, t]);

  // Stop only the animation loops, keep the camera stream alive for next view
  const stopCamera = useCallback((keepStream = true) => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    if (meshRafRef.current) { cancelAnimationFrame(meshRafRef.current); meshRafRef.current = null; }
    
    if (!keepStream && streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  }, []);

  // KEY FIX: reset only state that needs to change for new view, keep camera/stream alive
  const resetState = useCallback(() => {
    stableRef.current          = 0;
    lastBoxRef.current         = null;
    capturedRef.current        = false;
    frameCountRef.current = 0;
    setHudText(t('harmony.status.ready'));
    setHudColor('#00ff88');
    setStatus('scanning');
  }, [t]);

  const finishCapture = useCallback(async () => {
    const video = videoRef.current;
    if (!video || capturedRef.current) return;
    capturedRef.current = true;
    if (rafRef.current)     { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    if (meshRafRef.current) { cancelAnimationFrame(meshRafRef.current); meshRafRef.current = null; }

    try {
      const canvas = document.createElement('canvas');
      const vw = video.videoWidth  || 1280;
      const vh = video.videoHeight || 720;
      const TARGET = 1080;
      const scale  = Math.max(1, TARGET / Math.max(vw, vh));
      canvas.width  = Math.round(vw * scale);
      canvas.height = Math.round(vh * scale);

      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.97));
      if (!blob) throw new Error('Canvas empty');

      const preview = URL.createObjectURL(blob);
      stopCamera(true); // Keep the stream alive for next view
      setStatus('captured');
      setHudText(t('harmony.status.captured'));
      setHudColor('#00ff88');
      onCapture?.({ viewType, blob, preview });
    } catch (err) {
      capturedRef.current = false;
      setStatus('error');
      setHudText(t('harmony.status.failed'));
      setHudColor('#ff5454');
    }
  }, [onCapture, stopCamera, viewType, t]);

  const handleMediaPipeResults = useCallback((results) => {
    if (!activeRef.current || capturedRef.current) return;
    const canvas = canvasRef.current;
    const video  = videoRef.current;
    if (!canvas || !video) return;

    const ctx  = canvas.getContext('2d');
    const rect = video.getBoundingClientRect();
    if (canvas.width !== Math.round(rect.width) || canvas.height !== Math.round(rect.height)) {
      canvas.width  = Math.round(rect.width);
      canvas.height = Math.round(rect.height);
    }

    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
      const landmarks = results.multiFaceLandmarks[0];
      if (!mediaPipeReady.current) {
        mediaPipeReady.current = true;
        setMeshReady(true);
        stableRef.current = 0;
      }
      // shouldMirror=false because getMirroredFrame already handled the flip
      drawFaceScannerOverlay(ctx, landmarks, canvas.width, canvas.height, 0.85, false, overlayLabelsRef.current);
    }
  }, [viewType]);

  const initMediaPipeMesh = useCallback(async () => {
    if (mediaPipeInitialized.current) return;
    mediaPipeInitialized.current = true;

    await initFaceMesh(handleMediaPipeResults);
  }, [handleMediaPipeResults]);

  const detectLoop = useCallback(async () => {
    if (!activeRef.current || capturedRef.current) return;
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) {
      rafRef.current = requestAnimationFrame(detectLoop);
      return;
    }

    const rect = video.getBoundingClientRect();
    if (canvas.width !== Math.round(rect.width) || canvas.height !== Math.round(rect.height)) {
      canvas.width  = Math.round(rect.width);
      canvas.height = Math.round(rect.height);
    }

    frameCountRef.current += 1;
    const currentFrame = frameCountRef.current;

    // Send frame to MediaPipe every frame
    const meshInstance = window.faceMeshInstance;
    if (meshInstance) {
      try {
        const mirrored = getMirroredFrame(video, canvas);
        await meshInstance.send({ image: mirrored });
      } catch (err) {}
    }

    // Throttle face detection to every 3rd frame (tasks 2 & 3)
    if (currentFrame % 3 === 0) {
      const detections = await detectFace(video);
      if (!activeRef.current || capturedRef.current) return;

      const ctx = canvas.getContext('2d');
      if (!mediaPipeReady.current) ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!detections || detections.length === 0) {
        setHudText(t('harmony.status.no_face')); setHudColor('#ff5454');
        stableRef.current = 0; lastBoxRef.current = null;
      } else if (detections.length > 1) {
        setHudText(t('harmony.status.multiple')); setHudColor('#ff5454');
        stableRef.current = 0; lastBoxRef.current = null;
      } else {
        const det = detections[0];
        const box = det.detection.box;
        const landmarks = det.landmarks;
        const faceRatio = (box.width * box.height) / (video.videoWidth * video.videoHeight);

        if (faceRatio < 0.12) {
          setHudText(t('harmony.status.too_far')); setHudColor('#ffaa33');
          stableRef.current = 0; lastBoxRef.current = null;
        } else if (faceRatio > 0.65) {
          setHudText(t('harmony.status.too_close')); setHudColor('#ffaa33');
          stableRef.current = 0; lastBoxRef.current = null;
        } else {
          const pose = estimatePosePnP(landmarks, video.videoWidth, video.videoHeight);
          // Flip yaw because video is mirrored (scale-x-[-1])
          const flippedPose = { ...pose, yaw: -pose.yaw };

          const guidance = getPoseGuidance(viewType, flippedPose, box, video.videoWidth, video.videoHeight, t);
          if (guidance.needsAdjustment) {
            setHudText(guidance.message); setHudColor(guidance.color);
            stableRef.current = 0; lastBoxRef.current = null;
          } else {
            if (lastBoxRef.current) {
          const dx = Math.abs(box.x - lastBoxRef.current.x);
          const dy = Math.abs(box.y - lastBoxRef.current.y);
          if (dx > boxTolerance || dy > boxTolerance) {
            setHudText(t('harmony.pose.stabilizing')); setHudColor('#ffaa33');
            stableRef.current = Math.max(0, stableRef.current - 6);
            lastBoxRef.current = { x: box.x, y: box.y, width: box.width, height: box.height };
          } else {
            lastBoxRef.current = { x: box.x, y: box.y, width: box.width, height: box.height };
            if (mediaPipeReady.current) { stableRef.current += 1; } else { stableRef.current = 0; }
            if (stableRef.current >= requiredStabilityFrames && !disableAutoCapture && !capturedRef.current && mediaPipeReady.current) {
              setHudText(t('harmony.status.capturing')); setHudColor('#00ff88');
              await finishCapture(); return;
            }
            const remaining = Math.max(1, requiredStabilityFrames - stableRef.current);
            if (disableAutoCapture) {
              setHudText(t('harmony.status.manual_capture')); setHudColor('#ffaa33');
            } else if (!mediaPipeReady.current) {
              setHudText(t('harmony.status.loading_tracking')); setHudColor('#ffaa33');
            } else {
              setHudText(`Capture in ${remaining}...`); setHudColor('#00ff88');
            }
          }
            } else {
              lastBoxRef.current = { x: box.x, y: box.y, width: box.width, height: box.height };
              stableRef.current = 0;
            }
          }
        }
      }
    }

    rafRef.current = requestAnimationFrame(detectLoop);
  }, [finishCapture, viewType, disableAutoCapture, t, boxTolerance, requiredStabilityFrames]);

  const startCamera = useCallback(async () => {
    if (startingRef.current) return;
    startingRef.current = true;
    try {
      resetState();
      activeRef.current = true;

      // If stream already exists, just reuse it!
      if (streamRef.current && videoRef.current) {
        const video = videoRef.current;
        // Make sure video is still playing
        if (video.paused) {
          await video.play();
        }
        
        // Ensure models are loaded
        await loadFaceApiModels();

        // Ensure mesh is ready
        if (isMeshPreloaded()) {
          mediaPipeReady.current = true;
          setMeshReady(true);
        } else if (!mediaPipeInitialized.current) {
          setHudText(t('harmony.status.loading_tracking'));
          setHudColor('#ffaa33');
          initMediaPipeMesh();
        }

        // Restart the detection loop
        stableRef.current  = 0;
        lastBoxRef.current = null;
        rafRef.current = requestAnimationFrame(detectLoop);
        
        startingRef.current = false;
        return;
      }

      // No stream yet — start fresh
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;

      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        await new Promise((resolve, reject) => {
          const onMeta = () => { cleanup(); resolve(); };
          const onErr  = (e) => { cleanup(); reject(e); };
          const cleanup = () => {
            video.removeEventListener('loadedmetadata', onMeta);
            video.removeEventListener('error', onErr);
          };
          video.addEventListener('loadedmetadata', onMeta, { once: true });
          video.addEventListener('error', onErr, { once: true });
          if (video.readyState >= 1) { cleanup(); resolve(); }
        });
        await video.play();
      }

      await loadFaceApiModels();

      if (isMeshPreloaded()) {
        mediaPipeReady.current = true;
        setMeshReady(true);
        setHudText(t('harmony.status.ready'));
        setHudColor('#00ff88');
      } else {
        setHudText(t('harmony.status.loading_tracking'));
        setHudColor('#ffaa33');
      }

      initMediaPipeMesh();
      setStatus('scanning');
      stableRef.current  = 0;
      lastBoxRef.current = null;
      rafRef.current = requestAnimationFrame(detectLoop);
    } catch (err) {
      if (err.name !== 'AbortError') { setStatus('error'); setHudText(t('harmony.status.camera_unavailable')); setHudColor('#ff5454'); }
      activeRef.current = false;
      stopCamera();
    } finally {
      startingRef.current = false;
    }
  }, [detectLoop, resetState, stopCamera, initMediaPipeMesh, viewType, t]);

  useEffect(() => { activeRef.current = active; }, [active]);

  // Watch for viewType changes and reset only tracking state
  useEffect(() => {
    if (active && !hasPreview) {
      resetState();
      if (streamRef.current && !rafRef.current) {
        // Restart the detection loop for new view
        stableRef.current = 0;
        lastBoxRef.current = null;
        rafRef.current = requestAnimationFrame(detectLoop);
      }
    }
  }, [viewType, active, hasPreview, resetState, detectLoop]);

  // Initialize camera on mount
  useEffect(() => {
    if (!hasPreview && !streamRef.current && active) {
      startCamera();
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera(false);
    };
  }, []);

  useEffect(() => {
    if (!active && hasPreview) {
      setStatus('captured'); setHudText(t('harmony.status.captured')); setHudColor('#00ff88');
    }
  }, [active, hasPreview, t]);

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (onUpload) {
      onUpload(event);
    } else {
      const preview = URL.createObjectURL(file);
      stopCamera();
      setStatus('captured'); setHudText(t('harmony.status.upload_ready')); setHudColor('#00ff88');
      capturedRef.current = true;
      onCapture?.({ viewType, blob: file, preview });
    }
  };

  return (
    <div className={`relative bg-[#060608] border rounded-lg overflow-hidden transition-shadow duration-300 ${active ? 'border-[#7f5af0] shadow-[0_0_30px_rgba(127,90,240,0.25)]' : 'border-[#1f1f25]'}`}>
      {!hideHeader && (
        <div className="border-b border-[#1f1f25] bg-[#101017]">
          <div className="text-[12px] text-[#d4b8ff] uppercase tracking-[0.18em] font-mono px-4 pt-3 text-center">{t(`harmony.view.${viewType}.label`)}</div>
          <div className="text-[10px] text-[#5a3fcf] uppercase tracking-[0.12em] font-mono px-4 pb-3 text-center">{t(`harmony.view.${viewType}.hint`)}</div>
        </div>
      )}

      {errorMessage && (
        <div className="px-4 py-2 bg-[#2b121a] border-b border-[#401924] text-[11px] font-mono text-[#ff8585] text-center">{errorMessage}</div>
      )}

      <div className="relative aspect-[4/3] bg-black overflow-hidden">
        {active && !hasPreview && (
          <>
            <video ref={videoRef} autoPlay playsInline muted
              className="absolute inset-0 w-full h-full object-cover scale-x-[-1]" />
            <canvas ref={canvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[40%] h-[40%]">{SILHOUETTES[viewType]}</div>
            </div>
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <span className="inline-block text-[11px] font-mono uppercase tracking-wider px-3 py-1.5 bg-black/70 rounded" style={{ color: hudColor }}>
                {hudText}
              </span>
            </div>
          </>
        )}

        {hasPreview && (
          <div className="absolute inset-0">
            <img src={capture.preview} alt={`${viewType} capture`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/45 flex flex-col items-center justify-center gap-2 pointer-events-none">
              <span className="text-[#00ff88] text-[13px] font-mono uppercase tracking-[0.3em]">{t('harmony.status.locked')}</span>
            </div>
          </div>
        )}

        {!active && !hasPreview && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#09090c]/80 text-center px-6">
            <div className="text-[#5a3fcf] text-[11px] font-mono uppercase tracking-[0.25em]">{t('harmony.status.awaiting')}</div>
          </div>
        )}
      </div>

      <div className="p-4 flex items-center justify-between border-t border-[#1f1f25]">
        <div className="flex items-center gap-3">
          {hasPreview && (
            <button onClick={() => { capturedRef.current = false; onRetake?.(viewType); }}
              className="text-[11px] text-[#ffaa33] uppercase tracking-wider font-mono hover:text-[#ffc273] transition-colors">
              {t('harmony.btn.recapture')}
            </button>
          )}
          {active && !hasPreview && status === 'scanning' && !disableAutoCapture && meshReady && (
            <span className="text-[11px] text-[#00ff88] font-mono">{t('harmony.status.ready')}</span>
          )}
          {active && !hasPreview && status === 'scanning' && !meshReady && (
            <span className="text-[11px] text-[#ffaa33] font-mono">{t('harmony.status.loading')}</span>
          )}
          {active && !hasPreview && status === 'scanning' && disableAutoCapture && meshReady && (
            <button onClick={() => finishCapture()}
              className="text-[11px] text-[#ffaa33] uppercase tracking-wider font-mono hover:text-[#ffc273] transition-colors">
              {t('harmony.btn.capture_now')}
            </button>
          )}
          {active && !hasPreview && status === 'error' && (
            <button onClick={() => { capturedRef.current = false; onRetake?.(viewType); }}
              className="text-[11px] text-[#ff5454] uppercase tracking-wider font-mono hover:text-[#ff8585] transition-colors">
              {t('harmony.btn.retry')}
            </button>
          )}
        </div>
        <div>
          <button onClick={() => fileInputRef.current?.click()}
            className="text-[11px] text-[#5a3fcf] uppercase tracking-wider font-mono hover:text-[#9d7fe3] transition-colors">
            {t('harmony.btn.upload')}
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </div>
      </div>
    </div>
  );
}
