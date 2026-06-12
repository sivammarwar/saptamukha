import numpy as np
from .scorer import gaussian_score
from .constants import JAW, NOSE, LEFT_BROW, RIGHT_BROW

def compute(lm106):
    """
    Facial thirds: brow-to-glabella, glabella-to-subnasale, subnasale-to-menton.
    Returns 0-100 score.
    """

    # Upper reference: topmost brow point
    brow_top_y = min(
        min(lm106[i][1] for i in LEFT_BROW if i < len(lm106)),
        min(lm106[i][1] for i in RIGHT_BROW if i < len(lm106)),
    )

    # Glabella: inner brow midpoints
    glabella_y = (
        max(lm106[i][1] for i in LEFT_BROW if i < len(lm106)) +
        max(lm106[i][1] for i in RIGHT_BROW if i < len(lm106))
    ) / 2.0

    # Subnasale: last NOSE landmark
    subnasale_y = lm106[NOSE[-1]][1] if len(lm106) > NOSE[-1] else glabella_y + 50

    # Menton: lowest jaw point
    menton_y = max(lm106[i][1] for i in JAW if i < len(lm106))

    T1 = max(1, glabella_y - brow_top_y)
    T2 = max(1, subnasale_y - glabella_y)
    T3 = max(1, menton_y - subnasale_y)
    total = T1 + T2 + T3

    if total < 10:
        return 55.0

    # Calculate ratios
    ratios = [T1/total, T2/total, T3/total]
    ideal_ratio = 1.0/3.0
    
    # Calculate deviation from ideal thirds
    deviations = [abs(r - ideal_ratio) for r in ratios]
    avg_deviation = np.mean(deviations)
    
    # Score based on deviation (lower deviation = higher score)
    # 0 deviation = 98, 0.15 deviation = 50
    if avg_deviation < 0.03:
        score = 95
    elif avg_deviation < 0.05:
        score = 88
    elif avg_deviation < 0.07:
        score = 80
    elif avg_deviation < 0.10:
        score = 72
    elif avg_deviation < 0.13:
        score = 63
    elif avg_deviation < 0.16:
        score = 55
    else:
        score = 48
    
    return round(score, 2)