import numpy as np
from .scorer import gaussian_score
from .constants import OUTER_LIPS, LEFT_MOUTH_CORNER, RIGHT_MOUTH_CORNER

def dist(a, b):
    return np.linalg.norm(np.array(a) - np.array(b))

def compute(lm106, ipd):
    """
    Lip ratio: upper/lower lip height balance, mouth width.
    Returns 0-100 score.
    """

    mouth_pts = [lm106[i] for i in OUTER_LIPS if i < len(lm106)]
    
    if len(mouth_pts) < 5:
        return 55.0

    # Split upper and lower lip points by vertical midpoint
    ys = [p[1] for p in mouth_pts]
    y_mid = (min(ys) + max(ys)) / 2.0

    upper_pts = [p for p in mouth_pts if p[1] <= y_mid]
    lower_pts = [p for p in mouth_pts if p[1] > y_mid]

    if not upper_pts or not lower_pts:
        upper_pts = mouth_pts[:len(mouth_pts)//2]
        lower_pts = mouth_pts[len(mouth_pts)//2:]

    upper_h = max(p[1] for p in upper_pts) - min(p[1] for p in upper_pts)
    lower_h = max(p[1] for p in lower_pts) - min(p[1] for p in lower_pts)
    total_h = upper_h + lower_h
    ul_ratio = upper_h / (total_h + 1e-6)

    # Mouth width relative to IPD
    mouth_width = dist(lm106[LEFT_MOUTH_CORNER], lm106[RIGHT_MOUTH_CORNER])
    mouth_ipd_ratio = mouth_width / (ipd + 1e-6)

    # Horizontal symmetry
    mid_x = (lm106[LEFT_MOUTH_CORNER][0] + lm106[RIGHT_MOUTH_CORNER][0]) / 2.0
    left_hw = abs(lm106[LEFT_MOUTH_CORNER][0] - mid_x)
    right_hw = abs(lm106[RIGHT_MOUTH_CORNER][0] - mid_x)
    lip_sym = 1.0 - abs(left_hw - right_hw) / (max(left_hw, right_hw) + 1e-6)
    lip_sym = max(0.0, min(1.0, lip_sym))

    # Scoring with realistic ideals
    # Upper lip ideal ~0.33-0.40 of total lip height
    sub1 = gaussian_score(ul_ratio, 0.37, 0.2)
    # Mouth width ideal ~1.4-1.6× IPD
    sub2 = gaussian_score(mouth_ipd_ratio, 1.5, 0.4)
    sub3 = lip_sym * 100.0

    raw_score = 0.40 * sub1 + 0.35 * sub2 + 0.25 * sub3
    
    # Lower min to 25, raise max to 98
    return round(max(25, min(98, raw_score)), 2)