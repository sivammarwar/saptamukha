"""
Pure ONNX Runtime face detection & recognition.
Loads ONNX model weights directly — no third-party face SDK.
"""
import os
import numpy as np
import cv2
import onnxruntime as ort

# Paths relative to this file
MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")

# Standard 5-point face template for alignment (112x112)
# Order: left_eye, right_eye, nose, left_mouth, right_mouth
ALIGNMENT_TEMPLATE = np.array([
    [38.2946, 51.6963],
    [73.5318, 51.5014],
    [56.0252, 71.7366],
    [41.5493, 92.3655],
    [70.7299, 92.2041],
], dtype=np.float32)


class OnnxFaceService:
    def __init__(self, models_dir=MODELS_DIR):
        self.models_dir = models_dir
        providers = ['CPUExecutionProvider']

        det_path = os.path.join(models_dir, "det_10g.onnx")
        rec_path = os.path.join(models_dir, "w600k_r50.onnx")
        ga_path = os.path.join(models_dir, "genderage.onnx")

        if not os.path.exists(det_path):
            raise FileNotFoundError(f"Detection model not found: {det_path}. Run download_models.py first.")
        if not os.path.exists(rec_path):
            raise FileNotFoundError(f"Recognition model not found: {rec_path}. Run download_models.py first.")

        self.det_session = ort.InferenceSession(det_path, providers=providers)
        self.rec_session = ort.InferenceSession(rec_path, providers=providers)
        self.ga_session = ort.InferenceSession(ga_path, providers=providers) if os.path.exists(ga_path) else None

        # Cache input/output names
        self.det_input = self.det_session.get_inputs()[0].name
        self.det_out_names = [o.name for o in self.det_session.get_outputs()]

        self.rec_input = self.rec_session.get_inputs()[0].name
        self.rec_output = self.rec_session.get_outputs()[0].name

        if self.ga_session:
            self.ga_input = self.ga_session.get_inputs()[0].name
            self.ga_output = self.ga_session.get_outputs()[0].name

    def _preprocess_detection(self, img):
        """Resize to 640x640 with aspect-ratio padding, normalize."""
        h, w = img.shape[:2]
        scale = 640 / max(h, w)
        new_h, new_w = int(h * scale), int(w * scale)
        resized = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_LINEAR)

        # Pad to 640x640 with black
        pad_h = 640 - new_h
        pad_w = 640 - new_w
        padded = cv2.copyMakeBorder(resized, 0, pad_h, 0, pad_w, cv2.BORDER_CONSTANT, value=0)

        # Normalize: (img - 127.5) / 128.0
        padded = padded.astype(np.float32)
        padded = (padded - 127.5) / 128.0

        # HWC -> CHW, add batch
        blob = np.transpose(padded, (2, 0, 1))[np.newaxis, ...]
        return blob, scale, pad_w, pad_h

    def _generate_anchors(self, feat_h, feat_w, stride, num_anchors=2):
        """Generate anchor centers for a given feature map size and stride.
        The detector uses num_anchors (typically 2) per cell."""
        shifts_x = np.arange(0, feat_w * stride, stride, dtype=np.float32)
        shifts_y = np.arange(0, feat_h * stride, stride, dtype=np.float32)
        shifts_x, shifts_y = np.meshgrid(shifts_x, shifts_y)
        centers = np.stack((shifts_x, shifts_y), axis=-1).reshape(-1, 2)
        # Tile for num_anchors per cell
        anchors = np.repeat(centers, num_anchors, axis=0)
        return anchors

    def _decode_scrfd(self, img_h, img_w, outputs, score_thresh=0.5, nms_thresh=0.4, top_k=1):
        """
        Decode detector outputs.
        outputs order from det_10g.onnx:
          scores stride8, scores stride16, scores stride32,
          bboxes stride8, bboxes stride16, bboxes stride32,
          kps stride8, kboxes stride16, kps stride32
        """
        num_levels = 3
        strides = [8, 16, 32]

        # Split outputs
        score_outputs = outputs[:num_levels]      # [12800,1], [3200,1], [800,1]
        bbox_outputs = outputs[num_levels:2*num_levels]  # [12800,4], [3200,4], [800,4]
        kps_outputs = outputs[2*num_levels:]      # [12800,10], [3200,10], [800,10]

        all_scores = []
        all_bboxes = []
        all_kps = []

        for stride, scores, bboxes, kps in zip(strides, score_outputs, bbox_outputs, kps_outputs):
            scores = 1 / (1 + np.exp(-scores.squeeze(-1)))  # sigmoid
            feat_h = 640 // stride
            feat_w = 640 // stride
            anchors = self._generate_anchors(feat_h, feat_w, stride)

            # Decode bboxes: [l, t, r, b] distances from anchor center in stride units
            l = anchors[:, 0] - bboxes[:, 0] * stride
            t = anchors[:, 1] - bboxes[:, 1] * stride
            r = anchors[:, 0] + bboxes[:, 2] * stride
            b = anchors[:, 1] + bboxes[:, 3] * stride
            decoded_bboxes = np.stack([l, t, r, b], axis=1)

            # Decode keypoints: 5 points, each offset from anchor center
            # kps shape: [N, 10] -> [N, 5, 2]
            kps = kps.reshape(-1, 5, 2)
            decoded_kps = anchors[:, np.newaxis, :] + kps * stride

            all_scores.append(scores)
            all_bboxes.append(decoded_bboxes)
            all_kps.append(decoded_kps.reshape(-1, 10))

        scores = np.concatenate(all_scores)
        bboxes = np.concatenate(all_bboxes)
        kps = np.concatenate(all_kps)

        # Filter by score
        keep = scores > score_thresh
        scores = scores[keep]
        bboxes = bboxes[keep]
        kps = kps[keep]

        if len(scores) == 0:
            return []

        # Clip to image bounds
        bboxes[:, [0, 2]] = np.clip(bboxes[:, [0, 2]], 0, img_w)
        bboxes[:, [1, 3]] = np.clip(bboxes[:, [1, 3]], 0, img_h)

        # NMS
        indices = cv2.dnn.NMSBoxes(
            bboxes[:, [0, 1, 2, 3]].tolist(),
            scores.tolist(),
            score_threshold=score_thresh,
            nms_threshold=nms_thresh,
            top_k=top_k
        )

        if len(indices) == 0:
            return []

        results = []
        for i in indices.flatten()[:top_k]:
            results.append({
                'bbox': bboxes[i].tolist(),
                'score': float(scores[i]),
                'kps': kps[i].reshape(5, 2).tolist(),
            })
        return results

    def _align_face(self, img, kps):
        """Align face to standard template using 5-point landmarks."""
        src = np.array(kps, dtype=np.float32)
        dst = ALIGNMENT_TEMPLATE

        # Use similarity transform (scale + rotation + translation)
        M, _ = cv2.estimateAffinePartial2D(src, dst)
        if M is None:
            # Fallback to simple resize if alignment fails
            h, w = img.shape[:2]
            face = cv2.resize(img, (112, 112), interpolation=cv2.INTER_LINEAR)
            return face

        aligned = cv2.warpAffine(img, M, (112, 112), borderValue=0)
        return aligned

    def _preprocess_recognition(self, aligned_face):
        """Preprocess aligned face for recognition ONNX."""
        face = aligned_face.astype(np.float32)
        # Normalize: (img / 255 - 0.5) / 0.5  =>  img / 127.5 - 1.0
        face = face / 127.5 - 1.0
        # HWC -> CHW, add batch
        blob = np.transpose(face, (2, 0, 1))[np.newaxis, ...]
        return blob

    def _preprocess_genderage(self, aligned_face):
        """Preprocess aligned face for genderage ONNX."""
        face = cv2.resize(aligned_face, (96, 96), interpolation=cv2.INTER_LINEAR)
        face = face.astype(np.float32)
        face = (face - 127.5) / 128.0
        blob = np.transpose(face, (2, 0, 1))[np.newaxis, ...]
        return blob

    def detect(self, img):
        """
        Detect faces in image. Returns list of dicts with bbox, score, kps.
        Each bbox is [left, top, right, bottom].
        """
        h, w = img.shape[:2]
        blob, scale, pad_w, pad_h = self._preprocess_detection(img)
        outputs = self.det_session.run(self.det_out_names, {self.det_input: blob})

        # Undo padding scaling for bboxes
        results = self._decode_scrfd(h, w, outputs, score_thresh=0.5, nms_thresh=0.4, top_k=10)

        # Scale bboxes back to original image (undo resize)
        for r in results:
            bbox = r['bbox']
            # The image was scaled to fit in 640x640, so scale coords back
            r['bbox'] = [
                bbox[0] / scale,
                bbox[1] / scale,
                bbox[2] / scale,
                bbox[3] / scale,
            ]
            r['kps'] = [[kp[0] / scale, kp[1] / scale] for kp in r['kps']]

        return results

    def recognize(self, img, face_info):
        """
        Extract embedding from detected face.
        Returns dict with embedding, quality_score.
        """
        # Crop face region for alignment
        bbox = face_info['bbox']
        l, t, r, b = [int(x) for x in bbox]
        l = max(0, l)
        t = max(0, t)
        r = min(img.shape[1], r)
        b = min(img.shape[0], b)
        face_crop = img[t:b, l:r]

        if face_crop.size == 0:
            raise ValueError("Empty face crop")

        # Align using 5-point landmarks
        aligned = self._align_face(face_crop, face_info['kps'])

        # Run recognition
        blob = self._preprocess_recognition(aligned)
        embedding = self.rec_session.run([self.rec_output], {self.rec_input: blob})[0][0]

        # L2 normalize
        norm = np.linalg.norm(embedding)
        if norm > 0:
            embedding = embedding / norm

        return {
            'embedding': embedding.tolist(),
            'quality': float(face_info['score']),
        }

    def get_age_gender(self, aligned_face):
        """Get age and gender from aligned face."""
        if self.ga_session is None:
            return None, None

        blob = self._preprocess_genderage(aligned_face)
        output = self.ga_session.run([self.ga_output], {self.ga_input: blob})[0][0]

        # Output: [gender_logit_0, gender_logit_1, age]
        gender = int(np.argmax(output[:2]))
        age = int(output[2] * 100)  # age is typically scaled

        return gender, age

    def process(self, img):
        """
        Full pipeline: detect -> recognize.
        Returns dict with embedding, quality, bbox, age, gender.
        Raises if no face or multiple faces.
        """
        faces = self.detect(img)
        if not faces:
            raise ValueError("no_face_detected")
        if len(faces) > 1:
            raise ValueError("multiple_faces")

        face = faces[0]
        result = self.recognize(img, face)

        # Get age/gender
        bbox = face['bbox']
        l, t, r, b = [int(x) for x in bbox]
        l, t = max(0, l), max(0, t)
        r, b = min(img.shape[1], r), min(img.shape[0], b)
        face_crop = img[t:b, l:r]
        aligned = self._align_face(face_crop, face['kps'])
        gender, age = self.get_age_gender(aligned)

        result['bbox'] = face['bbox']
        result['age'] = age
        result['gender'] = gender
        return result


# Global singleton
_face_service = None

def get_face_service(models_dir=MODELS_DIR):
    global _face_service
    if _face_service is None:
        _face_service = OnnxFaceService(models_dir)
    return _face_service
