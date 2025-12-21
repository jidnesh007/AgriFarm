import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check, ChevronDown } from 'lucide-react';

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [

    { code: 'en', label: 'English', flag: '🇬🇧' },
     { code: 'hi', label: 'Hindi', flag: 'HI' },
    { code: 'mr', label: 'मराठी', flag: '🇮🇳' },
    { code: 'bn', label: 'বাংলা', flag: '🇧🇩' },
    { code: 'ta', label: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', label: 'తెలుగు', flag: '🇮🇳' },
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white/60 hover:bg-white backdrop-blur-md rounded-full shadow-sm text-emerald-900 transition-all duration-300 hover:shadow-md border border-emerald-100 group"
      >
        <Globe className="w-5 h-5 text-emerald-600 group-hover:rotate-12 transition-transform duration-300" />
        <span className="text-sm font-semibold hidden sm:inline">{currentLanguage.flag} {currentLanguage.label}</span>
        <span className="text-sm font-semibold sm:hidden">{currentLanguage.flag}</span>
        <ChevronDown className={`w-4 h-4 text-emerald-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-100">
            <p className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-3.5 h-3.5" />
              Select Language
            </p>
          </div>

          {/* Language Options */}
          <div className="py-2 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-400 scrollbar-track-transparent">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full px-4 py-3 flex items-center justify-between gap-3 transition-all duration-200 group hover:bg-emerald-50 ${
                  currentLanguage.code === language.code ? 'bg-emerald-50/80' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                    {language.flag}
                  </span>
                  <span className={`font-semibold text-sm ${
                    currentLanguage.code === language.code ? 'text-emerald-900' : 'text-gray-700 group-hover:text-emerald-800'
                  }`}>
                    {language.label}
                  </span>
                </div>
                
                {currentLanguage.code === language.code && (
                  <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center animate-in zoom-in duration-200">
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Footer Tip */}
          <div className="px-4 py-2.5 bg-emerald-50/50 border-t border-emerald-100">
            <p className="text-[10px] text-emerald-700 text-center">
              🌱 Choose your preferred language
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
