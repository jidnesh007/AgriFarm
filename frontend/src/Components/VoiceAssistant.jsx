// src/components/VoiceAssistant.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Brain,
  Loader,
  Sparkles,
  X,
  Maximize2,
  Minimize2,
  AlertCircle,
} from "lucide-react";
import axios from "axios";

const VoiceAssistant = ({ selectedField, fields, onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [language, setLanguage] = useState("en-IN"); // Default to Indian English
  const [isExpanded, setIsExpanded] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [fieldContext, setFieldContext] = useState(null);

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  // Language options
  const languages = [
    { code: "en-IN", name: "English", display: "🇮🇳 English" },
    { code: "hi-IN", name: "Hindi", display: "🇮🇳 हिंदी" },
    { code: "mr-IN", name: "Marathi", display: "🇮🇳 मराठी" },
  ];

  // Initialize Speech Recognition
  useEffect(() => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      setError(
        "Speech recognition not supported in this browser. Please use Chrome."
      );
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = language;

    recognitionRef.current.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      setIsListening(false);
      processVoiceInput(text);
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setError(`Recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [language]);

  // Fetch field context when selectedField changes
  useEffect(() => {
    if (selectedField?._id) {
      fetchFieldContext(selectedField._id);
    }
  }, [selectedField]);

  const fetchFieldContext = async (fieldId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/voice-assistant/field-context/${fieldId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFieldContext(res.data.context);
    } catch (error) {
      console.error("Error fetching field context:", error);
    }
  };

  const startListening = () => {
    if (!recognitionRef.current) return;

    setError("");
    setTranscript("");
    setResponse("");
    setIsListening(true);

    try {
      recognitionRef.current.lang = language;
      recognitionRef.current.start();
    } catch (error) {
      console.error("Error starting recognition:", error);
      setError("Could not start listening");
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const processVoiceInput = async (text) => {
    setIsProcessing(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      // Send question with field context to backend
      const res = await axios.post(
        "http://localhost:5000/api/voice-assistant/ask",
        {
          question: text,
          fieldContext: fieldContext,
          language:
            languages.find((l) => l.code === language)?.name || "English",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const answer = res.data.answer;
      setResponse(answer);

      // Add to conversation history
      setConversationHistory((prev) => [
        ...prev,
        { type: "user", text, timestamp: new Date() },
        { type: "assistant", text: answer, timestamp: new Date() },
      ]);

      // Speak the response
      speakResponse(answer);
    } catch (error) {
      console.error("Error processing voice input:", error);
      setError("Failed to process your question. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const speakResponse = (text) => {
    if (!synthRef.current) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Try to find a voice matching the language
    const voices = synthRef.current.getVoices();
    const matchingVoice = voices.find((voice) =>
      voice.lang.startsWith(language.split("-")[0])
    );
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div
      className={`fixed ${isExpanded ? "inset-4" : "bottom-4 right-4 w-96"} 
      bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 
      rounded-3xl shadow-2xl border-2 border-purple-200 
      transition-all duration-300 z-50 flex flex-col`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 rounded-t-3xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-xl">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">
              Farm Voice Assistant
            </h3>
            <p className="text-white/80 text-xs">
              {selectedField
                ? `Field: ${selectedField.fieldName}`
                : "Ask me anything"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all"
          >
            {isExpanded ? (
              <Minimize2 className="w-5 h-5 text-white" />
            ) : (
              <Maximize2 className="w-5 h-5 text-white" />
            )}
          </button>
          <button
            onClick={onClose}
            className="p-2 bg-red-500/50 hover:bg-red-500 rounded-xl transition-all"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Language Selector */}
      <div className="p-4 border-b border-purple-200 bg-white/50">
        <label className="text-sm font-semibold text-gray-700 mb-2 block">
          Select Language:
        </label>
        <div className="flex gap-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                language === lang.code
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {lang.display}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Field Info Card */}
        {selectedField && fieldContext && (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 border border-blue-200">
            <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Field Data Available
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Crop:</span>
                <span className="font-semibold ml-2">
                  {fieldContext.cropType}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Soil Moisture:</span>
                <span className="font-semibold ml-2">
                  {fieldContext.soilMoisture}%
                </span>
              </div>
              <div>
                <span className="text-gray-600">Temperature:</span>
                <span className="font-semibold ml-2">
                  {fieldContext.temperature}°C
                </span>
              </div>
              <div>
                <span className="text-gray-600">Health:</span>
                <span className="font-semibold ml-2">
                  {fieldContext.healthScore}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Conversation History */}
        <div className="space-y-3">
          {conversationHistory.map((msg, index) => (
            <div
              key={index}
              className={`p-4 rounded-2xl ${
                msg.type === "user"
                  ? "bg-blue-100 border-l-4 border-blue-500 ml-8"
                  : "bg-green-100 border-l-4 border-green-500 mr-8"
              }`}
            >
              <p className="text-sm font-semibold text-gray-700 mb-1">
                {msg.type === "user" ? "👨‍🌾 You" : "🤖 Assistant"}
              </p>
              <p className="text-gray-800">{msg.text}</p>
              <p className="text-xs text-gray-500 mt-1">
                {msg.timestamp.toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>

        {/* Current Transcript */}
        {transcript && (
          <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded-2xl ml-8">
            <p className="text-sm font-semibold text-blue-700 mb-1">
              👨‍🌾 You said:
            </p>
            <p className="text-gray-800">{transcript}</p>
          </div>
        )}

        {/* Current Response */}
        {response && (
          <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded-2xl mr-8">
            <p className="text-sm font-semibold text-green-700 mb-1">
              🤖 Assistant:
            </p>
            <p className="text-gray-800">{response}</p>
          </div>
        )}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex items-center justify-center gap-3 p-6">
            <Loader className="w-6 h-6 text-purple-600 animate-spin" />
            <span className="text-purple-600 font-medium">
              Processing your question...
            </span>
          </div>
        )}
      </div>

      {/* Control Panel */}
      <div className="p-4 bg-white/70 backdrop-blur-xl rounded-b-3xl border-t border-purple-200">
        <div className="flex items-center justify-center gap-4">
          {/* Microphone Button */}
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={isProcessing || isSpeaking}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all transform hover:scale-110 shadow-lg ${
              isListening
                ? "bg-red-500 hover:bg-red-600 animate-pulse"
                : isProcessing || isSpeaking
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            }`}
          >
            {isListening ? (
              <MicOff className="w-8 h-8 text-white" />
            ) : (
              <Mic className="w-8 h-8 text-white" />
            )}
          </button>

          {/* Speaker Control */}
          <button
            onClick={isSpeaking ? stopSpeaking : null}
            disabled={!isSpeaking}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isSpeaking
                ? "bg-green-500 hover:bg-green-600 animate-pulse"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {isSpeaking ? (
              <VolumeX className="w-6 h-6 text-white" />
            ) : (
              <Volume2 className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        <div className="mt-3 text-center">
          <p className="text-sm text-gray-600 font-medium">
            {isListening
              ? "🎤 Listening... Speak now"
              : isProcessing
              ? "🧠 Thinking..."
              : isSpeaking
              ? "🔊 Speaking..."
              : "🎤 Click mic to ask about your field"}
          </p>
        </div>

        {/* Example Questions */}
        {!isListening && !isProcessing && conversationHistory.length === 0 && (
          <div className="mt-4 bg-purple-50 rounded-xl p-3">
            <p className="text-xs font-semibold text-purple-700 mb-2">
              Try asking:
            </p>
            <ul className="text-xs text-purple-600 space-y-1">
              <li>• "Should I water my field today?"</li>
              <li>• "What's the soil moisture level?"</li>
              <li>• "Is my crop healthy?"</li>
              <li>• "When should I fertilize?"</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceAssistant;
