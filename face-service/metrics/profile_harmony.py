import math
import numpy as np
from .scorer import gaussian_score
from .constants import NOSE, OUTER_LIPS, JAW, LEFT_BROW

def dist(a, b):
    return np.linalg.norm(np.array(a) - np.array(b))

def compute(lm106, gender, estimated=False):
    """
    Profile harmony: nasolabial angle, nasofrontal angle, chin projection.
    For estimated (front view), return reasonable default.
    """
    
    if estimated:
        # Return realistic default for front view estimation
        # Most faces score 55-75 on profile from front
        return 68.0
    
    # For actual profile view
    try:
        # Nasolabial angle
        columella_pt = np.array(lm106[NOSE[-2]]) if len(lm106) > NOSE[-2] else None
        subnasale = np.array(lm106[NOSE[-1]]) if len(lm106) > NOSE[-1] else None
        upper_lip = np.array(lm106[OUTER_LIPS[0]]) if len(lm106) > OUTER_LIPS[0] else None
        
        if columella_pt is not None and subnasale is not None and upper_lip is not None:
            v1 = columella_pt - subnasale
            v2 = upper_lip - subnasale
            n1 = np.linalg.norm(v1)
            n2 = np.linalg.norm(v2)
            if n1 > 1e-6 and n2 > 1e-6:
                cos_nl = np.dot(v1, v2) / (n1 * n2)
                nasolabial_angle = math.degrees(math.acos(np.clip(cos_nl, -1, 1)))
                ideal_nl = 100 if gender == 1 else 105
                nl_score = gaussian_score(nasolabial_angle, ideal_nl, 25)
            else:
                nl_score = 70
        else:
            nl_score = 70
        
        # Nasofrontal angle (approximate from profile)
        nasion = np.array(lm106[NOSE[0]]) if len(lm106) > NOSE[0] else None
        if nasion is not None and len(lm106) > LEFT_BROW[4]:
            brow_mid = np.array(lm106[LEFT_BROW[4]])
            tip = np.array(lm106[NOSE[8]]) if len(lm106) > NOSE[8] else nasion + np.array([10, 20, 0])
            v1 = brow_mid - nasion
            v2 = tip - nasion
            n1 = np.linalg.norm(v1)
            n2 = np.linalg.norm(v2)
            if n1 > 1e-6 and n2 > 1e-6:
                cos_nf = np.dot(v1, v2) / (n1 * n2)
                nasofrontal_angle = math.degrees(math.acos(np.clip(cos_nf, -1, 1)))
                nf_score = gaussian_score(nasofrontal_angle, 130, 30)
            else:
                nf_score = 70
        else:
            nf_score = 70
        
        # Chin projection
        chin_y = max((lm106[i][1] for i in JAW if i < len(lm106)), default=0)
        subnasale_y = subnasale[1] if subnasale is not None else 0
        chin_projection = chin_y - subnasale_y
        
        # Ideal chin projection depends on face length
        chin_score = gaussian_score(chin_projection, 25, 20) if chin_projection > 0 else 60
        
        # Weighted combination
        raw_score = 0.40 * nl_score + 0.35 * nf_score + 0.25 * chin_score
        return round(max(55, min(95, raw_score)), 2)
        
    except Exception:
        return 65.0