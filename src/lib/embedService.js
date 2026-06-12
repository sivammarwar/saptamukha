const FACE_API_BASE_URL =
  import.meta.env.VITE_FACE_API_BASE_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_EMBED_SERVICE_URL ||
  (import.meta.env.DEV ? 'http://localhost:8000' : '/api/vision');
const EMBED_API_KEY = import.meta.env.VITE_EMBED_API_KEY || '';

/**
 * Adapt obfuscated server response back to clean internal shape.
 * Server returns compact keys to keep the client contract minimal.
 */
function adaptResponse(data) {
  return {
    embedding: data.v,
    quality: data.q,
  };
}

/**
 * Capture a single frame from a video element and send to embedding service.
 */
export async function captureAndEmbed(videoElement) {
  const blob = await captureSingleFrame(videoElement);
  const formData = new FormData();
  formData.append('file', blob, 'capture.jpg');

  const headers = {};
  if (EMBED_API_KEY) headers['X-API-Key'] = EMBED_API_KEY;

  const response = await fetch(`${FACE_API_BASE_URL}/embed`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || 'embed_failed');
  }

  const data = await response.json();
  return { ...adaptResponse(data), image: blob };
}

/**
 * Capture a single frame from video element.
 * Returns a Blob (JPEG).
 */
async function captureSingleFrame(video) {
  const canvas = document.createElement('canvas');
  const vw = video.videoWidth || 640;
  const vh = video.videoHeight || 480;
  const size = Math.min(vw, vh, 640);
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Center crop
  const sx = (vw - size) / 2;
  const sy = (vh - size) / 2;
  ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size);

  return await new Promise(res => canvas.toBlob(res, 'image/jpeg', 0.92));
}

/**
 * Send a single uploaded image file for embedding.
 */
export async function embedImageFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  const headers = {};
  if (EMBED_API_KEY) headers['X-API-Key'] = EMBED_API_KEY;

  const response = await fetch(`${FACE_API_BASE_URL}/embed`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || 'embed_failed');
  }

  const data = await response.json();
  return { ...adaptResponse(data), image: file };
}
