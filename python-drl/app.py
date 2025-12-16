"""
FastAPI server for Agriculture AI Services
- DRL Recommendations
- Disease Detection
"""

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict
import uvicorn
import shutil
from pathlib import Path
import os

# Import existing modules
from load_model import get_recommendation

# Import disease detection
from disease_detector import detect_disease

app = FastAPI(
    title="Agriculture AI API",
    description="DRL recommendations + Disease detection",
    version="2.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory
UPLOAD_DIR = Path("./uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# ============================================================
# EXISTING DRL RECOMMENDATION ENDPOINT
# ============================================================

class SoilDataInput(BaseModel):
    moisture: float = Field(..., ge=0, le=100)
    nitrogen: float = Field(..., ge=0, le=200)
    phosphorus: float = Field(..., ge=0, le=200)
    potassium: float = Field(..., ge=0, le=200)
    ph: float = Field(..., ge=4.0, le=9.0)
    growth: float = Field(..., ge=0.0, le=1.0)
    temp: float = Field(..., ge=-10, le=50)
    humidity: float = Field(..., ge=0, le=100)
    rain_prob: float = Field(..., ge=0.0, le=1.0)

@app.post("/recommend")
async def get_irrigation_recommendation(data: SoilDataInput) -> Dict:
    try:
        recommendation = get_recommendation(
            moisture=data.moisture,
            nitrogen=data.nitrogen,
            phosphorus=data.phosphorus,
            potassium=data.potassium,
            ph=data.ph,
            growth=data.growth,
            temp=data.temp,
            humidity=data.humidity,
            rain_prob=data.rain_prob
        )
        return recommendation
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================
# NEW DISEASE DETECTION ENDPOINT
# ============================================================

@app.post("/detect-disease")
async def detect_crop_disease(file: UploadFile = File(...)):
    """
    Upload crop/leaf image and get disease detection results
    """
    try:
        # Validate file type
        if not file.content_type.startswith("image/"):
            raise HTTPException(
                status_code=400,
                detail="File must be an image (JPEG, PNG, etc.)"
            )
        
        # Save uploaded file
        file_path = UPLOAD_DIR / file.filename
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Run disease detection
        result = detect_disease(str(file_path))
        
        # Clean up uploaded file
        file_path.unlink()
        
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Detection error: {str(e)}")

# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "Agriculture AI API",
        "endpoints": {
            "drl_recommendation": "/recommend",
            "disease_detection": "/detect-disease",
            "health": "/health"
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "services": {
            "drl_model": True,
            "disease_detector": True
        }
    }

if __name__ == "__main__":
    print("🚀 Starting Agriculture AI API Server...")
    print("📍 Server: http://localhost:8000")
    print("📖 Docs: http://localhost:8000/docs")
    print("\n🔬 Services:")
    print("  - DRL Recommendations: POST /recommend")
    print("  - Disease Detection: POST /detect-disease")
    
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
