/**
 * Precision AR Face Tracking Overlay
 * Optimized for transformed/mirrored coordinates from ScanPanel
 */

const NEON_GREEN = '#00ff88';
const NEON_CYAN = '#00ccff';
const NEON_PINK = '#ff2d75';
const ELECTRIC_YELLOW = '#ffcc00';
const WHITE = '#ffffff';

const DEFAULT_LABELS = { locked: 'LOCKED', tracking: 'TRACKING', align: 'ALIGN' };

export function drawMysticOverlay(ctx, detections, width, height, time = Date.now(), labels = DEFAULT_LABELS) {
  ctx.clearRect(0, 0, width, height);
  if (!detections || detections.length === 0) return;

  const det = detections[0];
  const landmarks = det.landmarks;
  const positions = landmarks.positions;

  const box = det.detection.box;
  const quality = det.detection.score || 0.5;

  // Draw ALL 68 landmarks as small dots first (debug/verification)
  drawAllLandmarks(ctx, positions);
  
  // Draw feature groups
  drawEyes(ctx, positions);
  drawNose(ctx, positions);
  drawMouth(ctx, positions);
  drawFaceOutline(ctx, positions);
  drawBoundingBox(ctx, box, quality);
  drawStatusOverlay(ctx, box, quality, labels);
}

// Draw ALL 68 landmarks as tiny dots - this ensures alignment is correct
function drawAllLandmarks(ctx, positions) {
  if (!positions || positions.length < 68) return;
  
  for (let i = 0; i < positions.length; i++) {
    const p = positions[i];
    if (p && isFinite(p.x) && isFinite(p.y)) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 255, 136, 0.5)';
      ctx.fill();
    }
  }
}

// Draw eyes with correct indices (36-41 left, 42-47 right)
function drawEyes(ctx, positions) {
  ctx.save();
  ctx.strokeStyle = NEON_PINK;
  ctx.fillStyle = NEON_PINK;
  ctx.lineWidth = 2;
  ctx.shadowBlur = 4;
  ctx.shadowColor = NEON_PINK;
  
  // Left eye (36-41)
  if (positions[36] && positions[41]) {
    ctx.beginPath();
    for (let i = 36; i <= 41; i++) {
      const p = positions[i];
      if (p) {
        if (i === 36) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
    }
    ctx.closePath();
    ctx.stroke();
    
    // Left pupil center
    let leftSumX = 0, leftSumY = 0;
    for (let i = 36; i <= 41; i++) {
      leftSumX += positions[i].x;
      leftSumY += positions[i].y;
    }
    const leftCenter = { x: leftSumX / 6, y: leftSumY / 6 };
    ctx.beginPath();
    ctx.arc(leftCenter.x, leftCenter.y, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Right eye (42-47)
  if (positions[42] && positions[47]) {
    ctx.beginPath();
    for (let i = 42; i <= 47; i++) {
      const p = positions[i];
      if (p) {
        if (i === 42) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
    }
    ctx.closePath();
    ctx.stroke();
    
    // Right pupil center
    let rightSumX = 0, rightSumY = 0;
    for (let i = 42; i <= 47; i++) {
      rightSumX += positions[i].x;
      rightSumY += positions[i].y;
    }
    const rightCenter = { x: rightSumX / 6, y: rightSumY / 6 };
    ctx.beginPath();
    ctx.arc(rightCenter.x, rightCenter.y, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  
  ctx.restore();
}

// Draw nose with correct indices (27-35)
function drawNose(ctx, positions) {
  ctx.save();
  ctx.strokeStyle = NEON_CYAN;
  ctx.fillStyle = NEON_CYAN;
  ctx.lineWidth = 2;
  ctx.shadowBlur = 4;
  ctx.shadowColor = NEON_CYAN;
  
  // Nose bridge (27-30)
  if (positions[27] && positions[30]) {
    ctx.beginPath();
    for (let i = 27; i <= 30; i++) {
      const p = positions[i];
      if (p) {
        if (i === 27) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
    }
    ctx.stroke();
  }
  
  // Nose base (31-35)
  if (positions[31] && positions[35]) {
    ctx.beginPath();
    ctx.moveTo(positions[31].x, positions[31].y);
    ctx.lineTo(positions[33].x, positions[33].y);
    ctx.lineTo(positions[35].x, positions[35].y);
    ctx.lineTo(positions[34].x, positions[34].y);
    ctx.closePath();
    ctx.stroke();
    
    // Nose tip highlight
    if (positions[33]) {
      ctx.beginPath();
      ctx.arc(positions[33].x, positions[33].y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  ctx.restore();
}

// Draw mouth with correct indices (48-67)
function drawMouth(ctx, positions) {
  ctx.save();
  ctx.strokeStyle = NEON_PINK;
  ctx.fillStyle = NEON_PINK;
  ctx.lineWidth = 2;
  ctx.shadowBlur = 4;
  ctx.shadowColor = NEON_PINK;
  
  // Outer lips (48-59)
  if (positions[48] && positions[59]) {
    ctx.beginPath();
    for (let i = 48; i <= 59; i++) {
      const p = positions[i];
      if (p) {
        if (i === 48) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
    }
    ctx.closePath();
    ctx.stroke();
  }
  
  // Inner lips (60-67)
  if (positions[60] && positions[67]) {
    ctx.beginPath();
    for (let i = 60; i <= 67; i++) {
      const p = positions[i];
      if (p) {
        if (i === 60) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
    }
    ctx.closePath();
    ctx.stroke();
  }
  
  // Mouth corners
  if (positions[48] && positions[54]) {
    ctx.fillStyle = WHITE;
    ctx.beginPath();
    ctx.arc(positions[48].x, positions[48].y, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(positions[54].x, positions[54].y, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
  
  ctx.restore();
}

// Draw face outline (jawline 0-16, eyebrows 17-26)
function drawFaceOutline(ctx, positions) {
  ctx.save();
  ctx.strokeStyle = `rgba(0, 255, 136, 0.3)`;
  ctx.lineWidth = 1;
  ctx.shadowBlur = 0;
  
  // Jawline (0-16)
  if (positions[0] && positions[16]) {
    ctx.beginPath();
    for (let i = 0; i <= 16; i++) {
      const p = positions[i];
      if (p) {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
    }
    ctx.stroke();
  }
  
  // Left eyebrow (17-21)
  if (positions[17] && positions[21]) {
    ctx.beginPath();
    for (let i = 17; i <= 21; i++) {
      const p = positions[i];
      if (p) {
        if (i === 17) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
    }
    ctx.stroke();
  }
  
  // Right eyebrow (22-26)
  if (positions[22] && positions[26]) {
    ctx.beginPath();
    for (let i = 22; i <= 26; i++) {
      const p = positions[i];
      if (p) {
        if (i === 22) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
    }
    ctx.stroke();
  }
  
  ctx.restore();
}

// Draw bounding box with corner brackets
function drawBoundingBox(ctx, box, quality) {
  if (!box || !isFinite(box.x)) return;
  
  const corner = 12;
  const left = box.x;
  const top = box.y;
  const right = box.x + box.width;
  const bottom = box.y + box.height;
  
  ctx.save();
  ctx.strokeStyle = quality > 0.7 ? NEON_GREEN : ELECTRIC_YELLOW;
  ctx.lineWidth = 1.5;
  ctx.shadowBlur = 4;
  ctx.shadowColor = NEON_GREEN;
  
  // Top-left
  ctx.beginPath();
  ctx.moveTo(left - 5, top + corner);
  ctx.lineTo(left - 5, top - 5);
  ctx.lineTo(left + corner, top - 5);
  ctx.stroke();
  
  // Top-right
  ctx.beginPath();
  ctx.moveTo(right + 5 - corner, top - 5);
  ctx.lineTo(right + 5, top - 5);
  ctx.lineTo(right + 5, top + corner);
  ctx.stroke();
  
  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(right + 5, bottom - corner);
  ctx.lineTo(right + 5, bottom + 5);
  ctx.lineTo(right + 5 - corner, bottom + 5);
  ctx.stroke();
  
  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(left - 5, bottom - corner);
  ctx.lineTo(left - 5, bottom + 5);
  ctx.lineTo(left + corner, bottom + 5);
  ctx.stroke();
  
  ctx.restore();
}

// Draw status text and progress bar
function drawStatusOverlay(ctx, box, quality, labels = DEFAULT_LABELS) {
  if (!box || !isFinite(box.x)) return;
  
  ctx.save();
  ctx.font = 'bold 10px "Courier New", monospace';
  ctx.shadowBlur = 0;
  
  // Progress bar
  const barY = box.y - 12;
  const barHeight = 2;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.fillRect(box.x, barY, box.width, barHeight);
  
  const fillWidth = box.width * quality;
  const gradient = ctx.createLinearGradient(box.x, 0, box.x + fillWidth, 0);
  gradient.addColorStop(0, NEON_CYAN);
  gradient.addColorStop(1, NEON_GREEN);
  ctx.fillStyle = gradient;
  ctx.fillRect(box.x, barY, fillWidth, barHeight);
  
  // Percentage
  ctx.fillStyle = NEON_GREEN;
  ctx.textAlign = 'right';
  ctx.fillText(`${Math.round(quality * 100)}%`, box.x + box.width, barY - 3);
  
  // Status text
  ctx.fillStyle = quality > 0.8 ? NEON_GREEN : ELECTRIC_YELLOW;
  ctx.textAlign = 'left';
  const statusText = quality > 0.85 ? labels.locked : (quality > 0.6 ? labels.tracking : labels.align);
  ctx.fillText(statusText, box.x, barY - 3);
  
  ctx.restore();
}