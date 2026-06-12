import numpy as np
from .scorer import gaussian_score
from .constants import NOSE, LEFT_EYE_INNER, RIGHT_EYE_INNER

def dist(a, b):
    return np.linalg.norm(np.array(a) - np.array(b))

def compute(lm106):
    """
    Nose harmony: alar width, nose length, and bridge straightness.
    Returns 0-100 score.
    """

    nose_pts = [lm106[i] for i in NOSE if i < len(lm106)]
    
    if len(nose_pts) < 5:
        return 60.0

    # Alar base width (spatially derived)
    nose_ys = [p[1] for p in nose_pts]
    y_min, y_max = min(nose_ys), max(nose_ys)
    y_threshold = y_min + (y_max - y_min) * 0.40
    lower_nose_pts = [p for p in nose_pts if p[1] >= y_threshold] or nose_pts

    left_alar = min(lower_nose_pts, key=lambda p: p[0])
    right_alar = max(lower_nose_pts, key=lambda p: p[0])
    nose_width = dist(left_alar, right_alar)

    # Intercanthal distance
    intercanthal = dist(lm106[LEFT_EYE_INNER], lm106[RIGHT_EYE_INNER])
    alar_ratio = nose_width / (intercanthal + 1e-6)

    # Nose length ratio
    nasion = np.array(nose_pts[0])
    subnasale = np.array(nose_pts[-1])
    nose_length = dist(nasion, subnasale)

    all_ys = [pt[1] for pt in lm106]
    face_height = max(all_ys) - min(all_ys)
    nose_length_ratio = nose_length / (face_height + 1e-6)

    # Bridge straightness
    tip = np.array(nose_pts[len(nose_pts) // 2])
    direction = tip - nasion
    direction_norm = direction / (np.linalg.norm(direction) + 1e-6)

    bridge_pts = nose_pts[1: len(nose_pts) // 2]
    if bridge_pts:
        deviations = [abs(np.cross(direction_norm, np.array(pt) - nasion)) for pt in bridge_pts]
        straightness_dev = float(np.mean(deviations))
    else:
        straightness_dev = 0.0

    # Scoring with realistic ranges
    # Alar ratio ideal ~0.95-1.05
    sub1 = gaussian_score(alar_ratio, 1.00, 0.35)
    # Nose length ideal ~0.27-0.29 of face height
    sub2 = gaussian_score(nose_length_ratio, 0.28, 0.15)
    # Straightness deviation - lower is better
    sub3 = gaussian_score(straightness_dev, 0.0, 20.0)

    raw_score = 0.35 * sub1 + 0.35 * sub2 + 0.30 * sub3
    
    # Lower min to 25, raise max to 98
    return round(max(25, min(98, raw_score)), 2)