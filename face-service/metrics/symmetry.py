import numpy as np
from .scorer import gaussian_score
from .constants import (
    JAW, LEFT_BROW, RIGHT_BROW,
    LEFT_EYE_INNER, LEFT_EYE_OUTER,
    RIGHT_EYE_INNER, RIGHT_EYE_OUTER,
    LEFT_MOUTH_CORNER, RIGHT_MOUTH_CORNER,
    NOSE,
)

def compute(lm106):
    """
    Facial symmetry: bilateral landmark mirror balance around the vertical midline.
    Returns score 0-100.
    """

    eye_mid_x  = (lm106[LEFT_EYE_INNER][0] + lm106[RIGHT_EYE_INNER][0]) / 2.0
    nose_tip_x = lm106[NOSE[len(NOSE) // 2]][0]
    midline_x  = (eye_mid_x + nose_tip_x) / 2.0

    # Bilateral pairs: (left_idx, right_idx, weight)
    pairs = [
        (LEFT_EYE_OUTER,   RIGHT_EYE_OUTER,  1.5),
        (LEFT_EYE_INNER,   RIGHT_EYE_INNER,  1.5),
        (LEFT_MOUTH_CORNER, RIGHT_MOUTH_CORNER, 1.5),
        (LEFT_BROW[0],     RIGHT_BROW[0],    1.2),
        (LEFT_BROW[4],     RIGHT_BROW[4],    1.0),
        (JAW[5],           JAW[27],          1.0),
        (JAW[2],           JAW[30],          1.0),
        (JAW[8],           JAW[24],          1.0),
        (JAW[10],          JAW[22],          0.8),
    ]

    total_weight = 0.0
    total_sym    = 0.0

    for left_idx, right_idx, w in pairs:
        if left_idx >= len(lm106) or right_idx >= len(lm106):
            continue
        L = abs(lm106[left_idx][0] - midline_x)
        R = abs(lm106[right_idx][0] - midline_x)
        peak = max(L, R)
        if peak < 1.0:
            sym = 1.0
        else:
            sym = 1.0 - abs(L - R) / peak
        total_sym    += sym * w
        total_weight += w

    if total_weight == 0:
        return 75.0

    S = total_sym / total_weight
    # Map 0.5-1.0 to 35-100 range (more forgiving)
    score = 35 + (S - 0.5) * (65 / 0.5)
    return round(max(25, min(98, score)), 2)