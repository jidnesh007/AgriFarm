# 🌾 SIGRO – AI-Powered Smart Agriculture Assistant

SIGRO is an AI-driven agriculture support system built to help farmers analyze crop health, predict risks, and receive multilingual, voice-enabled recommendations.
It blends a modern dashboard, real-time alerts, and a Jarvis-style voice assistant powered by Groq LLM and Python-based DRL models.

---

## 🚀 Features

### 🔍 AI Crop Analysis

* Detects crop health issues
* Identifies possible nutrient deficiencies
* Predicts stress (water, pest, temperature)

### ⚠️ Risk Prediction Engine

* High / Medium / Low severity alerts
* Weather-linked warnings
* Early advisories to prevent crop loss

### 🧠 AI Recommendation System

* Irrigation planning
* Fertilizer recommendations
* Organic pest management tips
* Crop-specific expert suggestions

### 🎧 Farmer Voice Assistant (Jarvis)

* Voice-based conversations
* Agriculture Q&A using **Groq LLM (Mixtral-8x7B)**
* Human-like TTS via **ElevenLabs**
* Supports multilingual responses

### 🌍 Multilingual Support

* English
* Hindi
* Marathi
* Bengali
  (Extendable for more Indian languages)

### 📊 Interactive Dashboard

* Soft green, agriculture-friendly UI
* Real-time data insights
* Charts, analytics, cards
* Voice buttons for every output

---
## 🖼️ Project Screenshots & Walkthrough

### 1️⃣ Landing Page

<img width="1886" height="908" alt="Screenshot 2025-12-27 185955" src="https://github.com/user-attachments/assets/f69cc6f8-c209-4d38-800d-f269335ef6a4" />

**Description:**  
The main entry point of SIGRO Agri AI, featuring a clean and modern interface where farmers can quickly access real-time weather updates, growth indicators, and precision farming insights.

---

### 2️⃣ Farmer Dashboard
<img width="1906" height="907" alt="Screenshot 2025-12-27 190019" src="https://github.com/user-attachments/assets/51575a33-df87-4dfc-88af-b0d4b892dbfe" />


**Description:**  
A centralized dashboard providing a complete overview of farm performance, including soil moisture levels, system pressure, yield forecasts, and energy usage metrics.

---

### 3️⃣ Fields Management
<img width="1904" height="913" alt="Screenshot 2025-12-27 190040" src="https://github.com/user-attachments/assets/f0dee6ef-fe55-4a99-8d48-0c0136ddcc6a" />


**Description:**  
An organized view for managing multiple agricultural fields, displaying crop types (Corn, Rice, Wheat), geographic location, and individual field health status.

---

### 4️⃣ Smart Advisory & AI Recommendations
<img width="1910" height="907" alt="Screenshot 2025-12-27 190104" src="https://github.com/user-attachments/assets/323fa840-946c-4df0-8e9e-2b19296ec9a2" />


**Description:**  
AI-powered recommendations for irrigation and nutrition, offering precise fertilizer dosages and watering schedules based on live sensor and field data.

---

### 5️⃣ Weather Intelligence

<img width="1907" height="907" alt="Screenshot 2025-12-27 190144" src="https://github.com/user-attachments/assets/b503fe93-4f66-4f31-81c2-314bcf5fa63e" />

**Description:**  
A detailed weather monitoring module showing real-time local conditions such as temperature, precipitation, wind speed, and visibility for accurate farm planning.

---

### 6️⃣ Crop Health Analysis (Visual Input)
<img width="1907" height="912" alt="Screenshot 2025-12-27 190354" src="https://github.com/user-attachments/assets/2d39eb6c-8b3c-4718-95a1-3d3c268eb41e" />


**Description:**  
Computer vision–based disease detection that analyzes crop images, identifies issues like Scab with high confidence, and provides recovery and treatment protocols.

---

### 7️⃣ Analytics Dashboard

<img width="1910" height="917" alt="Screenshot 2025-12-27 190423" src="https://github.com/user-attachments/assets/77c7defe-daaf-4126-8d83-6aaa94017a8b" />

**Description:**  
High-level data visualization displaying total fields, average health scores, and historical trends to help farmers scale and optimize production.

---

### 8️⃣ Sigro Voice Core (Jarvis Assistant)
<img width="1902" height="913" alt="Screenshot 2025-12-27 190625" src="https://github.com/user-attachments/assets/c292b246-5d13-44aa-b2b3-464932a94255" />

<img width="1893" height="910" alt="Screenshot 2025-12-27 190646" src="https://github.com/user-attachments/assets/6f70d5a6-764f-4ef5-a0ee-18e6179381ab" />

**Description:**  
A hands-free, voice-enabled assistant that allows farmers to ask questions about irrigation, crop health, and weather, delivering instant spoken responses.

---

### 9️⃣ Multilingual Support (Marathi UI)

<img width="1902" height="909" alt="Screenshot 2025-12-27 190509" src="https://github.com/user-attachments/assets/a33d3a56-94e2-4f9b-a216-605390376e03" />

**Description:**  
Demonstrates full UI localization, enabling regional farmers to understand soil health, NPK values, and advisories in their native language.

---




## 🛠️ Technologies Used

### **Frontend**

* React.js
* Tailwind CSS
* i18next (multilingual interface)
* Web Speech API (voice output)

### **Backend**

* Node.js
* Express
* REST API architecture
* Language-aware responses

### **AI & Intelligence**

* Groq LLM (Mixtral-8x7B)
* Rule-based crop risk engine
* Custom domain logic
* Python DRL models for smart insights

### **Speech & Voice**

* Whisper / STT
* ElevenLabs TTS
* Multilingual processing
* Langdetect

---

## 🧩 System Architecture

```
Farmer Voice/Text  
        ↓  
Language Detection  
        ↓  
Groq LLM → AI Recommendation  
        ↓                     ↓  
Speech-to-Text        Dashboard Output  
        ↓                     ↓  
     Jarvis           Voice Output (TTS)
```

---

## 🔧 Installation & Setup

### 📥 Clone the Repository

```bash
git clone https://github.com/jidnesh007/sigro.git
cd sigro
```

---

### 🖥️ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

### ⚙️ Backend Setup

```bash
cd backend
npm install
npm start
```

---

### 🧠 Python DRL + Voice Assistant Setup

```bash
cd python-drl
pip install -r requirements.txt
```

Or install manually:

```bash
pip install openai-whisper sounddevice scipy numpy elevenlabs python-dotenv langdetect requests
```

Run the model:

```bash
python main.py
```

---

## 🎤 Jarvis-Style Farmer Assistant

### Supports:

* Voice queries
* Multilingual replies
* Offline/online STT
* Natural TTS (ElevenLabs)

### Example Queries

* **"Why are my cotton leaves turning yellow?"**
* **"माझ्या ऊसाला किती पाणी द्यावे?"**
* **"आज हवामान कसे आहे?"**

### Example Response

> “Leaves turning yellow due to nutrient deficiency. Add potassium-rich fertilizer.”

---

## 📈 Impact & Benefits

* Helps illiterate farmers with voice-first design
* Reduces crop loss through early warnings
* Improves yield and decision-making
* Promotes sustainable agriculture
* Scalable across Indian languages & regions
