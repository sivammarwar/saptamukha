"""
Download ONNX model files for the face service.
Run once before starting the service.
"""
import os
import sys

MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")
MODEL_ARCHIVE_URL = os.environ.get("MODEL_ARCHIVE_URL", "")
MODEL_SOURCE_HINT = os.environ.get("MODEL_SOURCE_HINT", "")

def main():
    os.makedirs(MODELS_DIR, exist_ok=True)

    # Check if models already exist
    required = ["det_10g.onnx", "w600k_r50.onnx", "genderage.onnx"]
    missing = [f for f in required if not os.path.exists(os.path.join(MODELS_DIR, f))]

    if not missing:
        print("All ONNX models already present.")
        return

    print(f"Missing models: {missing}")
    if MODEL_ARCHIVE_URL:
        print("\nDownload the approved model archive from:")
        print(f"  {MODEL_ARCHIVE_URL}")
    else:
        print("\nProvide the approved ONNX model pack from your internal source.")
    print(f"\nExtract the .onnx files to: {MODELS_DIR}")
    if MODEL_SOURCE_HINT:
        print("\nModel source hint:")
        print(f"  {MODEL_SOURCE_HINT}")
    sys.exit(1)

if __name__ == "__main__":
    main()
