"""
Generate celebrity face descriptors for SAPTAMUKHA.
Run this offline to build public/celebrities.json.

Usage:
    pip install insightface onnxruntime opencv-python
    mkdir -p celebrity-photos
    # Add celebrity photos as .jpg files named like: shah_rukh_khan.jpg
    python scripts/generate_celebrity_descriptors.py
"""
import sys
import os

# Add venv site-packages so insightface and deps are found
VENV_SITE = os.path.join(os.path.dirname(__file__), '..', 'venv', 'lib', 'python3.12', 'site-packages')
if os.path.isdir(VENV_SITE):
    sys.path.insert(0, VENV_SITE)

from insightface.app import FaceAnalysis
import json
import cv2

CELEBRITY_PHOTOS_DIR = "celebrity-photos"
OUTPUT_FILE = "public/celebrities.json"

def main():
    if not os.path.exists(CELEBRITY_PHOTOS_DIR):
        print(f"ERROR: Directory '{CELEBRITY_PHOTOS_DIR}' does not exist.")
        print("Create it and add celebrity .jpg photos.")
        return

    app = FaceAnalysis(name='buffalo_l', providers=['CPUExecutionProvider'])
    app.prepare(ctx_id=-1)

    celebrities = []
    for filename in sorted(os.listdir(CELEBRITY_PHOTOS_DIR)):
        if not filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            continue

        filepath = os.path.join(CELEBRITY_PHOTOS_DIR, filename)
        img = cv2.imread(filepath)
        if img is None:
            print(f"SKIP: {filename} — could not read image")
            continue

        faces = app.get(img)
        if not faces:
            print(f"SKIP: {filename} — no face detected")
            continue
        if len(faces) > 1:
            print(f"SKIP: {filename} — multiple faces detected")
            continue

        face = faces[0]
        # Normalize name from filename
        base = os.path.splitext(filename)[0]
        name = base.replace("_", " ").title()

        celebrities.append({
            "id": base,
            "name": name,
            "region": "Global",
            "category": "Celebrity",
            "imageUrl": f"/celebrity-images/{base}.jpg",
            "descriptor": face.embedding.tolist(),
            "quality": float(face.det_score)
        })
        print(f"OK: {filename} -> {name} (score={face.det_score:.3f})")

    with open(OUTPUT_FILE, "w") as f:
        json.dump({"celebrities": celebrities}, f)

    print(f"\nGenerated {len(celebrities)} celebrity descriptors -> {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
