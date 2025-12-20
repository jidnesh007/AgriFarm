"""
app.py - Complete FastAPI Server for Agriculture AI Services
- DRL Recommendations
- Disease Detection  
- Voice Assistant with Groq LLM
"""

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, Optional, List
import uvicorn
import shutil
from pathlib import Path
import os
from groq import Groq
from dotenv import load_dotenv
import time

# Load environment variables
load_dotenv()

# Import existing modules
try:
    from load_model import get_recommendation
    DRL_AVAILABLE = True
except ImportError:
    print("⚠️  Warning: load_model.py not found. DRL recommendations disabled.")
    DRL_AVAILABLE = False

try:
    from disease_detector import detect_disease
    DISEASE_DETECTION_AVAILABLE = True
except ImportError:
    print("⚠️  Warning: disease_detector.py not found. Disease detection disabled.")
    DISEASE_DETECTION_AVAILABLE = False

# Initialize Groq client
GROQ_API_KEY = "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"
if GROQ_API_KEY:
    groq_client = Groq(api_key=GROQ_API_KEY)
    VOICE_ASSISTANT_AVAILABLE = True
else:
    print("⚠️  Warning: GROQ_API_KEY not found. Voice assistant disabled.")
    VOICE_ASSISTANT_AVAILABLE = False

# Initialize FastAPI
app = FastAPI(
    title="Agriculture AI API",
    description="Complete AI solution for farmers: DRL recommendations, Disease detection, Voice assistant",
    version="3.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173", 
        "http://localhost:5000",
        "*"  # Remove in production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory
UPLOAD_DIR = Path("./uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


# ============================================================
# PYDANTIC MODELS
# ============================================================

class SoilDataInput(BaseModel):
    """DRL Model Input"""
    moisture: float = Field(..., ge=0, le=100, description="Soil moisture percentage")
    nitrogen: float = Field(..., ge=0, le=200, description="Nitrogen level (kg/ha)")
    phosphorus: float = Field(..., ge=0, le=200, description="Phosphorus level (kg/ha)")
    potassium: float = Field(..., ge=0, le=200, description="Potassium level (kg/ha)")
    ph: float = Field(..., ge=4.0, le=9.0, description="Soil pH level")
    growth: float = Field(..., ge=0.0, le=1.0, description="Crop growth stage (0-1)")
    temp: float = Field(..., ge=-10, le=50, description="Temperature (°C)")
    humidity: float = Field(..., ge=0, le=100, description="Humidity percentage")
    rain_prob: float = Field(..., ge=0.0, le=1.0, description="Rain probability (0-1)")


class FieldContext(BaseModel):
    """Field data for context-aware voice responses"""
    fieldName: str
    cropType: str
    area: str
    location: str
    soilMoisture: Optional[float] = None
    soilPH: Optional[float] = None
    soilNitrogen: Optional[float] = None
    soilPhosphorus: Optional[float] = None
    soilPotassium: Optional[float] = None
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    rainfall: Optional[float] = None
    lastWatered: Optional[str] = None
    wateringSchedule: Optional[str] = None
    healthScore: Optional[float] = None
    healthStatus: Optional[str] = None
    aiRecommendations: Optional[List[str]] = []


class VoiceQuery(BaseModel):
    """Voice assistant query"""
    question: str = Field(..., min_length=1, max_length=1000, description="Farmer's question")
    fieldContext: Optional[FieldContext] = None
    language: str = Field(default="English", pattern="^(English|Hindi|Marathi)$")


class VoiceResponse(BaseModel):
    """Voice assistant response"""
    success: bool
    answer: str
    fieldUsed: str
    language: str
    timestamp: float


# ============================================================
# HEALTH CHECK & ROOT
# ============================================================

@app.get("/")
async def root():
    """API root endpoint"""
    return {
        "status": "online",
        "service": "Agriculture AI API",
        "version": "3.0.0",
        "endpoints": {
            "health": "/health",
            "docs": "/docs",
            "drl_recommendation": "/recommend" if DRL_AVAILABLE else "disabled",
            "disease_detection": "/detect-disease" if DISEASE_DETECTION_AVAILABLE else "disabled",
            "voice_assistant": "/voice-assistant/ask" if VOICE_ASSISTANT_AVAILABLE else "disabled",
            "field_analysis": "/voice-assistant/analyze-field" if VOICE_ASSISTANT_AVAILABLE else "disabled"
        },
        "powered_by": "FastAPI + Groq + ONNX"
    }


@app.get("/health")
async def health_check():
    """Check health of all services"""
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "services": {
            "drl_model": DRL_AVAILABLE,
            "disease_detector": DISEASE_DETECTION_AVAILABLE,
            "voice_assistant": VOICE_ASSISTANT_AVAILABLE,
            "groq_llm": VOICE_ASSISTANT_AVAILABLE
        },
        "configuration": {
            "groq_api_configured": bool(GROQ_API_KEY),
            "upload_dir": str(UPLOAD_DIR),
            "cors_enabled": True
        }
    }


# ============================================================
# DRL RECOMMENDATION ENDPOINT
# ============================================================

@app.post("/recommend", tags=["DRL Recommendations"])
async def get_irrigation_recommendation(data: SoilDataInput) -> Dict:
    """
    Get irrigation and fertilizer recommendations using DRL model
    
    Returns:
    - Water amount recommendation
    - Nitrogen fertilizer amount
    - Phosphorus fertilizer amount  
    - Potassium fertilizer amount
    """
    if not DRL_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="DRL recommendation service not available. load_model.py not found."
        )
    
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
        return {
            "success": True,
            "timestamp": time.time(),
            **recommendation
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"DRL model error: {str(e)}"
        )


# ============================================================
# DISEASE DETECTION ENDPOINT
# ============================================================

@app.post("/detect-disease", tags=["Disease Detection"])
async def detect_crop_disease(file: UploadFile = File(...)):
    """
    Upload crop/leaf image and get AI disease detection results
    
    Supports: JPEG, PNG, JPG images
    Max size: 10MB
    
    Returns:
    - Crop type
    - Disease name
    - Confidence score
    - Severity level
    - Treatment recommendations (powered by Groq LLM)
    """
    if not DISEASE_DETECTION_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="Disease detection service not available. disease_detector.py not found."
        )
    
    try:
        # Validate file type
        if not file.content_type.startswith("image/"):
            raise HTTPException(
                status_code=400,
                detail="File must be an image (JPEG, PNG, JPG)"
            )
        
        # Check file size (10MB limit)
        file.file.seek(0, 2)
        file_size = file.file.tell()
        file.file.seek(0)
        
        if file_size > 10 * 1024 * 1024:
            raise HTTPException(
                status_code=400,
                detail="File size must be less than 10MB"
            )
        
        # Save uploaded file
        file_path = UPLOAD_DIR / file.filename
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Run disease detection
        result = detect_disease(str(file_path))
        
        # Clean up uploaded file
        try:
            file_path.unlink()
        except:
            pass
        
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        
        return {
            "success": True,
            "timestamp": time.time(),
            **result
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Disease detection error: {str(e)}"
        )


# ============================================================
# VOICE ASSISTANT ENDPOINTS
# ============================================================

@app.post("/voice-assistant/ask", response_model=VoiceResponse, tags=["Voice Assistant"])
async def process_voice_question(query: VoiceQuery) -> VoiceResponse:
    """
    Process farmer's voice question with field context using Groq LLM
    
    Features:
    - Multi-language support (English, Hindi, Marathi)
    - Context-aware responses using real field data
    - Watering recommendations based on soil moisture
    - Fertilizer suggestions based on NPK levels
    - Crop health analysis
    - Safe farming advice (no dangerous chemicals)
    """
    if not VOICE_ASSISTANT_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="Voice assistant service not available. GROQ_API_KEY not configured."
        )
    
    try:
        # Build system prompt with farming rules
        system_prompt = """You are an intelligent farming assistant for Indian farmers called "Jarvis Farm Assistant".
You provide practical, safe, and actionable farming advice based on real field data.

🌾 CRITICAL RULES:
1. Give SHORT answers (maximum 2-3 sentences)
2. Use SIMPLE words that farmers understand easily
3. Base ALL answers on the provided field data when available
4. Be SPECIFIC using actual numbers from field data

📊 WATERING DECISION RULES:
- If soil moisture < 30%: "URGENT! Water immediately for 3-4 hours"
- If soil moisture 30-40%: "Water today for 2-3 hours"  
- If soil moisture 40-60%: "Soil moisture is adequate, monitor daily"
- If soil moisture > 60%: "No watering needed, soil is moist enough"
- Consider temperature: In hot weather (>35°C), water in evening

🧪 FERTILIZER DECISION RULES:
- If nitrogen < 40: "Apply urea fertilizer (20-25 kg/acre)"
- If nitrogen 40-80: "Nitrogen adequate, monitor weekly"
- If phosphorus < 25: "Apply DAP or SSP fertilizer (15-20 kg/acre)"
- If potassium < 80: "Apply potash fertilizer (10-15 kg/acre)"
- If pH < 5.5: "Soil too acidic, apply lime"
- If pH > 8.0: "Soil too alkaline, apply gypsum"

🌱 HEALTH ASSESSMENT RULES:
- If health score < 60%: "Crop health poor. Inspect for pests/diseases immediately"
- If health score 60-80%: "Crop health moderate. Monitor closely"  
- If health score > 80%: "Crop health excellent. Continue current practices"

⚠️ SAFETY RULES:
- NEVER give specific chemical mixing ratios
- NEVER recommend dangerous pesticide combinations
- Always say "Please consult local agriculture expert" for complex chemical questions
- Focus on organic and safe farming practices when possible

🌍 LANGUAGE RULE:
- Respond ONLY in {language} language
- Use simple farming terms farmers know
- Be encouraging and supportive

Now answer the farmer's question using the field data provided below.
"""

        # Add field context if available
        context_text = ""
        if query.fieldContext:
            fc = query.fieldContext
            context_text = f"""

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 CURRENT FIELD INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌾 BASIC INFO:
   • Field Name: {fc.fieldName}
   • Crop Type: {fc.cropType}
   • Area: {fc.area}
   • Location: {fc.location}

🌱 SOIL DATA:
   • Moisture: {fc.soilMoisture if fc.soilMoisture is not None else 'N/A'}%
   • pH Level: {fc.soilPH if fc.soilPH is not None else 'N/A'}
   • Nitrogen (N): {fc.soilNitrogen if fc.soilNitrogen is not None else 'N/A'} kg/ha
   • Phosphorus (P): {fc.soilPhosphorus if fc.soilPhosphorus is not None else 'N/A'} kg/ha
   • Potassium (K): {fc.soilPotassium if fc.soilPotassium is not None else 'N/A'} kg/ha

🌤️ WEATHER DATA:
   • Temperature: {fc.temperature if fc.temperature is not None else 'N/A'}°C
   • Humidity: {fc.humidity if fc.humidity is not None else 'N/A'}%
   • Recent Rainfall: {fc.rainfall if fc.rainfall is not None else 'N/A'} mm

💧 IRRIGATION STATUS:
   • Last Watered: {fc.lastWatered if fc.lastWatered else 'Unknown'}
   • Watering Schedule: {fc.wateringSchedule if fc.wateringSchedule else 'Not set'}

🏥 CROP HEALTH:
   • Health Score: {fc.healthScore if fc.healthScore is not None else 'N/A'}%
   • Health Status: {fc.healthStatus if fc.healthStatus else 'Unknown'}

🤖 AI RECOMMENDATIONS:
{chr(10).join(f'   • {rec}' for rec in fc.aiRecommendations) if fc.aiRecommendations else '   • None available'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

USE THIS EXACT DATA to give accurate, specific answers.
Mention actual numbers when answering (e.g., "Your soil moisture is 35%...").
"""
        else:
            context_text = "\n⚠️ NOTE: No specific field data available. Give general farming advice.\n"

        # Format complete prompt
        complete_prompt = system_prompt.format(language=query.language) + context_text

        # Call Groq API
        response = groq_client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {
                    "role": "system",
                    "content": complete_prompt
                },
                {
                    "role": "user",
                    "content": f"Farmer's Question: {query.question}\n\nAnswer in {query.language}:"
                }
            ],
            temperature=0.7,
            max_tokens=300,
            top_p=0.9
        )

        answer = response.choices[0].message.content.strip()

        return VoiceResponse(
            success=True,
            answer=answer,
            fieldUsed=query.fieldContext.fieldName if query.fieldContext else "General",
            language=query.language,
            timestamp=time.time()
        )

    except Exception as e:
        print(f"❌ Error processing voice query: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process question: {str(e)}"
        )


@app.post("/voice-assistant/analyze-field", tags=["Voice Assistant"])
async def analyze_field_for_voice(fieldContext: FieldContext) -> Dict:
    """
    Analyze field data and provide proactive insights
    
    Returns:
    - Critical warnings
    - Actionable recommendations
    - Field health insights
    - Overall status assessment
    """
    if not VOICE_ASSISTANT_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="Voice assistant service not available."
        )
    
    try:
        insights = []
        warnings = []
        recommendations = []

        # Soil moisture analysis
        if fieldContext.soilMoisture is not None:
            if fieldContext.soilMoisture < 30:
                warnings.append("🚨 CRITICAL: Soil moisture very low ({}%)".format(fieldContext.soilMoisture))
                recommendations.append("Water immediately for 3-4 hours")
            elif fieldContext.soilMoisture < 40:
                warnings.append("⚠️ WARNING: Soil moisture below optimal ({}%)".format(fieldContext.soilMoisture))
                recommendations.append("Schedule watering within 24 hours")
            elif fieldContext.soilMoisture > 80:
                warnings.append("⚠️ CAUTION: Soil too wet ({}%)".format(fieldContext.soilMoisture))
                recommendations.append("Avoid watering, check drainage")
            else:
                insights.append(f"✓ Soil moisture optimal at {fieldContext.soilMoisture}%")

        # Nutrient analysis
        if fieldContext.soilNitrogen is not None:
            if fieldContext.soilNitrogen < 40:
                warnings.append("⚠️ Low nitrogen levels ({} kg/ha)".format(fieldContext.soilNitrogen))
                recommendations.append("Apply urea or DAP fertilizer (20-25 kg/acre)")
            else:
                insights.append(f"✓ Nitrogen levels adequate at {fieldContext.soilNitrogen} kg/ha")

        if fieldContext.soilPhosphorus is not None:
            if fieldContext.soilPhosphorus < 25:
                warnings.append("⚠️ Phosphorus deficiency ({} kg/ha)".format(fieldContext.soilPhosphorus))
                recommendations.append("Apply SSP or DAP fertilizer (15-20 kg/acre)")

        if fieldContext.soilPotassium is not None:
            if fieldContext.soilPotassium < 80:
                warnings.append("⚠️ Potassium levels low ({} kg/ha)".format(fieldContext.soilPotassium))
                recommendations.append("Apply potash fertilizer (10-15 kg/acre)")

        # pH analysis
        if fieldContext.soilPH is not None:
            if fieldContext.soilPH < 5.5:
                warnings.append("⚠️ Soil is too acidic (pH {})".format(fieldContext.soilPH))
                recommendations.append("Apply lime to increase pH")
            elif fieldContext.soilPH > 8.0:
                warnings.append("⚠️ Soil is too alkaline (pH {})".format(fieldContext.soilPH))
                recommendations.append("Apply gypsum to reduce pH")
            else:
                insights.append(f"✓ Soil pH is optimal at {fieldContext.soilPH}")

        # Health analysis
        if fieldContext.healthScore is not None:
            if fieldContext.healthScore < 60:
                warnings.append("🚨 CRITICAL: Crop health score is low ({}%)".format(fieldContext.healthScore))
                recommendations.append("Inspect field for pests and diseases immediately")
            elif fieldContext.healthScore < 80:
                insights.append("⚠️ Crop health is moderate ({}%), monitor closely".format(fieldContext.healthScore))
            else:
                insights.append(f"✓ Crop health excellent at {fieldContext.healthScore}%")

        # Temperature warning
        if fieldContext.temperature is not None:
            if fieldContext.temperature > 35:
                warnings.append("⚠️ High temperature ({}°C)".format(fieldContext.temperature))
                recommendations.append("Water in evening to prevent heat stress")

        return {
            "success": True,
            "timestamp": time.time(),
            "fieldName": fieldContext.fieldName,
            "cropType": fieldContext.cropType,
            "insights": insights,
            "warnings": warnings,
            "recommendations": recommendations,
            "overallStatus": "critical" if any("CRITICAL" in w for w in warnings) else "needs_attention" if warnings else "good",
            "urgentActionRequired": any("CRITICAL" in w for w in warnings)
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis error: {str(e)}"
        )


# ============================================================
# MAIN ENTRY POINT
# ============================================================

if __name__ == "__main__":
    print("=" * 70)
    print("🚀 AGRICULTURE AI API SERVER")
    print("=" * 70)
    print("📍 Server: http://localhost:8000")
    print("📖 API Docs: http://localhost:8000/docs")
    print("📊 ReDoc: http://localhost:8000/redoc")
    print()
    print("🔬 Available Services:")
    
    if DRL_AVAILABLE:
        print("  ✓ DRL Recommendations: POST /recommend")
    else:
        print("  ✗ DRL Recommendations: DISABLED (load_model.py not found)")
    
    if DISEASE_DETECTION_AVAILABLE:
        print("  ✓ Disease Detection: POST /detect-disease")
    else:
        print("  ✗ Disease Detection: DISABLED (disease_detector.py not found)")
    
    if VOICE_ASSISTANT_AVAILABLE:
        print("  ✓ Voice Assistant: POST /voice-assistant/ask")
        print("  ✓ Field Analysis: POST /voice-assistant/analyze-field")
    else:
        print("  ✗ Voice Assistant: DISABLED (GROQ_API_KEY not found)")
    
    print()
    print("🌾 Voice Assistant Features:")
    if VOICE_ASSISTANT_AVAILABLE:
        print("  • Multi-language support (English, Hindi, Marathi)")
        print("  • Context-aware field recommendations")
        print("  • Watering decisions based on soil data")
        print("  • Fertilizer recommendations (NPK)")
        print("  • Crop health analysis")
        print("  • Safe farming advice only")
    
    print("=" * 70)
    print()
    
    # Environment checks
    if not GROQ_API_KEY:
        print("⚠️  WARNING: GROQ_API_KEY not found in environment!")
        print("   Voice assistant will not work without it.")
        print("   Add GROQ_API_KEY to your .env file")
        print()
    
    if not DRL_AVAILABLE:
        print("⚠️  WARNING: load_model.py not found!")
        print("   DRL recommendations will not work.")
        print()
    
    if not DISEASE_DETECTION_AVAILABLE:
        print("⚠️  WARNING: disease_detector.py not found!")
        print("   Disease detection will not work.")
        print()
    
    print("🚀 Starting server...")
    print()
    
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
