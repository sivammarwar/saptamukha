import math
import numpy as np
from .scorer import gaussian_score
from .constants import LEFT_EYE_INNER, LEFT_EYE_OUTER, RIGHT_EYE_INNER, RIGHT_EYE_OUTER

def compute(lm106):
    """
    Canthal tilt: upward angle of eye openings.
    Positive tilt (outer corner higher) is attractive.
    Returns 0-100 score.
    """

    left_inner = lm106[LEFT_EYE_INNER]
    left_outer = lm106[LEFT_EYE_OUTER]
    right_inner = lm106[RIGHT_EYE_INNER]
    right_outer = lm106[RIGHT_EYE_OUTER]

    def tilt_angle(inner, outer):
        dx = abs(outer[0] - inner[0])
        dy = inner[1] - outer[1]
        return math.degrees(math.atan2(dy, dx + 1e-6))

    angle_left = tilt_angle(left_inner, left_outer)
    angle_right = tilt_angle(right_inner, right_outer)
    avg_tilt = (angle_left + angle_right) / 2.0

    # Symmetry of tilts
    sym = 1.0 - min(1.0, abs(angle_left - angle_right) / 10.0)

    # Ideal tilt is 5-8 degrees positive
    tilt_score = gaussian_score(avg_tilt, 6.5, 10.0)
    sym_score = sym * 100.0

    raw_score = 0.7 * tilt_score + 0.3 * sym_score
    
    # Lower min to 25, raise max to 98
    return round(max(25, min(98, raw_score)), 2)