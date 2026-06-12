import math
import numpy as np
from .scorer import gaussian_score
from .constants import JAW

def dist(a, b):
    return np.linalg.norm(np.array(a) - np.array(b))

def compute(lm106, lm68_3d):
    """
    Jawline: taper ratio, gonial angle, jaw-to-face-width ratio.
    Returns realistic score 40-98.
    """

    jaw_pts = np.array([lm106[i] for i in JAW if i < len(lm106)])

    if len(jaw_pts) < 10:
        return 65.0

    # Jaw width: x-span of entire jaw contour
    jaw_width = jaw_pts[:, 0].max() - jaw_pts[:, 0].min()

    # Chin width: x-span of lower-middle jaw points
    chin_pts = jaw_pts[len(jaw_pts)//3 : 2*len(jaw_pts)//3]
    chin_width = chin_pts[:, 0].max() - chin_pts[:, 0].min()
    taper_ratio = chin_width / (jaw_width + 1e-6)

    face_width = dist(lm106[JAW[0]], lm106[JAW[32]]) if len(lm106) > 32 else jaw_width
    jaw_face_ratio = jaw_width / (face_width + 1e-6)

    # Gonial angle from 3D landmarks
    gonial_angle = 120.0
    try:
        if lm68_3d and len(lm68_3d) >= 17:
            upper_ramus = np.array(lm68_3d[3][:3])
            gonion = np.array(lm68_3d[4][:3])
            jaw_body = np.array(lm68_3d[6][:3])
            v1 = upper_ramus - gonion
            v2 = jaw_body - gonion
            n1 = np.linalg.norm(v1)
            n2 = np.linalg.norm(v2)
            if n1 > 1e-6 and n2 > 1e-6:
                cos_a = np.dot(v1, v2) / (n1 * n2)
                gonial_angle = math.degrees(math.acos(np.clip(cos_a, -1.0, 1.0)))
    except Exception:
        pass

    # Scoring - adjusted for realistic ranges
    # Taper ratio ideal ~0.75 (not too narrow, not too wide)
    sub1 = gaussian_score(taper_ratio, 0.75, 0.35)
    # Gonial angle ideal 120-130 degrees
    sub2 = gaussian_score(gonial_angle, 125.0, 30.0)
    # Jaw-to-face ratio ideal ~0.88
    sub3 = gaussian_score(jaw_face_ratio, 0.88, 0.25)

    raw_score = 0.35 * sub1 + 0.35 * sub2 + 0.30 * sub3
    # Lower min to 25
    return round(max(25, min(98, raw_score)), 2)