import cv2
import sys
import json
import numpy as np

def verify_faces(saved_photo_path, live_photo_path):
    try:
        # Load images
        saved_image = cv2.imread(saved_photo_path)
        live_image = cv2.imread(live_photo_path)
        
        if saved_image is None or live_image is None:
            return {"success": False, "message": "Could not load one or both images"}

        # Convert to grayscale
        saved_gray = cv2.cvtColor(saved_image, cv2.COLOR_BGR2GRAY)
        live_gray = cv2.cvtColor(live_image, cv2.COLOR_BGR2GRAY)

        # Load Haar Cascade for face detection
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        
        # Detect faces
        saved_faces = face_cascade.detectMultiScale(saved_gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
        live_faces = face_cascade.detectMultiScale(live_gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        if len(saved_faces) == 0 or len(live_faces) == 0:
            return {"success": False, "message": "No face detected in one or both images"}

        # Extract the first face from each image
        (x1, y1, w1, h1) = saved_faces[0]
        (x2, y2, w2, h2) = live_faces[0]
        
        saved_face = saved_gray[y1:y1+h1, x1:x1+w1]
        live_face = live_gray[y2:y2+h2, x2:x2+w2]

        # Resize faces to a standard size
        saved_face_resized = cv2.resize(saved_face, (100, 100), interpolation=cv2.INTER_AREA)
        live_face_resized = cv2.resize(live_face, (100, 100), interpolation=cv2.INTER_AREA)

        # Compute histograms
        saved_hist = cv2.calcHist([saved_face_resized], [0], None, [256], [0, 256])
        live_hist = cv2.calcHist([live_face_resized], [0], None, [256], [0, 256])

        # Normalize histograms
        cv2.normalize(saved_hist, saved_hist)
        cv2.normalize(live_hist, live_hist)

        # Compare histograms using correlation (higher value = more similar)
        similarity = cv2.compareHist(saved_hist, live_hist, cv2.HISTCMP_CORREL)
        
        # Threshold for similarity (tune this; 0.7 is a starting point)
        threshold = 0.4
        match = bool(similarity > threshold)
        
        return {
            "success": match,
            "message": "Face match successful" if match else "Faces do not match",
            "similarity": float(similarity)  # For debugging/tuning
        }
    except Exception as e:
        return {"success": False, "message": f"Error during face comparison: {str(e)}"}

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(json.dumps({"success": False, "message": "Invalid arguments"}))
        sys.exit(1)
    saved_photo_path = sys.argv[1]
    live_photo_path = sys.argv[2]
    result = verify_faces(saved_photo_path, live_photo_path)
    print(json.dumps(result))