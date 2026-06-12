"""
106-landmark index reference used by the backend geometry pipeline.
Verify against actual model output before trusting blindly.
"""

JAW = list(range(0, 33))
LEFT_BROW = list(range(33, 43))
RIGHT_BROW = list(range(43, 53))
NOSE = list(range(53, 72))
LEFT_EYE = list(range(72, 84))
LEFT_EYE_INNER = 72
LEFT_EYE_OUTER = 78
RIGHT_EYE = list(range(84, 96))
RIGHT_EYE_INNER = 84
RIGHT_EYE_OUTER = 90
OUTER_LIPS = list(range(96, 106))
LEFT_MOUTH_CORNER = 96
RIGHT_MOUTH_CORNER = 100
