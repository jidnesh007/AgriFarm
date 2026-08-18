"""
voice.py - Standalone Jarvis Voice Assistant for Farmers
Integrates with FastAPI backend for field data and AI responses
Uses gTTS for text-to-speech (Hindi/Marathi/English support)
"""

import sounddevice as sd
import numpy as np
import whisper
from scipy.io.wavfile import write
import requests
import time
import os
from dotenv import load_dotenv
from gtts import gTTS
import playsound

# Load environment variables (if you still use any)
load_dotenv()

# ============================================================
# CONFIGURATION
# ============================================================

class Config:
    # API Configuration
    BACKEND_URL = "http://localhost:5000"  # Your Node.js backend
    FASTAPI_URL = "http://localhost:8000"  # Your Python FastAPI
    
    # API Keys
    ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
    AUTH_TOKEN = None  # Will be set after login
    
    # Audio Settings
    SAMPLE_RATE = 16000
    DURATION = 5           # seconds to record
    WHISPER_MODEL = "base" # tiny, base, small, medium, large
    
    # Language Configuration
    LANGUAGE_CODES = {
        "mr": "Marathi",
        "hi": "Hindi",
        "en": "English"
    }


# ============================================================
# COLOR CODES FOR TERMINAL
# ============================================================

class Colors:
    HEADER = '\033[95m'
    BLUE   = '\033[94m'
    CYAN   = '\033[96m'
    GREEN  = '\033[92m'
    YELLOW = '\033[93m'
    RED    = '\033[91m'
    END    = '\033[0m'
    BOLD   = '\033[1m'


# ============================================================
# GLOBAL VARIABLES
# ============================================================

whisper_model = None
current_field = None
all_fields = []


# ============================================================
# INITIALIZATION
# ============================================================

def initialize():
    """Initialize Whisper model"""
    global whisper_model
    
    print(f"{Colors.CYAN}🔄 Loading Whisper model...{Colors.END}")
    whisper_model = whisper.load_model(Config.WHISPER_MODEL)
    print(f"{Colors.GREEN}✓ Whisper model loaded!{Colors.END}")


# ============================================================
# AUTHENTICATION
# ============================================================

def login():
    """Login to get authentication token"""
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"{Colors.BOLD}👤 FARMER LOGIN{Colors.END}")
    print(f"{Colors.BLUE}{'='*60}{Colors.END}\n")
    
    email = input(f"{Colors.CYAN}📧 Email: {Colors.END}")
    password = input(f"{Colors.CYAN}🔐 Password: {Colors.END}")
    
    try:
        response = requests.post(
            f"{Config.BACKEND_URL}/api/auth/login",
            json={"email": email, "password": password},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            Config.AUTH_TOKEN = data.get("token")
            print(f"\n{Colors.GREEN}✓ Login successful!{Colors.END}")
            print(f"{Colors.GREEN}Welcome, {data.get('userName', 'Farmer')}!{Colors.END}\n")
            return True
        else:
            print(f"\n{Colors.RED}❌ Login failed: {response.json().get('message', 'Unknown error')}{Colors.END}\n")
            return False
            
    except Exception as e:
        print(f"\n{Colors.RED}❌ Connection error: {str(e)}{Colors.END}\n")
        return False


# ============================================================
# FIELD DATA FETCHING
# ============================================================

def fetch_fields():
    """Fetch all fields from backend"""
    global all_fields
    
    try:
        headers = {"Authorization": f"Bearer {Config.AUTH_TOKEN}"}
        response = requests.get(
            f"{Config.BACKEND_URL}/api/fields",
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            all_fields = data.get("fields", [])
            return all_fields
        else:
            print(f"{Colors.RED}❌ Failed to fetch fields{Colors.END}")
            return []
            
    except Exception as e:
        print(f"{Colors.RED}❌ Error fetching fields: {str(e)}{Colors.END}")
        return []


def select_field():
    """Let farmer select which field to query about"""
    global current_field
    
    fields = fetch_fields()
    
    if not fields:
        print(f"{Colors.YELLOW}⚠ No fields found. You can still ask general questions.{Colors.END}\n")
        return None
    
    print(f"\n{Colors.BOLD}{Colors.GREEN}{'='*60}{Colors.END}")
    print(f"{Colors.BOLD}🌾 YOUR FIELDS{Colors.END}")
    print(f"{Colors.GREEN}{'='*60}{Colors.END}\n")
    
    for idx, field in enumerate(fields, 1):
        print(f"{Colors.CYAN}{idx}. {field.get('fieldName', 'Unknown')}{Colors.END}")
        print(f"   Crop: {field.get('cropType', 'N/A')}")
        print(f"   Area: {field.get('fieldArea', {}).get('value', 'N/A')} {field.get('fieldArea', {}).get('unit', '')}")
        print(f"   Soil Moisture: {field.get('soilData', {}).get('moisture', 'N/A')}%")
        print(f"   Health Score: {field.get('overallHealth', {}).get('score', 'N/A')}%")
        print()
    
    print(f"{Colors.CYAN}0. General questions (no specific field){Colors.END}\n")
    
    try:
        choice = int(input(f"{Colors.YELLOW}Select field number: {Colors.END}"))
        
        if choice == 0:
            current_field = None
            print(f"{Colors.GREEN}✓ General mode selected{Colors.END}\n")
            return None
        elif 1 <= choice <= len(fields):
            current_field = fields[choice - 1]
            print(f"{Colors.GREEN}✓ Selected: {current_field.get('fieldName')}{Colors.END}\n")
            return current_field
        else:
            print(f"{Colors.RED}❌ Invalid selection{Colors.END}\n")
            return None
            
    except ValueError:
        print(f"{Colors.RED}❌ Invalid input{Colors.END}\n")
        return None


def get_field_context():
    """Build field context for API"""
    if not current_field:
        return None
    
    return {
        "fieldName": current_field.get("fieldName", "Unknown"),
        "cropType": current_field.get("cropType", "Unknown"),
        "area": f"{current_field.get('fieldArea', {}).get('value', 0)} {current_field.get('fieldArea', {}).get('unit', 'acres')}",
        "location": f"{current_field.get('location', {}).get('village', '')}, {current_field.get('location', {}).get('district', '')}",
        "soilMoisture": current_field.get("soilData", {}).get("moisture"),
        "soilPH": current_field.get("soilData", {}).get("ph"),
        "soilNitrogen": current_field.get("soilData", {}).get("nitrogen"),
        "soilPhosphorus": current_field.get("soilData", {}).get("phosphorus"),
        "soilPotassium": current_field.get("soilData", {}).get("potassium"),
        "temperature": current_field.get("weatherData", {}).get("temperature"),
        "humidity": current_field.get("weatherData", {}).get("humidity"),
        "rainfall": current_field.get("weatherData", {}).get("rainfall"),
        "lastWatered": current_field.get("irrigationData", {}).get("lastWatered"),
        "wateringSchedule": current_field.get("irrigationData", {}).get("schedule"),
        "healthScore": current_field.get("overallHealth", {}).get("score"),
        "healthStatus": current_field.get("overallHealth", {}).get("status"),
        "aiRecommendations": current_field.get("recommendations", [])
    }


# ============================================================
# VOICE INPUT (SPEECH TO TEXT)
# ============================================================

def listen():
    """Record audio from microphone and convert to text using Whisper"""
    print(f"{Colors.YELLOW}🎤 Listening... Speak now! ({Config.DURATION} seconds){Colors.END}")
    
    try:
        audio_data = sd.rec(
            int(Config.DURATION * Config.SAMPLE_RATE),
            samplerate=Config.SAMPLE_RATE,
            channels=1,
            dtype=np.int16
        )
        sd.wait()
        
        print(f"{Colors.CYAN}🔄 Processing speech...{Colors.END}")
        
        temp_file = "temp_audio.wav"
        write(temp_file, Config.SAMPLE_RATE, audio_data)
        
        result = whisper_model.transcribe(
            temp_file,
            language=None,  # auto-detect
            fp16=False
        )
        
        text = result["text"].strip()
        detected_lang = result.get("language", "en")
        
        if os.path.exists(temp_file):
            os.remove(temp_file)
        
        # Normalize language code
        lang_code = detected_lang[:2].lower()
        if lang_code in ["mr", "ma", "mar"]:
            lang_code = "mr"
        elif lang_code in ["hi", "hin"]:
            lang_code = "hi"
        else:
            lang_code = "en"
        
        return text, lang_code
        
    except Exception as e:
        print(f"{Colors.RED}❌ Audio error: {e}{Colors.END}")
        return "", "en"


# ============================================================
# AI PROCESSING
# ============================================================

def think_with_ai(user_text, language_code):
    """Send question to FastAPI backend"""
    print(f"{Colors.CYAN}🧠 Thinking...{Colors.END}")
    
    try:
        language_name = Config.LANGUAGE_CODES.get(language_code, "English")
        
        payload = {
            "question": user_text,
            "language": language_name,
            "fieldContext": get_field_context()
        }
        
        response = requests.post(
            f"{Config.FASTAPI_URL}/voice-assistant/ask",
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            return data.get("answer", "क्षमस्व, मी समजू शकलो नाही.")
        else:
            print(f"{Colors.RED}API error: {response.status_code}{Colors.END}")
            return "क्षमस्व, काही त्रुटी आली. पुन्हा प्रयत्न करा."
            
    except Exception as e:
        print(f"{Colors.RED}AI service error: {e}{Colors.END}")
        return "क्षमस्व, AI सेवा जोडली गेली नाही."


# ============================================================
# TEXT TO SPEECH (gTTS)
# ============================================================

def speak(text, lang_code):
    """Speak using Google Text-to-Speech"""
    if not text.strip():
        return
        
    print(f"{Colors.CYAN}🔊 बोलत आहे... ({Config.LANGUAGE_CODES.get(lang_code, 'English')}){Colors.END}")
    
    try:
        # Map language codes to gTTS codes
        tts_lang = {
            "mr": "mr",
            "hi": "hi",
            "en": "en"
        }.get(lang_code, "en")
        
        tts = gTTS(text=text, lang=tts_lang, slow=False)
        
        temp_file = "response.mp3"
        tts.save(temp_file)
        
        playsound.playsound(temp_file)
        
        if os.path.exists(temp_file):
            os.remove(temp_file)
            
    except Exception as e:
        print(f"{Colors.RED}TTS error: {e}{Colors.END}")
        print(f"{Colors.YELLOW}Text only: {text}{Colors.END}")


# ============================================================
# DISPLAY
# ============================================================

def print_conversation(user_text, assistant_text, language):
    lang_name = Config.LANGUAGE_CODES.get(language, "English")
    field_name = current_field.get("fieldName") if current_field else "सामान्य"
    
    print(f"\n{Colors.BOLD}{'═'*70}{Colors.END}")
    print(f"{Colors.CYAN}📍 संदर्भ: {field_name}{Colors.END}")
    print(f"{Colors.BOLD}{'-'*70}{Colors.END}")
    print(f"{Colors.BLUE}👨‍🌾 शेतकरी ({lang_name}):{Colors.END}")
    print(f"  {user_text}")
    print(f"\n{Colors.GREEN}🤖 जार्विस ({lang_name}):{Colors.END}")
    print(f"  {assistant_text}")
    print(f"{Colors.BOLD}{'═'*70}{Colors.END}\n")


# ============================================================
# MAIN LOOP
# ============================================================

def main_loop():
    print(f"{Colors.HEADER}{Colors.BOLD}")
    print("╔═══════════════════════════════════════════════════════════════╗")
    print("║         🌾 JARVIS शेतकरी साथी - व्हॉइस असिस्टंट 🌾           ║")
    print("║        मराठी | हिंदी | English   सपोर्ट                       ║")
    print("╚═══════════════════════════════════════════════════════════════╝")
    print(f"{Colors.END}\n")
    
    if not login():
        print(f"{Colors.RED}लॉगिनशिवाय पुढे जाऊ शकत नाही. बाहेर पडत आहे...{Colors.END}")
        return
    
    initialize()
    select_field()
    
    print(f"{Colors.GREEN}✓ तयार आहे! बोलण्यासाठी Enter दाबा.{Colors.END}")
    print(f"   • Enter दाबा → बोलणे सुरू")
    print(f"   • switch लिहा → शेत बदलणे")
    print(f"   • exit लिहा → बाहेर पडणे")
    print(f"{Colors.YELLOW}Ctrl+C ने कधीही थांबवू शकता{Colors.END}\n")
    
    try:
        while True:
            print(f"{Colors.CYAN}{'─'*70}{Colors.END}")
            
            cmd = input(f"{Colors.YELLOW}Enter दाबा (किंवा कमांड लिहा): {Colors.END}").strip().lower()
            
            if cmd == "exit":
                break
            if cmd == "switch":
                select_field()
                continue
            if cmd:  # ignore any other text input
                continue
            
            user_text, lang_code = listen()
            
            if not user_text.strip():
                print(f"{Colors.RED}⚠ काही ऐकू आले नाही. पुन्हा प्रयत्न करा.{Colors.END}\n")
                continue
            
            assistant_text = think_with_ai(user_text, lang_code)
            
            print_conversation(user_text, assistant_text, lang_code)
            
            speak(assistant_text, lang_code)
            
            time.sleep(0.7)
            
    except KeyboardInterrupt:
        print(f"\n{Colors.YELLOW}👋 धन्यवाद! पुन्हा भेटू या.{Colors.END}")
    except Exception as e:
        print(f"{Colors.RED}अनपेक्षित त्रुटी: {e}{Colors.END}")


# ============================================================
# START
# ============================================================

if __name__ == "__main__":
    print(f"{Colors.CYAN}सेवा तपासत आहे...{Colors.END}")
    
    try:
        requests.get(f"{Config.BACKEND_URL}/api/health", timeout=5)
        print(f"{Colors.GREEN}✓ Node.js सर्व्हर सुरू आहे{Colors.END}")
    except:
        print(f"{Colors.RED}Node.js सर्व्हर चालू नाही: {Config.BACKEND_URL}{Colors.END}")
        exit(1)
    
    try:
        requests.get(f"{Config.FASTAPI_URL}/health", timeout=5)
        print(f"{Colors.GREEN}✓ FastAPI सर्व्हर सुरू आहे{Colors.END}")
    except:
        print(f"{Colors.RED}FastAPI सर्व्हर चालू नाही: {Config.FASTAPI_URL}{Colors.END}")
        exit(1)
    
    print()
    main_loop()