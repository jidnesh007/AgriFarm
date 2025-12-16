"""
Crop Disease Detection Module with Comprehensive Treatment Plans
Powered by Groq LLM
"""

import cv2
import numpy as np
import onnxruntime as ort
from pathlib import Path
import json
from groq import Groq

# Groq API Configuration
GROQ_API_KEY = "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"
groq_client = Groq(api_key=GROQ_API_KEY)

# Model paths
MODEL_PATH = "./model/best.onnx"

# Your exact class names
CLASS_NAMES = {
    0: "Apple_leaf",
    1: "Apple_rust_leaf",
    2: "Apple_Scab_Leaf",
    3: "Bell_pepper_leaf",
    4: "Bell_pepper_leaf_spot",
    5: "Blueberry_leaf",
    6: "Cherry_leaf",
    7: "Corn_Gray_leaf_spot",
    8: "Corn_leaf_blight",
    9: "Corn_rust_leaf",
    10: "grape_leaf",
    11: "grape_leaf_black_rot",
    12: "Peach_leaf",
    13: "Potato_leaf",
    14: "Potato_leaf_early_blight",
    15: "Potato_leaf_late_blight",
    16: "Raspberry_leaf",
    17: "Soyabean_leaf",
    18: "Squash_Powdery_mildew_leaf",
    19: "Strawberry_leaf",
    20: "Tomato_Early_blight_leaf",
    21: "Tomato_leaf",
    22: "Tomato_leaf_bacterial_spot",
    23: "Tomato_leaf_late_blight",
    24: "Tomato_leaf_mosaic_virus",
    25: "Tomato_leaf_yellow_virus",
    26: "Tomato_mold_leaf",
    27: "Tomato_Septoria_leaf_spot",
    28: "Tomato_two_spotted_spider_mites_leaf"
}

DISEASE_INFO = {
    0: {"crop": "Apple", "disease": "Healthy", "status": "healthy"},
    1: {"crop": "Apple", "disease": "Rust", "status": "diseased"},
    2: {"crop": "Apple", "disease": "Scab", "status": "diseased"},
    3: {"crop": "Bell Pepper", "disease": "Healthy", "status": "healthy"},
    4: {"crop": "Bell Pepper", "disease": "Leaf Spot", "status": "diseased"},
    5: {"crop": "Blueberry", "disease": "Healthy", "status": "healthy"},
    6: {"crop": "Cherry", "disease": "Healthy", "status": "healthy"},
    7: {"crop": "Corn", "disease": "Gray Leaf Spot", "status": "diseased"},
    8: {"crop": "Corn", "disease": "Leaf Blight", "status": "diseased"},
    9: {"crop": "Corn", "disease": "Rust", "status": "diseased"},
    10: {"crop": "Grape", "disease": "Healthy", "status": "healthy"},
    11: {"crop": "Grape", "disease": "Black Rot", "status": "diseased"},
    12: {"crop": "Peach", "disease": "Healthy", "status": "healthy"},
    13: {"crop": "Potato", "disease": "Healthy", "status": "healthy"},
    14: {"crop": "Potato", "disease": "Early Blight", "status": "diseased"},
    15: {"crop": "Potato", "disease": "Late Blight", "status": "diseased"},
    16: {"crop": "Raspberry", "disease": "Healthy", "status": "healthy"},
    17: {"crop": "Soybean", "disease": "Healthy", "status": "healthy"},
    18: {"crop": "Squash", "disease": "Powdery Mildew", "status": "diseased"},
    19: {"crop": "Strawberry", "disease": "Healthy", "status": "healthy"},
    20: {"crop": "Tomato", "disease": "Early Blight", "status": "diseased"},
    21: {"crop": "Tomato", "disease": "Healthy", "status": "healthy"},
    22: {"crop": "Tomato", "disease": "Bacterial Spot", "status": "diseased"},
    23: {"crop": "Tomato", "disease": "Late Blight", "status": "diseased"},
    24: {"crop": "Tomato", "disease": "Mosaic Virus", "status": "diseased"},
    25: {"crop": "Tomato", "disease": "Yellow Leaf Curl Virus", "status": "diseased"},
    26: {"crop": "Tomato", "disease": "Leaf Mold", "status": "diseased"},
    27: {"crop": "Tomato", "disease": "Septoria Leaf Spot", "status": "diseased"},
    28: {"crop": "Tomato", "disease": "Two Spotted Spider Mites", "status": "diseased"}
}

# Load ONNX model
try:
    session = ort.InferenceSession(MODEL_PATH, providers=['CPUExecutionProvider'])
    print(f"✅ Model loaded from {MODEL_PATH}")
    input_name = session.get_inputs()[0].name
    print(f"✅ Groq LLM initialized for treatment generation")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    session = None


def generate_treatment_plan(crop_type, disease_name, disease_status, severity_level, confidence, growth_stage, affected_percentage):
    """
    Generate comprehensive treatment plan using Groq LLM
    """
    try:
        if disease_status == "healthy":
            prompt = f"""You are an experienced agricultural expert. A farmer's {crop_type} plant is HEALTHY with {int(confidence * 100)}% confidence.

Provide a structured maintenance plan in this EXACT format:

🎯 DIAGNOSIS:
[Brief congratulatory message]

✅ CURRENT STATUS:
• Health: Excellent
• Growth Stage: {growth_stage}
• Next Steps: Continue monitoring

🌱 MAINTENANCE PLAN:
1. [First maintenance tip]
2. [Second maintenance tip]
3. [Third maintenance tip]

🛡️ PREVENTION TIPS:
• [First prevention tip]
• [Second prevention tip]
• [Third prevention tip]

📅 MONITORING SCHEDULE:
• Check plants every [frequency]
• Watch for [specific signs]

Keep it simple and encouraging. Use emojis. Max 200 words."""

        else:
            prompt = f"""You are an expert agricultural advisor. Provide a COMPLETE TREATMENT PLAN for a farmer.

DISEASE DETAILS:
- Crop: {crop_type}
- Disease: {disease_name}
- Severity: {severity_level}
- Affected Area: {affected_percentage}%
- Confidence: {int(confidence * 100)}%
- Growth Stage: {growth_stage}

Provide treatment in this EXACT format:

🎯 DIAGNOSIS:
[1-2 sentences explaining what the disease is in simple terms]

⚠️ URGENCY LEVEL:
{severity_level.upper()} - [Action timeline]

💊 CHEMICAL TREATMENT:
Product Name: [Specific fungicide/pesticide name]
Dosage: [Amount per liter/gallon]
Application: [How to apply - spray, drench, etc.]
Frequency: [How often - daily, weekly]
Duration: [How many days/weeks]
Safety: [Wear gloves, mask, etc.]

🌿 ORGANIC TREATMENT:
Home Remedy: [Natural solution name]
Recipe: [How to prepare it]
Application: [How to apply]
Frequency: [How often]
Duration: [How long to continue]

📋 STEP-BY-STEP ACTION PLAN:
Day 1: [What to do immediately]
Day 2-7: [Weekly actions]
Day 8-14: [Follow-up actions]

🛡️ PREVENTION FOR FUTURE:
1. [First prevention tip]
2. [Second prevention tip]
3. [Third prevention tip]

⏰ WHEN TO APPLY:
Best Time: [Morning/evening/specific time]
Weather: [Avoid rain, apply before rain, etc.]
Temperature: [Ideal temperature range]

⚕️ IMPORTANT NOTES:
• [Critical safety or effectiveness tip]
• [When to see improvement]
• [When to consult expert if no improvement]

Use simple Hinglish words. Be specific with product names and quantities. Max 350 words."""

        # Call Groq API with Llama 3.1 70B for detailed treatment
        chat_completion = groq_client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are Dr. Singh, a senior agricultural scientist with 30 years of experience. You explain treatments in simple Hindi-English that Indian farmers understand. Always provide specific product names, exact dosages, and clear timelines. Use emojis for sections."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            temperature=0.6,  # Lower for more consistent treatment plans
            max_tokens=800,
            top_p=0.9
        )

        return chat_completion.choices[0].message.content.strip()

    except Exception as e:
        print(f"Groq API Error: {e}")
        # Fallback
        if disease_status == "healthy":
            return "✅ Your crop is healthy! Continue good care practices and monitor weekly."
        else:
            return f"⚠️ {disease_name} detected. Please consult local agricultural expert for treatment plan."


def generate_quick_summary(crop_type, disease_name, disease_status, severity_level):
    """Generate short summary"""
    try:
        if disease_status == "healthy":
            prompt = f"In ONE sentence with emoji, congratulate farmer whose {crop_type} is healthy. Be warm."
        else:
            prompt = f"In ONE urgent sentence with emoji, alert farmer about {disease_name} on {crop_type} ({severity_level} severity). Be actionable."

        chat_completion = groq_client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a helpful farm advisor. ONE SHORT sentence only with emoji."},
                {"role": "user", "content": prompt}
            ],
            model="llama-3.1-8b-instant",
            temperature=0.8,
            max_tokens=50
        )

        return chat_completion.choices[0].message.content.strip()

    except Exception as e:
        if disease_status == "healthy":
            return f"✅ Your {crop_type} is healthy!"
        else:
            return f"⚠️ {disease_name} detected - Action needed"


# [Keep all the preprocessing, detection, and helper functions from previous code]
def preprocess_image(image_path, input_size=640):
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Could not read image: {image_path}")
    original_shape = img.shape[:2]
    img_resized = letterbox(img, new_shape=(input_size, input_size))[0]
    img_rgb = cv2.cvtColor(img_resized, cv2.COLOR_BGR2RGB)
    img_normalized = img_rgb.astype(np.float32) / 255.0
    img_transposed = np.transpose(img_normalized, (2, 0, 1))
    img_batch = np.expand_dims(img_transposed, axis=0)
    return img_batch, img, original_shape

def letterbox(img, new_shape=(640, 640), color=(114, 114, 114)):
    shape = img.shape[:2]
    r = min(new_shape[0] / shape[0], new_shape[1] / shape[1])
    new_unpad = int(round(shape[1] * r)), int(round(shape[0] * r))
    dw, dh = new_shape[1] - new_unpad[0], new_shape[0] - new_unpad[1]
    dw /= 2
    dh /= 2
    if shape[::-1] != new_unpad:
        img = cv2.resize(img, new_unpad, interpolation=cv2.INTER_LINEAR)
    top, bottom = int(round(dh - 0.1)), int(round(dh + 0.1))
    left, right = int(round(dw - 0.1)), int(round(dw + 0.1))
    img = cv2.copyMakeBorder(img, top, bottom, left, right, cv2.BORDER_CONSTANT, value=color)
    return img, r, (dw, dh)

def estimate_severity(image, bbox, disease_status):
    if disease_status == "healthy":
        return {"level": "None", "score": 0, "percentage": 0.0}
    x1, y1, x2, y2 = bbox
    x1, y1, x2, y2 = max(0, int(x1)), max(0, int(y1)), int(x2), int(y2)
    if x2 <= x1 or y2 <= y1:
        return {"level": "Low", "score": 1, "percentage": 10.0}
    roi = image[y1:y2, x1:x2]
    if roi.size == 0:
        return {"level": "Low", "score": 1, "percentage": 10.0}
    hsv = cv2.cvtColor(roi, cv2.COLOR_BGR2HSV)
    lower_disease = np.array([10, 50, 20])
    upper_disease = np.array([40, 255, 255])
    disease_mask = cv2.inRange(hsv, lower_disease, upper_disease)
    disease_pixels = cv2.countNonZero(disease_mask)
    total_pixels = roi.shape[0] * roi.shape[1]
    severity_ratio = disease_pixels / total_pixels if total_pixels > 0 else 0
    if severity_ratio < 0.15:
        level, score = "Low", 1
    elif severity_ratio < 0.4:
        level, score = "Moderate", 2
    else:
        level, score = "High", 3
    return {"level": level, "score": score, "percentage": round(severity_ratio * 100, 2)}

def estimate_growth_stage(bbox_area_ratio):
    if bbox_area_ratio < 0.2:
        return {"stage": "Early/Seedling", "code": 1}
    elif bbox_area_ratio < 0.5:
        return {"stage": "Vegetative", "code": 2}
    else:
        return {"stage": "Flowering/Mature", "code": 3}

def xywh2xyxy(x):
    y = np.zeros_like(x)
    y[..., 0] = x[..., 0] - x[..., 2] / 2
    y[..., 1] = x[..., 1] - x[..., 3] / 2
    y[..., 2] = x[..., 0] + x[..., 2] / 2
    y[..., 3] = x[..., 1] + x[..., 3] / 2
    return y

def nms(boxes, scores, iou_threshold=0.45):
    if len(boxes) == 0:
        return []
    x1, y1, x2, y2 = boxes[:, 0], boxes[:, 1], boxes[:, 2], boxes[:, 3]
    areas = (x2 - x1) * (y2 - y1)
    order = scores.argsort()[::-1]
    keep = []
    while order.size > 0:
        i = order[0]
        keep.append(i)
        xx1 = np.maximum(x1[i], x1[order[1:]])
        yy1 = np.maximum(y1[i], y1[order[1:]])
        xx2 = np.minimum(x2[i], x2[order[1:]])
        yy2 = np.minimum(y2[i], y2[order[1:]])
        w = np.maximum(0.0, xx2 - xx1)
        h = np.maximum(0.0, yy2 - yy1)
        inter = w * h
        iou = inter / (areas[i] + areas[order[1:]] - inter)
        inds = np.where(iou <= iou_threshold)[0]
        order = order[inds + 1]
    return keep


def detect_disease(image_path, confidence_threshold=0.20):
    """Main detection function with comprehensive treatment"""
    if session is None:
        return {"error": "Model not loaded"}
    
    try:
        # Preprocess
        input_data, original_img, original_shape = preprocess_image(image_path)
        
        # Inference
        outputs = session.run(None, {input_name: input_data})
        predictions = outputs[0][0].T
        
        # Parse predictions
        boxes = predictions[:, :4]
        scores = predictions[:, 4:]
        max_scores = np.max(scores, axis=1)
        class_ids = np.argmax(scores, axis=1)
        
        # Filter by confidence
        mask = max_scores >= confidence_threshold
        
        if not mask.any():
            return {"error": "No crop detected. Please upload a clear image of a plant leaf."}
        
        boxes = boxes[mask]
        max_scores = max_scores[mask]
        class_ids = class_ids[mask]
        
        # Convert boxes
        boxes_xyxy = xywh2xyxy(boxes)
        h, w = original_shape
        boxes_xyxy[:, [0, 2]] *= w / 640
        boxes_xyxy[:, [1, 3]] *= h / 640
        
        # NMS
        keep_indices = nms(boxes_xyxy, max_scores)
        
        if len(keep_indices) == 0:
            return {"error": "No valid detections found."}
        
        # Best detection
        best_idx = keep_indices[0]
        best_box = boxes_xyxy[best_idx]
        best_score = max_scores[best_idx]
        best_class = class_ids[best_idx]
        
        # Get disease info
        if best_class not in DISEASE_INFO:
            return {"error": f"Unknown class detected: {best_class}"}
        
        info = DISEASE_INFO[best_class]
        crop_type = info["crop"]
        disease_name = info["disease"]
        disease_status = info["status"]
        
        # Metrics
        bbox_coords = best_box.tolist()
        bbox_area = (bbox_coords[2] - bbox_coords[0]) * (bbox_coords[3] - bbox_coords[1])
        bbox_area_ratio = bbox_area / (h * w)
        
        # Severity & Growth stage
        severity = estimate_severity(original_img, bbox_coords, disease_status)
        growth_stage = estimate_growth_stage(bbox_area_ratio)
        
        # Generate AI-powered treatment plan
        print("🤖 Generating comprehensive treatment plan with AI...")
        treatment_plan = generate_treatment_plan(
            crop_type, disease_name, disease_status, 
            severity['level'], best_score, growth_stage['stage'],
            severity['percentage']
        )
        
        quick_summary = generate_quick_summary(
            crop_type, disease_name, disease_status, severity['level']
        )
        
        return {
            "success": True,
            "crop_type": crop_type,
            "disease_name": disease_name,
            "disease_status": disease_status,
            "confidence": round(float(best_score), 3),
            "severity": severity,
            "growth_stage": growth_stage,
            "quick_summary": quick_summary,
            "treatment_plan": treatment_plan,
            "ai_generated": True,
            "bbox": bbox_coords
        }
        
    except Exception as e:
        import traceback
        print(f"Error: {str(e)}")
        print(traceback.format_exc())
        return {"error": f"Detection failed: {str(e)}"}


if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        result = detect_disease(sys.argv[1])
        print(json.dumps(result, indent=2))
    else:
        print("Usage: python disease_detector.py <image_path>")
