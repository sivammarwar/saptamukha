import math

def gaussian_score(value, ideal, tolerance):
    """Returns 0-100. Peak 100 at value==ideal, falls off with distance."""
    return 100 * math.exp(-0.5 * ((value - ideal) / tolerance) ** 2)

def normalize_score(raw_score):
    """Sigmoid stretch for realistic distribution."""
    normalized = 100 / (1 + math.exp(-0.1 * (raw_score - 62)))
    return round(normalized, 1)

WEIGHTS = {
    "symmetry": 0.18,
    "facial_thirds": 0.12,
    "eye_spacing": 0.10,
    "canthal_tilt": 0.08,
    "jawline": 0.12,
    "nose_harmony": 0.10,
    "lip_ratio": 0.08,
    "face_width_height": 0.07,
    "profile_harmony": 0.08,
    "structural_harmony": 0.07,
}

TIERS = [
    (90, "ETHEREAL HARMONY"),
    (85, "EXCEPTIONAL"),
    (78, "DISTINGUISHED"),
    (70, "HARMONIOUS"),
    (62, "BALANCED"),
    (54, "NATURAL"),
    (46, "DEVELOPING"),
    (0, "UNIQUE CHARACTER"),
]

def get_tier(normalized_score):
    for threshold, name in TIERS:
        if normalized_score >= threshold:
            return name
    return "UNIQUE CHARACTER"