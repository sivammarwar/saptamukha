#!/usr/bin/env python3
import os
import json
import time
import requests
from pathlib import Path
from dotenv import load_dotenv
import cloudinary
import cloudinary.uploader
import cloudinary.api

# Get script's directory and project root
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent

# Load environment variables from .env in project root
load_dotenv(PROJECT_ROOT / ".env")

# Cloudinary configuration
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)

# Face service configuration
FACE_SERVICE_URL = os.getenv("VITE_EMBED_SERVICE_URL", "http://localhost:8000")
EMBED_API_KEY = os.getenv("VITE_EMBED_API_KEY", "")
EMBED_MAX_RETRIES = int(os.getenv("CELEBRITY_EMBED_MAX_RETRIES", "5"))
EMBED_RETRY_BASE_SECONDS = float(os.getenv("CELEBRITY_EMBED_RETRY_BASE_SECONDS", "2"))

def get_celebrity_name(filename):
    """Convert filename like 'Tom_Hanks_54745.png' to 'Tom Hanks'."""
    name_without_ext = Path(filename).stem
    parts = name_without_ext.split('_')
    # Remove trailing numbers if present
    filtered_parts = []
    for part in parts:
        if not part.isdigit():
            filtered_parts.append(part)
    return ' '.join(filtered_parts)

def delete_existing_cloudinary_images(folder="saptamukha/celebrities"):
    """Delete all images in a Cloudinary folder to avoid duplicates."""
    try:
        print(f"Deleting existing images from Cloudinary folder: {folder}")
        cloudinary.api.delete_resources_by_prefix(folder)
        print("Existing images deleted successfully.")
    except Exception as e:
        print(f"Warning: Could not delete existing Cloudinary images: {e}")


def get_embedding_with_retry(file_path):
    last_error = None

    for attempt in range(1, EMBED_MAX_RETRIES + 1):
        try:
            with open(file_path, "rb") as f:
                files = {"file": f}
                headers = {}
                if EMBED_API_KEY:
                    headers["X-API-Key"] = EMBED_API_KEY

                response = requests.post(
                    f"{FACE_SERVICE_URL}/embed",
                    files=files,
                    headers=headers,
                    timeout=120,
                )
                response.raise_for_status()
                return response.json()
        except requests.exceptions.HTTPError as e:
            last_error = e
            status_code = e.response.status_code if e.response is not None else None
            if status_code != 429 or attempt == EMBED_MAX_RETRIES:
                raise

            wait_seconds = EMBED_RETRY_BASE_SECONDS * attempt
            print(f"  Rate limited by face service. Retrying in {wait_seconds:.1f}s ({attempt}/{EMBED_MAX_RETRIES})...")
            time.sleep(wait_seconds)
        except requests.exceptions.RequestException as e:
            last_error = e
            if attempt == EMBED_MAX_RETRIES:
                raise

            wait_seconds = EMBED_RETRY_BASE_SECONDS * attempt
            print(f"  Temporary face service error. Retrying in {wait_seconds:.1f}s ({attempt}/{EMBED_MAX_RETRIES})...")
            time.sleep(wait_seconds)

    raise last_error

def process_celebrities():
    # Configuration
    celebrity_dir = PROJECT_ROOT / "celebrity-photos"
    output_file = PROJECT_ROOT / "public" / "reference-index.json"
    cloudinary_folder = "saptamukha/celebrities"

    # Validate directories and files
    if not celebrity_dir.exists():
        print(f"Error: Celebrity photos directory not found: {celebrity_dir}")
        return

    # Create output directory if needed
    output_file.parent.mkdir(exist_ok=True)

    # Delete old images from Cloudinary first
    delete_existing_cloudinary_images(cloudinary_folder)

    # Supported image extensions
    supported_extensions = {".jpg", ".jpeg", ".png", ".webp"}

    celebrities = []

    # Process each image in celebrity-photos directory
    for file_path in sorted(celebrity_dir.iterdir()):
        if file_path.suffix.lower() not in supported_extensions:
            continue
            
        # Add a small delay to avoid hitting rate limits
        time.sleep(2)

        print(f"\nProcessing: {file_path.name}")

        # Step 1: Get embedding from face service first so failed detections
        # do not waste Cloudinary uploads during large bulk runs.
        try:
            print("  Getting embedding from face service...")
            data = get_embedding_with_retry(file_path)
            descriptor = data["v"]
            quality = data.get("q")
            if quality is not None:
                print(f"  Embedding retrieved successfully (score={quality:.3f})")
            else:
                print("  Embedding retrieved successfully (score=N/A)")
        except requests.exceptions.RequestException as e:
            print(f"  Error getting embedding: {e}")
            continue

        # Step 2: Upload image to Cloudinary with compression
        try:
            print("  Uploading to Cloudinary...")
            upload_result = cloudinary.uploader.upload(
                str(file_path),
                folder=cloudinary_folder,
                transformation=[
                    {"width": 400, "height": 400, "crop": "thumb", "gravity": "face"},
                    {"quality": "auto:good"},
                    {"fetch_format": "jpg"},
                ],
                use_filename=True,
                unique_filename=True,
            )
            image_url = upload_result["secure_url"]
            print(f"  Uploaded successfully: {image_url}")
        except Exception as e:
            print(f"  Error uploading to Cloudinary: {e}")
            continue

        # Step 3: Add to celebrities list
        name = get_celebrity_name(file_path.name)
        celebrities.append({
            "name": name,
            "imageUrl": image_url,
            "descriptor": descriptor,
            "quality": quality,
        })

    # Write reference index to file
    reference_index = {
        "celebrities": celebrities,
    }

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(reference_index, f, ensure_ascii=False, indent=2)

    print(f"\nSuccessfully processed {len(celebrities)} celebrities!")
    print(f"Reference index saved to: {output_file}")

if __name__ == "__main__":
    process_celebrities()
