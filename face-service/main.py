import os
import time
from fastapi import FastAPI, UploadFile, File, HTTPException, Request, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from insightface.app import FaceAnalysis
import numpy as np
import cv2

from metrics import (
    symmetry, facial_thirds, eye_spacing, canthal_tilt,
    jawline, nose_harmony, lip_ratio, face_width_height,
    profile_harmony, structural_harmony,
)
from metrics.scorer import WEIGHTS, normalize_score, get_tier

# ─── CONFIG ───
API_KEY = os.environ.get("EMBED_API_KEY", "")
CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")
CORS_ORIGINS = [o.strip() for o in CORS_ORIGINS if o.strip()]
ENABLE_API_DOCS = os.environ.get("ENABLE_API_DOCS", "").lower() in {"1", "true", "yes"}
RATE_LIMIT_EXEMPT_LOCAL = os.environ.get("RATE_LIMIT_EXEMPT_LOCAL", "true").lower() in {"1", "true", "yes"}

# ─── RATE LIMITER (in-memory, per-IP) ───
rate_buckets = {}
RATE_LIMIT_WINDOW = 60      # seconds
RATE_LIMIT_MAX = 10         # requests per window

# ─── APP ───
app = FastAPI(
    title="SAPTAMUKHA API",
    docs_url="/docs" if ENABLE_API_DOCS else None,
    redoc_url="/redoc" if ENABLE_API_DOCS else None,
    openapi_url="/openapi.json" if ENABLE_API_DOCS else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["*"],
)

# ─── SECURITY MIDDLEWARE ───
@app.middleware("http")
async def security_gate(request: Request, call_next):
    # 1. API Key check for embed endpoints
    if request.url.path in ("/embed", "/embed-multi", "/analyze", "/analyze-batch"):
        provided = request.headers.get("x-api-key", "")
        if API_KEY and provided != API_KEY:
            return JSONResponse(
                status_code=401,
                content={"detail": "unauthorized"},
                headers={"Access-Control-Allow-Origin": "*"}
            )

        # 2. Rate limiting (by client IP)
        client_ip = request.client.host if request.client else "unknown"
        if RATE_LIMIT_EXEMPT_LOCAL and is_local_client(client_ip):
            response = await call_next(request)
            response.headers["Cache-Control"] = "no-store"
            response.headers["Pragma"] = "no-cache"
            response.headers["X-Content-Type-Options"] = "nosniff"
            if "server" in response.headers:
                del response.headers["server"]
            return response

        now = time.time()
        bucket = rate_buckets.get(client_ip, [])
        bucket = [t for t in bucket if now - t < RATE_LIMIT_WINDOW]
        if len(bucket) >= RATE_LIMIT_MAX:
            return JSONResponse(
                status_code=429,
                content={"detail": "rate_limited"},
                headers={"Access-Control-Allow-Origin": "*"}
            )
        bucket.append(now)
        rate_buckets[client_ip] = bucket

    response = await call_next(request)
    response.headers["Cache-Control"] = "no-store"
    response.headers["Pragma"] = "no-cache"
    response.headers["X-Content-Type-Options"] = "nosniff"
    if "server" in response.headers:
        del response.headers["server"]
    return response

# ─── MODEL ───
face_analyzer = FaceAnalysis(providers=['CPUExecutionProvider'])
face_analyzer.prepare(ctx_id=-1, det_size=(640, 640))

# ─── HELPERS ───
def decode_image(image_bytes: bytes) -> np.ndarray:
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Could not decode image")
    return img

def to_native(obj):
    """Recursively convert numpy scalars/arrays to native Python types."""
    if isinstance(obj, np.ndarray):
        return obj.tolist()
    if isinstance(obj, (np.integer, np.int64, np.int32)):
        return int(obj)
    if isinstance(obj, (np.floating, np.float32, np.float64)):
        return float(obj)
    if isinstance(obj, list):
        return [to_native(x) for x in obj]
    if isinstance(obj, dict):
        return {k: to_native(v) for k, v in obj.items()}
    return obj


def is_local_client(client_ip: str) -> bool:
    return client_ip in {"127.0.0.1", "::1", "localhost"} or client_ip.startswith("127.")

# ─── ENDPOINTS ───
@app.post("/embed")
async def embed_single(file: UploadFile = File(...)):
    """Extract embedding from a single image."""
    image_bytes = await file.read()
    try:
        img = decode_image(image_bytes)
    except ValueError:
        raise HTTPException(status_code=400, detail="invalid_image")

    faces = face_analyzer.get(img)
    if not faces:
        raise HTTPException(status_code=422, detail="no_face_detected")
    if len(faces) > 1:
        raise HTTPException(status_code=422, detail="multiple_faces")

    face = faces[0]
    return to_native({
        "v": face.embedding.tolist(),
        "q": float(face.det_score),
    })

@app.post("/embed-multi")
async def embed_multi(files: list[UploadFile] = File(...)):
    """Accept up to 5 frames. Extract embedding per frame, return averaged embedding."""
    if len(files) < 1 or len(files) > 5:
        raise HTTPException(status_code=400, detail="send_1_to_5_frames")

    embeddings = []
    first_face = None

    for f in files:
        image_bytes = await f.read()
        try:
            img = decode_image(image_bytes)
        except ValueError:
            continue
        faces = face_analyzer.get(img)
        if faces and len(faces) == 1:
            embeddings.append(faces[0].embedding)
            if first_face is None:
                first_face = faces[0]

    if not embeddings:
        raise HTTPException(status_code=422, detail="no_valid_face_in_any_frame")

    avg_embedding = np.mean(embeddings, axis=0)
    avg_embedding = avg_embedding / np.linalg.norm(avg_embedding)

    return to_native({
        "v": avg_embedding.tolist(),
        "n": len(embeddings),
        "q": float(first_face.det_score) if first_face is not None else 0.9,
    })

# ─── ANALYZE ENDPOINT ───

def compute_ipd(lm106):
    left_pupil = np.mean([lm106[72], lm106[78]], axis=0)
    right_pupil = np.mean([lm106[84], lm106[90]], axis=0)
    return float(np.linalg.norm(np.array(left_pupil) - np.array(right_pupil)))

def compute_all_scores(lm106, lm68_3d, pose, gender, view_type, side_lm106=None):
    ipd_val = compute_ipd(lm106)

    scores = {
        "symmetry": symmetry.compute(lm106),
        "facial_thirds": facial_thirds.compute(lm106),
        "eye_spacing": eye_spacing.compute(lm106),
        "canthal_tilt": canthal_tilt.compute(lm106),
        "jawline": jawline.compute(lm106, lm68_3d),
        "nose_harmony": nose_harmony.compute(lm106),
        "lip_ratio": lip_ratio.compute(lm106, ipd_val),
        "face_width_height": face_width_height.compute(lm106, gender),
        "profile_harmony": profile_harmony.compute(
            side_lm106 if side_lm106 is not None else lm106,
            gender,
            estimated=(side_lm106 is None),
        ),
        "structural_harmony": structural_harmony.compute(lm106),
    }

    raw = sum(WEIGHTS[k] * v for k, v in scores.items())
    normalized = normalize_score(raw)
    tier = get_tier(normalized)

    return scores, raw, normalized, tier

@app.post("/analyze")
async def analyze(
    file: UploadFile = File(...),
    view_type: str = Form("front"),
):
    """Analyze facial harmony from a single image."""
    image_bytes = await file.read()
    try:
        img = decode_image(image_bytes)
    except ValueError:
        raise HTTPException(status_code=400, detail="invalid_image")

    faces = face_analyzer.get(img)
    if not faces:
        raise HTTPException(status_code=422, detail="no_face_detected")
    if len(faces) > 1:
        raise HTTPException(status_code=422, detail="multiple_faces")

    face = faces[0]

    det_score = float(face.det_score)
    if det_score < 0.50:
        return JSONResponse(
            status_code=422,
            content={"error": "quality_low", "message": "Poor image quality. Improve lighting."},
        )

    lm106 = face.landmark_2d_106.tolist()
    lm68_3d = face.landmark_3d_68.tolist() if hasattr(face, "landmark_3d_68") else []
    pose = face.pose.tolist() if hasattr(face, "pose") else [0.0, 0.0, 0.0]
    gender = int(face.gender) if hasattr(face, "gender") else -1

    yaw, pitch, roll = pose if len(pose) >= 3 else [0.0, 0.0, 0.0]
    pose_valid = True

    h, w = img.shape[:2]
    if hasattr(face, "bbox"):
        x1, y1, x2, y2 = face.bbox
        bbox_area = (x2 - x1) * (y2 - y1)
        frame_area = h * w
        if bbox_area / frame_area < 0.05:
            return JSONResponse(
                status_code=422,
                content={"error": "face_too_small", "message": "Move closer to the scanner."},
            )

    scores, raw, normalized, tier = compute_all_scores(
        lm106, lm68_3d, pose, gender, view_type
    )

    return to_native({
        "scores": scores,
        "overall": round(raw, 1),
        "normalized_overall": normalized,
        "tier": tier,
        "pose": {"yaw": yaw, "pitch": pitch, "roll": roll},
        "det_score": det_score,
        "pose_valid": pose_valid,
        "view_type": view_type,
        "flags": {
            "profile_estimated": view_type != "left" and view_type != "right",
            "hairline_estimated": True,
            "eye_landmarks_occluded": False,
        },
    })

def analyze_single(image_bytes, view_type):
    """Analyze a single image. Returns scores or raises."""
    img = decode_image(image_bytes)
    faces = face_analyzer.get(img)
    if not faces:
        raise HTTPException(status_code=422, detail="no_face_detected")
    if len(faces) > 1:
        raise HTTPException(status_code=422, detail="multiple_faces")

    face = faces[0]
    det_score = float(face.det_score)
    if det_score < 0.50:
        raise HTTPException(status_code=422, detail="quality_low")

    lm106 = face.landmark_2d_106.tolist()
    lm68_3d = face.landmark_3d_68.tolist() if hasattr(face, "landmark_3d_68") else []
    pose = face.pose.tolist() if hasattr(face, "pose") else [0.0, 0.0, 0.0]
    gender = int(face.gender) if hasattr(face, "gender") else -1
    yaw, pitch, roll = pose if len(pose) >= 3 else [0.0, 0.0, 0.0]
    pose_valid = True

    h, w = img.shape[:2]
    if hasattr(face, "bbox"):
        x1, y1, x2, y2 = face.bbox
        bbox_area = (x2 - x1) * (y2 - y1)
        frame_area = h * w
        if bbox_area / frame_area < 0.05:
            raise HTTPException(status_code=422, detail="face_too_small")

    scores, raw, normalized, tier = compute_all_scores(
        lm106, lm68_3d, pose, gender, view_type
    )

    flags = {
        "profile_estimated": view_type != "left" and view_type != "right",
        "hairline_estimated": True,
        "eye_landmarks_occluded": False,
    }

    return scores, raw, normalized, tier, pose_valid, det_score, {"yaw": yaw, "pitch": pitch, "roll": roll}, flags

@app.post("/analyze-batch")
async def analyze_batch(
    front_image: UploadFile = File(...),
    left_image: UploadFile = File(...),
    right_image: UploadFile = File(...),
):
    """
    Analyze all 3 views (front, left, right) and return combined harmony scores.
    Uses best view for each metric for optimal accuracy.
    Partial failures are returned so the caller can retry individual views.
    """
    # Read all images first
    try:
        front_bytes = await front_image.read()
        left_bytes = await left_image.read()
        right_bytes = await right_image.read()
    except Exception:
        raise HTTPException(status_code=400, detail="invalid_image")

    # Analyze each view independently — catch per-view errors
    view_results = {}
    all_ok = True
    
    for view_type, image_bytes in [("front", front_bytes), ("left", left_bytes), ("right", right_bytes)]:
        try:
            scores, raw, normalized, tier, pose_valid, det_score, pose, flags = analyze_single(image_bytes, view_type)
            entry = {
                "status": "ok",
                "scores": scores,
                "raw": raw,
                "normalized": normalized,
                "tier": tier,
                "pose_valid": pose_valid,
                "det_score": det_score,
                "pose": pose,
                "flags": flags,
            }
            view_results[view_type] = entry
        except HTTPException as e:
            view_results[view_type] = {
                "status": "error",
                "error": e.detail,
                "message": f"Failed on {view_type} view.",
            }
            all_ok = False
        except Exception as e:
            view_results[view_type] = {
                "status": "error",
                "error": str(e),
                "message": f"Failed on {view_type} view.",
            }
            all_ok = False

    # If any view failed, return partial results so frontend can retry (TWIN LOGIC INTACT)
    if not all_ok:
        return to_native({
            "status": "partial",
            "views": view_results,
        })

    # ─── Build combined scores using best view for each metric ───
    combined_scores = {}
    
    # Map backend metric names (with underscores) to frontend names (camelCase)
    metric_name_map = {
        "symmetry": "symmetry",
        "facial_thirds": "facialThirds",
        "eye_spacing": "eyeSpacing",
        "canthal_tilt": "canthalTilt",
        "jawline": "jawline",
        "nose_harmony": "noseHarmony",
        "lip_ratio": "lipRatio",
        "face_width_height": "fwhr",
        "profile_harmony": "profileHarmony",
        "structural_harmony": "structuralHarmony",
    }
    
    # Define which metrics come from which view (using backend metric names)
    metric_sources = {
        "symmetry": {"primary": "front", "fallback": ["left", "right"]},
        "facial_thirds": {"primary": "front", "fallback": ["left", "right"]},
        "eye_spacing": {"primary": "front", "fallback": ["left", "right"]},
        "canthal_tilt": {"primary": "front", "fallback": ["left", "right"]},
        "lip_ratio": {"primary": "front", "fallback": ["left", "right"]},
        "face_width_height": {"primary": "front", "fallback": ["left", "right"]},
        "structural_harmony": {"primary": "front", "fallback": ["left", "right"]},
        "jawline": {"primary": "left", "secondary": "right", "fallback": ["front"]},
        "nose_harmony": {"primary": "front", "fallback": ["left", "right"]},
        "profile_harmony": {"primary": "left", "secondary": "right", "fallback": ["front"]},
    }
    
    for backend_metric, sources in metric_sources.items():
        best_raw_score = None
        
        # Try primary view first
        primary = sources.get("primary")
        if primary and primary in view_results:
            best_raw_score = view_results[primary]["scores"].get(backend_metric)
        
        # Try secondary view if primary didn't give a score
        if best_raw_score is None and "secondary" in sources:
            secondary = sources["secondary"]
            if secondary in view_results:
                best_raw_score = view_results[secondary]["scores"].get(backend_metric)
        
        # Try fallback views if needed
        if best_raw_score is None:
            for fallback in sources.get("fallback", []):
                if fallback in view_results:
                    candidate_score = view_results[fallback]["scores"].get(backend_metric)
                    if candidate_score is not None:
                        best_raw_score = candidate_score
                        break
        
        # If still no score, compute an average across all available views
        if best_raw_score is None:
            all_candidates = []
            for view in ["front", "left", "right"]:
                if view in view_results:
                    candidate = view_results[view]["scores"].get(backend_metric)
                    if candidate is not None:
                        all_candidates.append(candidate)
            if all_candidates:
                best_raw_score = sum(all_candidates) / len(all_candidates)
            else:
                # Last resort: very basic default (only if no views work)
                best_raw_score = 50.0
        
        # Clamp to reasonable range but keep distinct values
        final_score = max(25, min(98, best_raw_score))
        
        # Convert to camelCase for frontend
        camel_key = metric_name_map.get(backend_metric, backend_metric)
        combined_scores[camel_key] = round(final_score, 2)
    
    # Special handling for profile_harmony - average left and right if both exist
    if "left" in view_results and "right" in view_results:
        left_profile = view_results["left"]["scores"].get("profile_harmony")
        right_profile = view_results["right"]["scores"].get("profile_harmony")
        
        if left_profile is not None and right_profile is not None:
            combined_scores["profileHarmony"] = round((left_profile + right_profile) / 2, 2)
        elif left_profile is not None:
            combined_scores["profileHarmony"] = round(left_profile, 2)
        elif right_profile is not None:
            combined_scores["profileHarmony"] = round(right_profile, 2)
    
    # Special handling for jawline - take best from all views
    jawline_candidates = []
    for view in ["left", "right", "front"]:
        if view in view_results:
            score = view_results[view]["scores"].get("jawline")
            if score is not None:
                jawline_candidates.append(score)
    if jawline_candidates:
        combined_scores["jawline"] = round(max(jawline_candidates), 2)
    
    # Calculate overall with proper weights
    weight_map = {
        "symmetry": WEIGHTS["symmetry"],
        "facialThirds": WEIGHTS["facial_thirds"],
        "eyeSpacing": WEIGHTS["eye_spacing"],
        "canthalTilt": WEIGHTS["canthal_tilt"],
        "jawline": WEIGHTS["jawline"],
        "noseHarmony": WEIGHTS["nose_harmony"],
        "lipRatio": WEIGHTS["lip_ratio"],
        "fwhr": WEIGHTS["face_width_height"],
        "profileHarmony": WEIGHTS["profile_harmony"],
        "structuralHarmony": WEIGHTS["structural_harmony"],
    }
    
    raw = 0
    for metric, score in combined_scores.items():
        weight = weight_map.get(metric, 0.10)
        raw += score * weight
    
    normalized = normalize_score(raw)
    tier = get_tier(normalized)
    
    # Debug logging
    print(f"[DEBUG] Combined scores: {combined_scores}")
    print(f"[DEBUG] Raw score: {raw}, Normalized: {normalized}, Tier: {tier}")

    return to_native({
        "status": "ok",
        "scores": combined_scores,
        "overall": round(raw, 1),
        "normalized_overall": normalized,
        "tier": tier,
        "view_scores": {
            "front": {k: view_results["front"][k] for k in ["scores", "pose", "det_score", "flags"]},
            "left": {k: view_results["left"][k] for k in ["scores", "pose", "det_score", "flags"]},
            "right": {k: view_results["right"][k] for k in ["scores", "pose", "det_score", "flags"]},
        },
        "flags": {
            "profile_estimated": False,
            "hairline_estimated": True,
            "eye_landmarks_occluded": False,
        },
    })

@app.get("/health")
async def health():
    return {"status": "ok"}
