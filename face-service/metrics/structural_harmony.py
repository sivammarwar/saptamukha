import numpy as np
from .scorer import gaussian_score
from .constants import (
    JAW, NOSE, LEFT_MOUTH_CORNER, RIGHT_MOUTH_CORNER,
    LEFT_EYE_OUTER, LEFT_EYE_INNER, RIGHT_EYE_INNER, RIGHT_EYE_OUTER,
    OUTER_LIPS,
)

def dist(a, b):
    return np.linalg.norm(np.array(a) - np.array(b))

def _alar_width(lm106):
    """Spatially derive alar width from lower portion of NOSE landmarks."""
    nose_pts = [lm106[i] for i in NOSE if i < len(lm106)]
    if len(nose_pts) < 3:
        return 30.0
    nose_ys = [p[1] for p in nose_pts]
    y_min, y_max = min(nose_ys), max(nose_ys)
    threshold = y_min + (y_max - y_min) * 0.40
    lower = [p for p in nose_pts if p[1] >= threshold] or nose_pts
    return dist(
        min(lower, key=lambda p: p[0]),
        max(lower, key=lambda p: p[0]),
    )

def compute(lm106):
    """
    Structural harmony: how closely key facial ratios approach golden ratio φ = 1.618.
    Returns realistic score 40-98.
    """

    # Full face dimensions
    all_ys = [pt[1] for pt in lm106]
    face_h = max(all_ys) - min(all_ys)
    face_w = dist(lm106[JAW[0]], lm106[JAW[32]]) if len(lm106) > 32 else 100

    # Feature measurements
    nose_w = _alar_width(lm106)
    mouth_w = dist(lm106[LEFT_MOUTH_CORNER], lm106[RIGHT_MOUTH_CORNER]) if len(lm106) > max(LEFT_MOUTH_CORNER, RIGHT_MOUTH_CORNER) else 40
    left_eye_w = dist(lm106[LEFT_EYE_OUTER], lm106[LEFT_EYE_INNER]) if len(lm106) > max(LEFT_EYE_OUTER, LEFT_EYE_INNER) else 20
    right_eye_w = dist(lm106[RIGHT_EYE_OUTER], lm106[RIGHT_EYE_INNER]) if len(lm106) > max(RIGHT_EYE_OUTER, RIGHT_EYE_INNER) else 20
    avg_eye_w = (left_eye_w + right_eye_w) / 2.0
    eye_spacing = dist(lm106[LEFT_EYE_INNER], lm106[RIGHT_EYE_INNER]) if len(lm106) > max(LEFT_EYE_INNER, RIGHT_EYE_INNER) else 50

    if len(lm106) > NOSE[-1] and len(lm106) > JAW[16]:
        nose_chin = dist(lm106[NOSE[-1]], lm106[JAW[16]])
    else:
        nose_chin = face_h * 0.6
        
    if len(lm106) > OUTER_LIPS[-1] and len(lm106) > JAW[16]:
        mouth_chin = dist(lm106[OUTER_LIPS[-1]], lm106[JAW[16]])
    else:
        mouth_chin = face_h * 0.35

    # Golden ratio checks with realistic ideal values
    checks = [
        (face_h / (face_w + 1e-6), 1.4, 1.0),  # Face ratio (ideal slightly lower)
        (nose_chin / (mouth_chin + 1e-6), 1.5, 1.0),
        (mouth_w / (nose_w + 1e-6), 1.5, 1.0),
        (eye_spacing / (avg_eye_w + 1e-6), 1.0, 1.0),
        ((eye_spacing + avg_eye_w * 2) / (mouth_w + 1e-6), 1.5, 1.0),
    ]

    total_w = sum(w for _, _, w in checks)
    total_s = 0
    
    for r, ideal, w in checks:
        if r > 0:
            # More forgiving tolerance (0.5 instead of 0.25)
            total_s += gaussian_score(r, ideal, 0.5) * w

    if total_w == 0:
        return 65.0
    
    raw_score = total_s / total_w
    # Lower min to 25, raise max to 98
    return round(max(25, min(98, raw_score)), 2)