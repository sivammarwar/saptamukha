import numpy as np
from .scorer import gaussian_score
from .constants import JAW, OUTER_LIPS, LEFT_BROW, RIGHT_BROW

def compute(lm106, gender):
    """
    Facial Width-to-Height Ratio (fWHR).
    Returns 0-100 score.
    """

    # Bizygomatic width
    biz_width = abs(lm106[JAW[0]][0] - lm106[JAW[32]][0]) if len(lm106) > 32 else 100

    # Upper brow line
    left_brow_top = min(lm106[i][1] for i in LEFT_BROW if i < len(lm106))
    right_brow_top = min(lm106[i][1] for i in RIGHT_BROW if i < len(lm106))
    brow_y = (left_brow_top + right_brow_top) / 2.0

    # Upper lip top
    upper_lip_y = lm106[OUTER_LIPS[0]][1] if len(lm106) > OUTER_LIPS[0] else brow_y + 80

    upper_face_h = upper_lip_y - brow_y

    if upper_face_h < 1.0:
        return 55.0

    fwhr = biz_width / upper_face_h

    # Gender-specific ideals
    ideal = 1.85 if gender == 1 else 1.65
    raw_score = gaussian_score(fwhr, ideal, 0.5)
    
    # Lower min to 25, raise max to 98
    return round(max(25, min(98, raw_score)), 2)