// src/components/VoiceAssistant.jsx
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
  CircleDashed,
  Flower2,
} from "lucide-react";
import axios from "axios";

const VoiceAssistant = ({ selectedField, fields, onClose }) => {
  // STATE
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
  const [textInput, setTextInput] = useState("");
  const [contextLoadError, setContextLoadError] = useState(false);

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  // Language options
  const languages = [
    { code: "en-IN", name: "English", display: "🇮🇳 English" },
    { code: "hi-IN", name: "Hindi", display: "🇮🇳 हिंदी" },
    { code: "mr-IN", name: "Marathi", display: "🇮🇳 मराठी" },
  ];

  // FIELD CONTEXT
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
        return res.data.context;
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      if (retries > 0) {
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

  // PROCESS VOICE
  const processVoiceInput = useCallback(
    async (text) => {
      setIsProcessing(true);
      setError("");

      try {
        const token = localStorage.getItem("token");

        let contextToSend = fieldContext;
        if (!contextToSend && selectedField?._id) {
          contextToSend = await fetchFieldContext(selectedField._id, 1);
        }

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

  // SPEAK
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

  // LISTEN
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
      setError("Could not start listening");
      setIsListening(false);
    }
  }, [language]);

  const stopListening = useCallback(
    () => {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
      }
    },
    [isListening]
  );

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

  // INIT SPEECH RECOGNITION
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
      processVoiceInput(text);
    };

    recognitionRef.current.onerror = (event) => {
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
  }, [language, processVoiceInput]);

  // AUTO FIELD CONTEXT
  useEffect(() => {
    if (selectedField?._id) {
      fetchFieldContext(selectedField._id);
    } else {
      setFieldContext(null);
      setContextLoadError(false);
    }
  }, [selectedField, fetchFieldContext]);

  const canListen = !isProcessing && !isSpeaking;

  const handleTextSubmit = (e) => {
    e?.preventDefault();
    if (!textInput.trim() || isProcessing || isSpeaking) return;
    const q = textInput.trim();
    setTextInput("");
    setTranscript(q);
    processVoiceInput(q);
  };

  return (
    <div
      className={`fixed ${
        isExpanded 
          ? "inset-2 sm:inset-6" 
          : "bottom-4 right-2 left-2 sm:left-auto sm:right-6 sm:w-[380px]"
      } 
      max-h-[90vh]
      rounded-3xl shadow-[0_24px_80px_rgba(15,23,42,0.75)]
      border border-emerald-500/30
      bg-emerald-900/40
      backdrop-blur-2xl
      overflow-hidden
      transition-all duration-300
      z-50 flex flex-col`}
    >
      {/* EMERALD BACKGROUND DECOR (matches Dashboard) */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <CircleDashed className="absolute -top-10 -left-10 w-40 h-40 text-emerald-400/40" />
        <Flower2 className="absolute -bottom-16 -right-6 w-52 h-52 text-emerald-500/20" />
        <div className="absolute inset-0 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.12]" />
      </div>

      {/* HEADER */}
      <div className="relative bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-500 rounded-t-3xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-900/40 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/40">
            <Brain className="w-6 h-6 text-emerald-50" />
          </div>
          <div>
            <h3 className="text-emerald-50 font-bold text-lg tracking-tight">
              Sigro Voice Core
            </h3>
            <p className="text-emerald-100/80 text-xs">
              {selectedField
                ? `Field: ${selectedField.fieldName}`
                : "Ask anything about your farm"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 bg-emerald-900/40 hover:bg-emerald-900/60 rounded-xl transition-all"
          >
            {isExpanded ? (
              <Minimize2 className="w-5 h-5 text-emerald-50" />
            ) : (
              <Maximize2 className="w-5 h-5 text-emerald-50" />
            )}
          </button>
          <button
            onClick={onClose}
            className="p-2 bg-red-500/70 hover:bg-red-500 rounded-xl transition-all"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* LANGUAGE BAR */}
      <div className="relative p-4 border-b border-emerald-500/20 bg-emerald-900/40 backdrop-blur-xl">
        <label className="text-xs font-semibold text-emerald-100 mb-2 block tracking-wider uppercase">
          Language
        </label>
        <div className="flex gap-2 flex-wrap">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all border ${
                language === lang.code
                  ? "bg-emerald-500 text-emerald-950 border-emerald-300 shadow-lg shadow-emerald-500/40"
                  : "bg-emerald-900/40 text-emerald-100/80 border-emerald-700 hover:bg-emerald-800/70"
              }`}
            >
              {lang.display}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {/* Field Info Card */}
        {selectedField && (
          <div className="bg-emerald-900/50 backdrop-blur-xl rounded-2xl p-4 border border-emerald-500/30">
            {isLoadingContext ? (
              <div className="flex items-center justify-center gap-2 py-4">
                <Loader className="w-5 h-5 text-emerald-400 animate-spin" />
                <span className="text-xs text-emerald-100/80">
                  Syncing field telemetry...
                </span>
              </div>
            ) : fieldContext ? (
              <>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-emerald-50 flex items-center gap-2 text-sm">
                    <Sparkles className="w-4 h-4 text-emerald-300" />
                    Context loaded
                  </h4>
                  <button
                    onClick={retryFetchContext}
                    className="p-1 hover:bg-emerald-800/70 rounded-lg transition-all"
                    title="Refresh data"
                  >
                    <RefreshCw className="w-4 h-4 text-emerald-200" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-900/70 border border-emerald-600/40">
                    <Activity className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <div>
                      <span className="text-emerald-300/80 text-[10px] block">
                        Crop
                      </span>
                      <p className="font-semibold text-emerald-50">
                        {fieldContext.cropType}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-900/70 border border-emerald-600/40">
                    <Droplets className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <div>
                      <span className="text-emerald-300/80 text-[10px] block">
                        Moisture
                      </span>
                      <p className="font-semibold text-emerald-50">
                        {fieldContext.soilMoisture ?? "N/A"}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-900/70 border border-emerald-600/40">
                    <Thermometer className="w-4 h-4 text-orange-300 flex-shrink-0" />
                    <div>
                      <span className="text-emerald-300/80 text-[10px] block">
                        Temperature
                      </span>
                      <p className="font-semibold text-emerald-50">
                        {fieldContext.temperature ?? "N/A"}°C
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-900/70 border border-emerald-600/40">
                    <Activity className="w-4 h-4 text-lime-300 flex-shrink-0" />
                    <div>
                      <span className="text-emerald-300/80 text-[10px] block">
                        Health
                      </span>
                      <p className="font-semibold text-emerald-50">
                        {fieldContext.healthScore ?? "N/A"}%
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <AlertCircle className="w-7 h-7 text-amber-400 mx-auto mb-2" />
                <p className="text-xs text-emerald-100/80 mb-3">
                  Could not load field data.
                </p>
                <button
                  onClick={retryFetchContext}
                  className="text-xs text-emerald-300 hover:text-emerald-200 font-medium flex items-center gap-1 mx-auto"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try again
                </button>
              </div>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-900/40 border-l-4 border-red-500 p-3 rounded-xl backdrop-blur-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-300 flex-shrink-0" />
              <p className="text-xs text-red-100 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Conversation */}
        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
          {conversationHistory.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-2xl text-xs leading-relaxed border backdrop-blur-xl ${
                msg.type === "user"
                  ? "bg-emerald-900/60 border-emerald-600/60 ml-4 md:ml-10"
                  : "bg-emerald-800/60 border-emerald-500/70 mr-4 md:mr-10"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    msg.type === "user"
                      ? "bg-emerald-300"
                      : "bg-emerald-400"
                  }`}
                />
                <p className="text-[10px] font-semibold text-emerald-100/90">
                  {msg.type === "user" ? "You" : "Sigro Assistant"}
                </p>
                <span className="text-[10px] text-emerald-300/70 ml-auto">
                  {msg.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <p className="text-emerald-50">{msg.text}</p>
            </div>
          ))}
        </div>

        {/* Transcript */}
        {transcript && !response && (
          <div className="bg-emerald-900/60 border border-emerald-600/60 p-3 rounded-2xl ml-4 md:ml-10">
            <p className="text-[11px] font-semibold text-emerald-300 mb-1">
              You said
            </p>
            <p className="text-emerald-50 text-xs">{transcript}</p>
          </div>
        )}

        {/* Response */}
        {response && (
          <div className="bg-emerald-800/60 border border-emerald-500/70 p-3 rounded-2xl mr-4 md:mr-10 animate-fade-in">
            <p className="text-[11px] font-semibold text-emerald-300 mb-1">
              Assistant
            </p>
            <p className="text-emerald-50 text-xs leading-relaxed">{response}</p>
          </div>
        )}

        {/* Processing */}
        {isProcessing && (
          <div className="flex flex-col items-center justify-center gap-2 p-6">
            <div className="w-11 h-11 bg-emerald-900/60 rounded-2xl flex items-center justify-center border border-emerald-500/60">
              <Loader className="w-5 h-5 text-emerald-300 animate-spin" />
            </div>
            <span className="text-xs text-emerald-100 font-medium">
              Thinking with your field data...
            </span>
            <p className="text-[10px] text-emerald-300/70">
              {fieldContext ? "Context-aware agronomy insights." : "General guidance mode."}
            </p>
          </div>
        )}

        {/* Example Questions */}
        {!isListening &&
          !isProcessing &&
          conversationHistory.length === 0 &&
          !error && (
            <div className="bg-emerald-900/50 rounded-2xl p-4 border border-emerald-600/50">
              <p className="text-xs font-semibold text-emerald-200 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-300" />
                Try asking
              </p>
              <div className="grid grid-cols-1 gap-1.5 text-[11px] text-emerald-100/80">
                {[
                  "Should I irrigate this field today?",
                  "What is my current soil moisture?",
                  "How healthy is my crop?",
                  "When should I apply fertilizer?",
                  "Any risk of disease this week?",
                ].map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setTranscript(q);
                      processVoiceInput(q);
                    }}
                    className="text-left hover:text-emerald-300 transition-colors cursor-pointer py-0.5 flex items-center gap-1 group"
                  >
                    <span className="text-emerald-400 group-hover:translate-x-0.5 transition-transform">•</span>
                    <span>{q}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
      </div>

      {/* CONTROL PANEL */}
      <div className="relative p-4 bg-emerald-950/70 backdrop-blur-2xl border-t border-emerald-700/60 rounded-b-3xl">
        {/* TEXT INPUT FORM */}
        <form onSubmit={handleTextSubmit} className="flex items-center gap-2 mb-3">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Type your question or click mic..."
            disabled={isProcessing || isSpeaking}
            className="flex-1 bg-emerald-900/60 border border-emerald-600/60 rounded-xl px-3 py-2 text-xs text-white placeholder-emerald-300/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <button
            type="submit"
            disabled={!textInput.trim() || isProcessing || isSpeaking}
            className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-emerald-950 font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-1"
          >
            Ask
          </button>
        </form>

        <div className="flex items-center justify-center gap-4 mb-3">
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={!canListen}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all transform hover:scale-110 shadow-xl ${
              isListening
                ? "bg-red-500 shadow-red-500/60 animate-pulse"
                : isProcessing || isSpeaking
                ? "bg-slate-500/60 cursor-not-allowed shadow-slate-600/40"
                : "bg-gradient-to-br from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 shadow-emerald-500/70"
            }`}
            title={
              !canListen
                ? "Please wait, processing..."
                : "Tap to talk with Sigro"
            }
          >
            {isListening ? (
              <MicOff className="w-7 h-7 text-white" />
            ) : (
              <Mic className="w-7 h-7 text-emerald-950" />
            )}
          </button>

          <button
            onClick={isSpeaking ? stopSpeaking : null}
            disabled={!isSpeaking}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
              isSpeaking
                ? "bg-emerald-500 hover:bg-emerald-400 shadow-lg shadow-emerald-500/60"
                : "bg-slate-700/60 cursor-not-allowed"
            }`}
          >
            {isSpeaking ? (
              <VolumeX className="w-6 h-6 text-emerald-950" />
            ) : (
              <Volume2 className="w-6 h-6 text-slate-400" />
            )}
          </button>
        </div>

        <div className="text-center space-y-1">
          <p className="text-xs text-emerald-100 font-medium">
            {isListening
              ? "🎤 Listening... speak clearly near the mic."
              : isProcessing
              ? "🧠 Generating agronomy advice..."
              : isSpeaking
              ? "🔊 Playing response..."
              : selectedField && !fieldContext && !isLoadingContext
              ? "⏳ Preparing field intelligence..."
              : "🎤 Ready for your next field question."}
          </p>
          <p
            className={`text-[11px] ${
              fieldContext
                ? "text-emerald-400 font-medium"
                : "text-emerald-300/70"
            }`}
          >
            {fieldContext
              ? "✅ Context-aware: using live field data"
              : selectedField
              ? "Context loading for selected field..."
              : "No field selected – answering in general mode"}
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
          animation: fade-in 0.25s ease-out;
        }
      `}</style>
    </div>
  );
};

export default VoiceAssistant;
