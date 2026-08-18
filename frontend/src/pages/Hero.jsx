import React, { useState } from "react";
import { ArrowUpRight, Cloud, MapPin, Calendar, LogIn, Sprout, Leaf, Activity, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const HeroSection = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' }); 
    }
    setMobileMenuOpen(false);
  };

  const handleGetStarted = () => navigate('/login');
  const handleViewAnalytics = () => navigate('/Analytics');

  return (
    <div className="relative min-h-screen bg-[#F0FDF4] font-sans overflow-hidden">
      {/* --- BACKGROUND IMAGE & OVERLAY --- */}
      <motion.div
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1600&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/70 via-emerald-900/40 to-black/30"></div>
      </motion.div>

      {/* --- FLOATING NATURE PATTERNS --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1.5px,transparent_1.5px)] [background-size:32px_32px] opacity-[0.15]"></div>
      </div>

      <div className="relative z-10">
        {/* --- NAVBAR --- */}
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="flex items-center justify-between px-4 sm:px-8 md:px-12 py-4 md:py-5 bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50"
        >
          {/* LEFT: Logo Section */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/')}
            className="cursor-pointer flex items-center gap-3"
          >
            <div className="w-9 h-9 md:w-10 md:h-10 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/20">
              <Leaf className="w-5 h-5 md:w-6 md:h-6 text-emerald-700 fill-emerald-700" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xl md:text-2xl font-bold tracking-tight text-white">Sigro</span>
              <span className="text-[9px] md:text-[10px] text-emerald-400 uppercase tracking-[0.2em] font-black">Agri AI</span>
            </div>
          </motion.div>

          {/* CENTER: Navigation Links - Desktop only */}
          <div className="hidden md:flex items-center justify-center gap-10 flex-[2]">
            {[
              { label: 'Our Vision', id: 'about' },
              { label: 'Membership', id: 'contact-carousel' },
              { label: 'Article', id: 'sigro-landing' }
            ].map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ y: -2, color: "#fff" }}
                onClick={() => scrollToSection(item.id)}
                className="text-[11px] font-black text-emerald-100/80 transition-all uppercase tracking-[0.25em] hover:text-white"
              >
                {item.label}
              </motion.button>
            ))}
          </div>

          {/* RIGHT: Action Buttons - Desktop */}
          <div className="hidden md:flex items-center justify-end gap-5 flex-1">
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
              onClick={handleGetStarted}
              className="flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white/5 text-white border border-white/10 transition-all font-bold text-[12px] uppercase tracking-widest"
            >
              <LogIn size={16} className="text-emerald-400" />
              <span>Login</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#10b981" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => scrollToSection('footer')}
              className="px-7 py-2.5 bg-emerald-500 text-white text-[12px] font-black rounded-full transition-all shadow-xl shadow-emerald-900/40 uppercase tracking-widest"
            >
              Contact
            </motion.button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 text-white rounded-lg bg-white/10 border border-white/20"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </motion.nav>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden absolute top-[65px] left-0 right-0 z-40 bg-emerald-950/95 backdrop-blur-xl border-b border-white/10 px-6 py-6 space-y-4"
            >
              {[
                { label: 'Our Vision', id: 'about' },
                { label: 'Membership', id: 'contact-carousel' },
                { label: 'Article', id: 'sigro-landing' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left text-sm font-bold text-emerald-100 uppercase tracking-widest py-2 border-b border-emerald-800/40"
                >
                  {item.label}
                </button>
              ))}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { handleGetStarted(); setMobileMenuOpen(false); }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-white/10 text-white border border-white/20 font-bold text-xs uppercase tracking-widest"
                >
                  <LogIn size={14} className="text-emerald-400" />
                  Login
                </button>
                <button
                  onClick={() => scrollToSection('footer')}
                  className="flex-1 px-4 py-2.5 bg-emerald-500 text-white text-xs font-black rounded-full uppercase tracking-widest"
                >
                  Contact
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- MAIN HERO BODY --- */}
        <div className="px-4 sm:px-8 md:px-10 py-10 md:py-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
            
            {/* LEFT SIDE: WIDGET STACK - Shows on bottom for mobile */}
            <div className="space-y-5 md:space-y-6 order-2 lg:order-1">
              {/* Location & Weather Widget */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white/10 backdrop-blur-xl rounded-[2rem] p-5 md:p-6 border border-white/10 shadow-2xl w-full max-w-sm mx-auto lg:mx-0"
              >
                <div className="flex items-start gap-2 mb-4">
                  <MapPin size={18} className="text-emerald-400 mt-1" />
                  <p className="text-sm text-emerald-50 font-medium">
                    Jakarta, Green GC 98765, India
                  </p>
                </div>

                <div className="bg-emerald-900/40 rounded-2xl p-4 md:p-5 border border-white/10">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-emerald-300 mb-1 font-bold">
                        <MapPin size={12} />
                        Live Weather
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl md:text-4xl font-black text-white">+18°C</span>
                        <div className="text-[10px] text-emerald-200">
                          <p>H: <span className="font-bold">26°C</span></p>
                          <p>L: <span className="font-bold">16°C</span></p>
                        </div>
                      </div>
                    </div>
                    <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
                      <Cloud size={40} className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 pt-4 border-t border-white/10">
                    {[{ l: 'Hum', v: '40%' }, { l: 'Pre', v: '5.1m' }, { l: 'Pres', v: '450' }, { l: 'Wind', v: '23m' }].map((s) => (
                      <div key={s.l}>
                        <p className="text-[8px] uppercase font-black text-emerald-400">{s.l}</p>
                        <p className="text-[10px] font-bold text-white">{s.v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Growth Chart Widget */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white/10 backdrop-blur-xl rounded-[2rem] p-5 md:p-6 border border-white/10 shadow-2xl w-full max-w-sm mx-auto lg:mx-0"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-xs font-black text-emerald-300 uppercase tracking-widest">Growth Index</h4>
                    <p className="text-2xl font-black text-white">0.80</p>
                  </div>
                  <div className="flex gap-2 text-[10px] font-bold text-emerald-400">
                    {['W', 'M', 'Y'].map((p) => (
                      <span key={p} className={p === 'M' ? 'text-white' : 'opacity-50'}>{p}</span>
                    ))}
                  </div>
                </div>

                <div className="flex items-end justify-between gap-1 h-24 md:h-28">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${20 + Math.random() * 80}%` }}
                      transition={{ delay: 0.4 + i * 0.05 }}
                      whileHover={{ backgroundColor: "#34d399", scale: 1.1 }}
                      className="flex-1 bg-emerald-500/50 rounded-t-sm cursor-pointer"
                      style={{ opacity: i < 8 ? 0.3 : 1 }}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Membership Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3 justify-center lg:justify-start"
              >
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((n) => (
                    <img key={n} src={`https://i.pravatar.cc/100?img=${n + 10}`} className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-emerald-500 bg-white" alt="Member" />
                  ))}
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-emerald-500 bg-emerald-600 flex items-center justify-center text-[10px] font-black text-white">+12k</div>
                </div>
                <div>
                  <p className="text-sm font-black text-white">12k + Members</p>
                  <p className="text-[10px] text-emerald-300 font-bold uppercase tracking-widest">Active Communities</p>
                </div>
              </motion.div>
            </div>

            {/* RIGHT SIDE: HERO CONTENT */}
            <div className="lg:pl-6 text-left order-1 lg:order-2">
              <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 rounded-full mb-5 md:mb-8">
                  <Sprout size={14} className="text-emerald-400" />
                  <span className="text-emerald-100 text-[10px] font-black uppercase tracking-[0.2em]">Next-Gen Farming AI</span>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black text-white leading-[0.9] mb-5 md:mb-8 tracking-tighter">
                  DIGITAL <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-300">
                    HARVEST
                  </span>
                </h1>

                <p className="text-base md:text-lg text-emerald-50/70 mb-7 md:mb-10 max-w-lg font-medium leading-relaxed">
                  Sigro leverages neural networks to monitor crop health in real-time. 
                  Identify diseases, optimize irrigation, and scale your production with 
                  precision agricultural data.
                </p>

                <div className="flex flex-wrap gap-3 md:gap-5">
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: "#fff", color: "#064e3b" }}
                    onClick={handleGetStarted}
                    className="flex items-center gap-3 px-7 md:px-10 py-4 md:py-5 bg-emerald-500 text-white font-black rounded-full shadow-2xl shadow-emerald-900/40 transition-all text-sm uppercase tracking-widest"
                  >
                    Get Started
                    <ArrowUpRight size={20} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                    onClick={handleViewAnalytics}
                    className="flex items-center gap-3 px-7 md:px-10 py-4 md:py-5 bg-white/5 backdrop-blur-md border border-white/20 text-white font-black rounded-full transition-all text-sm uppercase tracking-widest"
                  >
                    View Analytics
                    <Activity size={20} className="text-emerald-400" />
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;