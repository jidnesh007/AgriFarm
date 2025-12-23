"""
voice.py - Standalone Jarvis Voice Assistant for Farmers
Integrates with FastAPI backend for field data and AI responses
"""

import sounddevice as sd
import numpy as np
import whisper
from scipy.io.wavfile import write
import requests
from elevenlabs import ElevenLabs, Voice, VoiceSettings
from langdetect import detect, LangDetectException
import time
import os
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

# ============================================================
# CONFIGURATION
# ============================================================

class Config:
    # API Configuration
    BACKEND_URL = "http://localhost:5000"  # Your Node.js backend
    FASTAPI_URL = "http://localhost:8000"  # Your Python FastAPI
    
    # API Keys
    ELEVENLABS_API_KEY =" "
    AUTH_TOKEN = None  # Will be set after login
    
    # Audio Settings
    SAMPLE_RATE = 16000
    DURATION = 5  # seconds to record
    WHISPER_MODEL = "base"  # tiny, base, small, medium, large
    
    # Language Configuration
    LANGUAGE_CODES = {
        "mr": "Marathi",
        "hi": "Hindi",
        "en": "English"
    }
    
    # ElevenLabs Voice IDs
    ELEVENLABS_VOICES = {
        "mr": "pNInz6obpgDQGcFmaJgB",  # Marathi/Hindi voice
        "hi": "pNInz6obpgDQGcFmaJgB",  # Hindi voice
        "en": "21m00Tcm4TlvDq8ikWAM"   # English voice (Rachel)
    }


# ============================================================
# COLOR CODES FOR TERMINAL
# ============================================================

class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    END = '\033[0m'
    BOLD = '\033[1m'


# ============================================================
# GLOBAL VARIABLES
# ============================================================

whisper_model = None
elevenlabs_client = None
current_field = None
all_fields = []


# ============================================================
# INITIALIZATION
# ============================================================

def initialize():
    """Initialize Whisper model and ElevenLabs client"""
    global whisper_model, elevenlabs_client
    
    print(f"{Colors.CYAN}🔄 Loading Whisper model...{Colors.END}")
    whisper_model = whisper.load_model(Config.WHISPER_MODEL)
    print(f"{Colors.GREEN}✓ Whisper model loaded!{Colors.END}")
    
    if Config.ELEVENLABS_API_KEY:
        print(f"{Colors.CYAN}🔄 Initializing ElevenLabs TTS...{Colors.END}")
        elevenlabs_client = ElevenLabs(api_key=Config.ELEVENLABS_API_KEY)
        print(f"{Colors.GREEN}✓ ElevenLabs TTS ready!{Colors.END}")
    else:
        print(f"{Colors.YELLOW}⚠ ElevenLabs API key not found. TTS disabled.{Colors.END}")


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
    print(f"{Colors.YELLOW}🎤 Listening... Speak now!{Colors.END}")
    
    try:
        # Record audio
        audio_data = sd.rec(
            int(Config.DURATION * Config.SAMPLE_RATE),
            samplerate=Config.SAMPLE_RATE,
            channels=1,
            dtype=np.int16
        )
        sd.wait()
        
        print(f"{Colors.CYAN}🔄 Processing your speech...{Colors.END}")
        
        # Save temporary audio file
        temp_file = "temp_audio.wav"
        write(temp_file, Config.SAMPLE_RATE, audio_data)
        
        # Transcribe with Whisper
        result = whisper_model.transcribe(
            temp_file,
            language=None,  # Auto-detect
            fp16=False
        )
        
        text = result["text"].strip()
        detected_lang = result.get("language", "en")
        
        # Clean up
        if os.path.exists(temp_file):
            os.remove(temp_file)
        
        # Map language codes
        lang_code = detected_lang[:2] if detected_lang in ["mr", "hi", "en", "mar", "hin", "eng"] else "en"
        if lang_code not in ["mr", "hi", "en"]:
            lang_code = "en"
        
        return text, lang_code
        
    except Exception as e:
        print(f"{Colors.RED}❌ Error recording audio: {e}{Colors.END}")
        return "", "en"


# ============================================================
# AI PROCESSING (GROQ LLM via FastAPI)
# ============================================================

def think_with_ai(user_text, language_code):
    """Send question to FastAPI backend for AI processing"""
    print(f"{Colors.CYAN}🧠 Thinking with AI...{Colors.END}")
    
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
            return data.get("answer", "Sorry, I couldn't process that.")
        else:
            print(f"{Colors.RED}❌ API Error: {response.status_code}{Colors.END}")
            return "Sorry, I couldn't process that. Please try again."
            
    except Exception as e:
        print(f"{Colors.RED}❌ Error with AI API: {e}{Colors.END}")
        return "Sorry, I couldn't connect to the AI service."


# ============================================================
# VOICE OUTPUT (TEXT TO SPEECH)
# ============================================================

def speak_with_elevenlabs(text, language_code):
    """Convert text to speech using ElevenLabs and play it"""
    if not elevenlabs_client:
        print(f"{Colors.YELLOW}⚠ TTS not available{Colors.END}")
        return
    
    print(f"{Colors.CYAN}🔊 Generating voice response...{Colors.END}")
    
    try:
        voice_id = Config.ELEVENLABS_VOICES.get(language_code, Config.ELEVENLABS_VOICES["en"])
        
        audio = elevenlabs_client.generate(
            text=text,
            voice=Voice(
                voice_id=voice_id,
                settings=VoiceSettings(
                    stability=0.7,
                    similarity_boost=0.8,
                    style=0.5,
                    use_speaker_boost=True
                )
            ),
            model="eleven_multilingual_v2"
        )
        
        temp_audio = "response_audio.mp3"
        
        with open(temp_audio, "wb") as f:
            for chunk in audio:
                f.write(chunk)
        
        print(f"{Colors.GREEN}🔊 Playing response...{Colors.END}\n")
        
        # Play audio
        if os.name == 'posix':  # macOS/Linux
            os.system(f"afplay {temp_audio}")
        elif os.name == 'nt':  # Windows
            os.system(f"start {temp_audio}")
        
        time.sleep(1)
        if os.path.exists(temp_audio):
            os.remove(temp_audio)
            
    except Exception as e:
        print(f"{Colors.RED}❌ Error with TTS: {e}{Colors.END}")


# ============================================================
# DISPLAY
# ============================================================

def print_conversation(user_text, assistant_text, language):
    """Display conversation in formatted way"""
    lang_name = Config.LANGUAGE_CODES.get(language, "English")
    field_name = current_field.get("fieldName") if current_field else "General"
    
    print(f"\n{Colors.BOLD}{'='*70}{Colors.END}")
    print(f"{Colors.CYAN}📍 Context: {field_name}{Colors.END}")
    print(f"{Colors.BOLD}{'-'*70}{Colors.END}")
    print(f"{Colors.BLUE}👨‍🌾 FARMER ({lang_name}):{Colors.END}")
    print(f"{Colors.BOLD}{user_text}{Colors.END}")
    print(f"\n{Colors.GREEN}🤖 ASSISTANT ({lang_name}):{Colors.END}")
    print(f"{Colors.BOLD}{assistant_text}{Colors.END}")
    print(f"{Colors.BOLD}{'='*70}{Colors.END}\n")


# ============================================================
# MAIN LOOP
# ============================================================

def main_loop():
    """Main continuous loop for voice assistant"""
    print(f"{Colors.HEADER}{Colors.BOLD}")
    print("╔════════════════════════════════════════════════════════════════╗")
    print("║          🌾 JARVIS FARMING VOICE ASSISTANT 🌾                 ║")
    print("║          Supporting: Marathi | Hindi | English                ║")
    print("║          Integrated with Your Farm Dashboard                  ║")
    print("╚════════════════════════════════════════════════════════════════╝")
    print(f"{Colors.END}\n")
    
    # Step 1: Login
    if not login():
        print(f"{Colors.RED}Cannot proceed without login. Exiting...{Colors.END}")
        return
    
    # Step 2: Initialize
    initialize()
    
    # Step 3: Select field
    select_field()
    
    print(f"{Colors.GREEN}✓ Assistant is ready!{Colors.END}")
    print(f"{Colors.YELLOW}Commands:{Colors.END}")
    print(f"  - Press Enter to start listening")
    print(f"  - Type 'switch' to change field")
    print(f"  - Type 'exit' to quit")
    print(f"{Colors.YELLOW}Press Ctrl+C to stop anytime{Colors.END}\n")
    
    try:
        while True:
            print(f"{Colors.CYAN}{'─'*70}{Colors.END}")
            
            # Wait for user command
            command = input(f"{Colors.YELLOW}Press Enter to speak (or type command): {Colors.END}").strip().lower()
            
            if command == "exit":
                break
            elif command == "switch":
                select_field()
                continue
            
            # Step 1: Listen to farmer
            user_text, detected_language = listen()
            
            if not user_text:
                print(f"{Colors.RED}⚠ No speech detected. Please try again.{Colors.END}\n")
                continue
            
            # Step 2: Get AI response
            assistant_text = think_with_ai(user_text, detected_language)
            
            # Step 3: Display conversation
            print_conversation(user_text, assistant_text, detected_language)
            
            # Step 4: Speak response
            speak_with_elevenlabs(assistant_text, detected_language)
            
            time.sleep(1)
            
    except KeyboardInterrupt:
        print(f"\n\n{Colors.YELLOW}👋 Assistant stopped. Thank you for using Jarvis Farming Assistant!{Colors.END}")
    except Exception as e:
        print(f"\n{Colors.RED}❌ Unexpected error: {e}{Colors.END}")


# ============================================================
# ENTRY POINT
# ============================================================

if __name__ == "__main__":
    # Check if required services are running
    print(f"{Colors.CYAN}🔍 Checking services...{Colors.END}")
    
    try:
        # Check Node.js backend
        requests.get(f"{Config.BACKEND_URL}/api/health", timeout=5)
        print(f"{Colors.GREEN}✓ Node.js backend is running{Colors.END}")
    except:
        print(f"{Colors.RED}❌ Node.js backend not reachable at {Config.BACKEND_URL}{Colors.END}")
        print(f"{Colors.YELLOW}   Please start your Node.js server first{Colors.END}")
        exit(1)
    
    try:
        # Check FastAPI
        requests.get(f"{Config.FASTAPI_URL}/health", timeout=5)
        print(f"{Colors.GREEN}✓ Python FastAPI is running{Colors.END}")
    except:
        print(f"{Colors.RED}❌ Python FastAPI not reachable at {Config.FASTAPI_URL}{Colors.END}")
        print(f"{Colors.YELLOW}   Please start your FastAPI server (python app.py){Colors.END}")
        exit(1)
    
    print()
    
    # Start main loop
    main_loop()
