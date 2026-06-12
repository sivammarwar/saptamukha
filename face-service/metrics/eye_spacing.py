import numpy as np
from .scorer import gaussian_score
from .constants import (
    JAW, LEFT_EYE_INNER, LEFT_EYE_OUTER,
    RIGHT_EYE_INNER, RIGHT_EYE_OUTER,
    LEFT_MOUTH_CORNER, RIGHT_MOUTH_CORNER,
)

def dist(a, b):
    return np.linalg.norm(np.array(a) - np.array(b))

def compute(lm106):
    """
    Eye spacing: IPD/face-width ratio + eye-mouth vertical ratio.
    Returns 0-100 score.
    """

    left_pupil = np.mean([lm106[LEFT_EYE_INNER], lm106[LEFT_EYE_OUTER]], axis=0)
    right_pupil = np.mean([lm106[RIGHT_EYE_INNER], lm106[RIGHT_EYE_OUTER]], axis=0)
    ipd = dist(left_pupil, right_pupil)

    face_width = dist(lm106[JAW[0]], lm106[JAW[32]]) if len(lm106) > 32 else ipd * 2.5
    ipd_ratio = ipd / (face_width + 1e-6)

    pupil_midpoint = (left_pupil + right_pupil) / 2
    mouth_center = np.mean([lm106[LEFT_MOUTH_CORNER], lm106[RIGHT_MOUTH_CORNER]], axis=0)
    eye_mouth_dist = dist(pupil_midpoint, mouth_center)

    all_ys = [pt[1] for pt in lm106]
    face_height = max(all_ys) - min(all_ys)
    em_ratio = eye_mouth_dist / (face_height + 1e-6)

    # Score with realistic ranges
    sub1 = gaussian_score(ipd_ratio, 0.46, 0.15)
    sub2 = gaussian_score(em_ratio, 0.40, 0.15)
    
    raw_score = 0.5 * sub1 + 0.5 * sub2
    
    # Lower min to 25 to allow distinct scores
    return round(max(25, min(98, raw_score)), 2)