"""
FastAPI server for DRL recommendation service
Provides REST API endpoint for MERN application
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict
import uvicorn
from load_model import get_recommendation

# Initialize FastAPI app
app = FastAPI(
    title="Agriculture DRL API",
    description="Deep Reinforcement Learning model for irrigation and fertilization recommendations",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request model
class SoilDataInput(BaseModel):
    """Input data model for recommendation request"""
    moisture: float = Field(..., ge=0, le=100, description="Soil moisture percentage")
    nitrogen: float = Field(..., ge=0, le=200, description="Nitrogen level (ppm)")
    phosphorus: float = Field(..., ge=0, le=200, description="Phosphorus level (ppm)")
    potassium: float = Field(..., ge=0, le=200, description="Potassium level (ppm)")
    ph: float = Field(..., ge=4.0, le=9.0, description="Soil pH")
    growth: float = Field(..., ge=0.0, le=1.0, description="Crop growth stage (0-1)")
    temp: float = Field(..., ge=-10, le=50, description="Temperature (°C)")
    humidity: float = Field(..., ge=0, le=100, description="Humidity percentage")
    rain_prob: float = Field(..., ge=0.0, le=1.0, description="Rain probability (0-1)")
    
    class Config:
        json_schema_extra = {
            "example": {
                "moisture": 35.5,
                "nitrogen": 45.0,
                "phosphorus": 30.0,
                "potassium": 40.0,
                "ph": 6.5,
                "growth": 0.5,
                "temp": 28.0,
                "humidity": 60.0,
                "rain_prob": 0.3
            }
        }


# Response model
class RecommendationOutput(BaseModel):
    """Output data model for recommendation response"""
    irrigation_mm: int = Field(..., description="Recommended irrigation amount (mm)")
    fertilizer_kg: int = Field(..., description="Recommended fertilizer amount (kg/acre)")
    health: float = Field(..., description="Current crop health score (0-100)")
    
    class Config:
        json_schema_extra = {
            "example": {
                "irrigation_mm": 10,
                "fertilizer_kg": 2,
                "health": 75.5
            }
        }


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "online",
        "service": "Agriculture DRL API",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "model_loaded": True,
        "endpoints": ["/", "/health", "/recommend"]
    }


@app.post("/recommend", response_model=RecommendationOutput)
async def get_irrigation_recommendation(data: SoilDataInput) -> Dict:
    """
    Get irrigation and fertilizer recommendation based on soil conditions
    
    Args:
        data: SoilDataInput containing all sensor readings
    
    Returns:
        RecommendationOutput with irrigation amount, fertilizer amount, and health score
    """
    try:
        # Call the recommendation function
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
        raise HTTPException(
            status_code=500,
            detail=f"Error generating recommendation: {str(e)}"
        )


if __name__ == "__main__":
    print("🚀 Starting Agriculture DRL API Server...")
    print("📍 Server will be available at: http://localhost:8000")
    print("📖 API Documentation: http://localhost:8000/docs")
    print("🔄 Interactive API: http://localhost:8000/redoc")
    
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # Auto-reload on code changes
        log_level="info"
    )
