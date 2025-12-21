// src/components/VoiceAssistant.jsx - 100% FIXED (No TDZ Error)
import React, { useState, useEffect, useRef, useCallback } from "react";
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
  Droplets,
  Thermometer,
  Activity,
  RefreshCw,
} from "lucide-react";
import axios from "axios";

const VoiceAssistant = ({ selectedField, fields, onClose }) => {
  // 👈 ALL STATE HOOKS FIRST
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [language, setLanguage] = useState("en-IN");
  const [isExpanded, setIsExpanded] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [fieldContext, setFieldContext] = useState(null);
  const [isLoadingContext, setIsLoadingContext] = useState(false);
  const [contextLoadError, setContextLoadError] = useState(false);

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  // Language options
  const languages = [
    { code: "en-IN", name: "English", display: "🇮🇳 English" },
    { code: "hi-IN", name: "Hindi", display: "🇮🇳 हिंदी" },
    { code: "mr-IN", name: "Marathi", display: "🇮🇳 मराठी" },
  ];

  // 👈 ALL FUNCTIONS with useCallback (BEFORE useEffect)
  const fetchFieldContext = useCallback(async (fieldId, retries = 2) => {
    setIsLoadingContext(true);
    setContextLoadError(false);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/voice-assistant/field-context/${fieldId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        }
      );

      if (res.data.success) {
        setFieldContext(res.data.context);
        console.log("✅ Field context loaded:", res.data.context);
        return res.data.context;
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("❌ Error fetching field context:", error);

      if (retries > 0) {
        console.log(
          `🔄 Retrying field context fetch... (${retries} retries left)`
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return fetchFieldContext(fieldId, retries - 1);
      } else {
        setContextLoadError(true);
        return null;
      }
    } finally {
      setIsLoadingContext(false);
    }
  }, []);

  // ✅ FIXED: processVoiceInput declared BEFORE useEffect
  const processVoiceInput = useCallback(
    async (text) => {
      setIsProcessing(true);
      setError("");

      try {
        const token = localStorage.getItem("token");

        let contextToSend = fieldContext;
        if (!contextToSend && selectedField?._id) {
          console.log("🔄 Fetching field context on-demand...");
          contextToSend = await fetchFieldContext(selectedField._id, 1);
        }

        console.log("🎤 VoiceAssistant sending to backend:", {
          question: text,
          hasContext: !!contextToSend,
          fieldName: contextToSend?.fieldName,
          language:
            languages.find((l) => l.code === language)?.name || "English",
        });

        const res = await axios.post(
          "http://localhost:5000/api/voice-assistant/ask",
          {
            question: text,
            fieldContext: contextToSend || null,
            language:
              languages.find((l) => l.code === language)?.name || "English",
          },
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 30000,
          }
        );

        if (res.data.success !== false) {
          const answer = res.data.answer || res.data;
          setResponse(answer);

          setConversationHistory((prev) => [
            ...prev.slice(-9),
            { type: "user", text, timestamp: new Date() },
            { type: "assistant", text: answer, timestamp: new Date() },
          ]);

          speakResponse(answer);
        } else {
          setError("Failed to get response from AI");
        }
      } catch (error) {
        console.error("❌ Error processing voice input:", error);
        const errorMsg =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to process your question. Please try again.";
        setError(errorMsg);
      } finally {
        setIsProcessing(false);
      }
    },
    [fieldContext, selectedField, language, fetchFieldContext]
  );

  const speakResponse = useCallback(
    (text) => {
      if (!synthRef.current) return;

      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

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
    },
    [language]
  );

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      setError("Speech recognition not available");
      return;
    }

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
  }, [language]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const retryFetchContext = useCallback(() => {
    if (selectedField?._id) {
      fetchFieldContext(selectedField._id);
    }
  }, [selectedField, fetchFieldContext]);

  // 👈 useEffect AFTER all functions (NO processVoiceInput dependency)
  useEffect(() => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      setError("Speech recognition not supported. Please use Chrome.");
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
      processVoiceInput(text); // ✅ SAFE - function exists
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
  }, [language]); // ✅ ONLY language dependency

  // Auto-fetch field context
  useEffect(() => {
    if (selectedField?._id) {
      fetchFieldContext(selectedField._id);
    } else {
      setFieldContext(null);
      setContextLoadError(false);
    }
  }, [selectedField, fetchFieldContext]);

  const canListen =
    !isProcessing &&
    !isSpeaking &&
    (!selectedField || fieldContext !== null || !contextLoadError);

  return (
    <div
      className={`fixed ${isExpanded ? "inset-4" : "bottom-4 right-4 w-96"} 
      bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 
      rounded-3xl shadow-2xl border-2 border-purple-200 
      transition-all duration-300 z-50 flex flex-col max-h-[90vh]`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 rounded-t-3xl p-4 flex items-center justify-between flex-shrink-0">
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
      <div className="p-4 border-b border-purple-200 bg-white/50 flex-shrink-0">
        <label className="text-sm font-semibold text-gray-700 mb-2 block">
          Select Language:
        </label>
        <div className="flex gap-2 flex-wrap">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`px-3 py-2 rounded-xl font-medium transition-all text-xs ${
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
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {/* Field Info Card */}
        {selectedField && (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 border border-blue-200">
            {isLoadingContext ? (
              <div className="flex items-center justify-center gap-2 py-4">
                <Loader className="w-5 h-5 text-blue-600 animate-spin" />
                <span className="text-sm text-gray-600">
                  Loading field data...
                </span>
              </div>
            ) : fieldContext ? (
              <>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-gray-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    Field Data Ready ✅
                  </h4>
                  <button
                    onClick={retryFetchContext}
                    className="p-1 hover:bg-blue-100 rounded-lg transition-all"
                    title="Refresh data"
                  >
                    <RefreshCw className="w-4 h-4 text-blue-600" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                    <Activity className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <div>
                      <span className="text-gray-600 text-xs block">Crop</span>
                      <p className="font-semibold text-gray-800">
                        {fieldContext.cropType}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                    <Droplets className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <div>
                      <span className="text-gray-600 text-xs block">
                        Moisture
                      </span>
                      <p className="font-semibold text-gray-800">
                        {fieldContext.soilMoisture ?? "N/A"}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                    <Thermometer className="w-4 h-4 text-orange-600 flex-shrink-0" />
                    <div>
                      <span className="text-gray-600 text-xs block">
                        Temperature
                      </span>
                      <p className="font-semibold text-gray-800">
                        {fieldContext.temperature ?? "N/A"}°C
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded-lg">
                    <Activity className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <div>
                      <span className="text-gray-600 text-xs block">
                        Health
                      </span>
                      <p className="font-semibold text-gray-800">
                        {fieldContext.healthScore ?? "N/A"}%
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <AlertCircle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-3">
                  Could not load field data
                </p>
                <button
                  onClick={retryFetchContext}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 mx-auto"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try again
                </button>
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl animate-pulse">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Conversation History */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {conversationHistory.map((msg, index) => (
            <div
              key={index}
              className={`p-4 rounded-2xl shadow-sm ${
                msg.type === "user"
                  ? "bg-blue-100 border-l-4 border-blue-500 ml-4 md:ml-8"
                  : "bg-green-100 border-l-4 border-green-500 mr-4 md:mr-8"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`w-2 h-2 rounded-full ${
                    msg.type === "user" ? "bg-blue-500" : "bg-green-500"
                  }`}
                ></span>
                <p className="text-xs font-semibold text-gray-700">
                  {msg.type === "user" ? "👨‍🌾 You" : "🤖 Assistant"}
                </p>
              </div>
              <p className="text-gray-800 text-sm leading-relaxed">
                {msg.text}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {msg.timestamp.toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>

        {/* Current Transcript */}
        {transcript && !response && (
          <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded-2xl ml-4 md:ml-8 animate-pulse">
            <p className="text-sm font-semibold text-blue-700 mb-1">
              👨‍🌾 You said:
            </p>
            <p className="text-gray-800 text-sm">{transcript}</p>
          </div>
        )}

        {/* Current Response */}
        {response && (
          <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded-2xl mr-4 md:mr-8 animate-fade-in">
            <p className="text-sm font-semibold text-green-700 mb-1">
              🤖 Assistant:
            </p>
            <p className="text-gray-800 text-sm leading-relaxed">{response}</p>
          </div>
        )}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex flex-col items-center justify-center gap-3 p-8">
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
              <Loader className="w-6 h-6 text-purple-600 animate-spin" />
            </div>
            <span className="text-purple-600 font-medium text-sm">
              Processing your question...
            </span>
            <p className="text-xs text-gray-500">
              {fieldContext ? "Using field data..." : "General advice..."}
            </p>
          </div>
        )}

        {/* Example Questions */}
        {!isListening &&
          !isProcessing &&
          conversationHistory.length === 0 &&
          !error && (
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
              <p className="text-sm font-semibold text-purple-700 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Try asking:
              </p>
              <div className="grid grid-cols-1 gap-2 text-sm text-purple-600">
                <div>• "Should I water my field today?"</div>
                <div>• "What's the soil moisture level?"</div>
                <div>• "Is my crop healthy?"</div>
                <div>• "When should I fertilize?"</div>
                <div>• "What's the weather like?"</div>
              </div>
            </div>
          )}
      </div>

      {/* Control Panel */}
      <div className="p-4 bg-white/70 backdrop-blur-xl rounded-b-3xl border-t border-purple-200 flex-shrink-0">
        <div className="flex items-center justify-center gap-4 mb-3">
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={!canListen}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all transform hover:scale-110 shadow-xl group ${
              isListening
                ? "bg-red-500 hover:bg-red-600 animate-pulse shadow-red-500/50"
                : isProcessing || isSpeaking
                ? "bg-gray-400 cursor-not-allowed shadow-gray-300"
                : !selectedField || !fieldContext
                ? "bg-orange-400 hover:bg-orange-500 cursor-wait shadow-orange-300"
                : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-purple-500/50"
            }`}
            title={!canListen ? "Loading field data..." : "Click to speak"}
          >
            {isListening ? (
              <MicOff className="w-8 h-8 text-white" />
            ) : (
              <Mic className="w-8 h-8 text-white" />
            )}
          </button>

          <button
            onClick={isSpeaking ? stopSpeaking : null}
            disabled={!isSpeaking}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isSpeaking
                ? "bg-green-500 hover:bg-green-600 animate-pulse shadow-green-500/50"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {isSpeaking ? (
              <VolumeX className="w-6 h-6 text-white" />
            ) : (
              <Volume2 className="w-6 h-6 text-gray-500" />
            )}
          </button>
        </div>

        <div className="text-center space-y-1">
          <p className="text-sm text-gray-700 font-medium">
            {isListening
              ? "🎤 Listening... Speak now!"
              : isProcessing
              ? "🧠 Thinking..."
              : isSpeaking
              ? "🔊 Speaking..."
              : selectedField && !fieldContext && !isLoadingContext
              ? "⏳ Loading field data..."
              : "🎤 Ready to answer field questions"}
          </p>
          <p
            className={`text-xs ${
              fieldContext ? "text-emerald-600 font-medium" : "text-gray-500"
            }`}
          >
            {fieldContext ? "✅ Field data loaded" : "No field selected"}
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default VoiceAssistant;
