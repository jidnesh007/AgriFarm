import React, { useState } from "react";
import { 
  Cloud, Sprout, Droplet, MapPin, ArrowRight, Leaf, Zap, 
  ShieldCheck, Globe, CircleDashed, Flower2, Target, 
  Cpu, Database, BarChart, Binary, Calendar 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ContactSection = () => {
  const [activeTab, setActiveTab] = useState('Core Benefits');

  const contentData = {
    'Core Benefits': {
      title: "Neural",
      subtitle: "Efficiency",
      description: "Propelling agricultural outputs via high-precision neural monitoring and deep forest data synchronization.",
      mainImage: "https://cdn.tridge.com/attachment/84138def6ccbfcf4b18541963cacba1a58973e6f.jpg",
      floatingImage: "https://static.vecteezy.com/system/resources/previews/007/449/070/non_2x/agriculture-plant-seedling-growing-step-concept-with-mountain-and-sunrise-background-free-photo.jpg",
      stats: [
        { label: 'Neural Accuracy', val: '99.9%', desc: 'Optimization levels reached across AI-integrated fields.' },
        { label: 'Harvest Growth', val: '+124%', desc: 'Average increase in commercial output vs traditional methods.' }
      ],
      features: [
        { icon: Zap, text: 'Ultra-Low Latency Sync' },
        { icon: Leaf, text: 'Biological Recognition' },
        { icon: Target, text: 'Yield Optimization' }
      ]
    },
    'Legacy View': {
      title: "Ancient",
      subtitle: "Wisdom",
      description: "Merging 100 years of traditional farming intuition with modern data processing for long-term sustainability.",
      mainImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000",
      floatingImage: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=600",
      stats: [
        { label: 'Soil Longevity', val: '85%', desc: 'Preservation of topsoil nutrients through rotation AI.' },
        { label: 'Heritage Yield', val: 'x2.4', desc: 'Efficiency increase in heirloom crop production.' }
      ],
      features: [
        { icon: Calendar, text: 'Seasonal Cycle Prediction' },
        { icon: Droplet, text: 'Natural Water Retention' },
        { icon: ShieldCheck, text: 'Organic Compliance' }
      ]
    },
    'AI Solutions': {
      title: "Silicon",
      subtitle: "Roots",
      description: "Automated drone scouting and robotic harvesting controlled by a centralized Sigro AI brain.",
      mainImage: "https://img.freepik.com/premium-photo/advancements-artificial-intelligence-machine-learning-are-transforming-agriculture-farming_90099-10819.jpg?w=2000",
      floatingImage: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&q=80&w=600",
      stats: [
        { label: 'Automation rate', val: '92%', desc: 'Autonomous tasks completed without human interference.' },
        { label: 'Error Margin', val: '<0.1%', desc: 'Precision in robotic seeding and pest identification.' }
      ],
      features: [
        { icon: Cpu, text: 'Edge Computing Nodes' },
        { icon: Binary, text: 'Real-time Pest Code' },
        { icon: Globe, text: 'Satellite Mesh Link' }
      ]
    },
    'Pro Access': {
      title: "Quantum",
      subtitle: "Scale",
      description: "Institutional level tools for commercial enterprises managing over 10,000 hectares of land.",
      mainImage: "https://okcredit-blog-images-prod.storage.googleapis.com/2020/10/shutterstock_1484680373.jpg",
      floatingImage: "https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&q=80&w=600",
      stats: [
        { label: 'Global Rank', val: 'Top 1%', desc: 'Benchmarking your farm against world leaders.' },
        { label: 'ROI Speed', val: '1.2y', desc: 'Average time to recoup investment on Sigro Pro.' }
      ],
      features: [
        { icon: Database, text: 'Encrypted Field Vault' },
        { icon: BarChart, text: 'Advanced API Hooks' },
        { icon: Target, text: 'Territory Expansion AI' }
      ]
    }
  };

  const current = contentData[activeTab];

  return (
    <div id="contact-carousel" className="relative min-h-screen py-28 px-10 overflow-hidden font-sans bg-[#064e3b]">
      
      {/* Background Decorations */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-10">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute -top-24 -left-24">
          <CircleDashed className="w-[500px] h-[500px] text-white" />
        </motion.div>
        <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-10 right-0 translate-x-1/4">
          <Flower2 className="w-[600px] h-[600px] text-white" />
        </motion.div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto">
        {/* Carousel Navigation */}
        <div className="flex justify-center mb-24">
          <div className="inline-flex p-2 bg-emerald-900/40 backdrop-blur-3xl rounded-[2.5rem] border border-emerald-800/50 shadow-2xl">
            {Object.keys(contentData).map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-10 py-4 text-[10px] font-black uppercase tracking-[0.3em] rounded-full transition-all duration-500 ${
                  activeTab === tab
                    ? 'bg-emerald-50 text-emerald-900 shadow-xl'
                    : 'text-emerald-100 hover:text-white hover:bg-emerald-800/50'
                }`}
              >
                {tab}
              </motion.button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Top Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-32 items-center">
              <div className="lg:col-span-5">
                <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-emerald-900/50 backdrop-blur-md rounded-2xl border border-emerald-800/50 mb-10">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(16,185,129,1)]"></div>
                  <span className="text-[10px] font-black text-emerald-100 uppercase tracking-widest">{activeTab} Syncing</span>
                </div>
                
                <h1 className="text-8xl lg:text-9xl font-black text-white mb-10 leading-[0.8] tracking-tighter uppercase">
                  {current.title} <br />
                  <span className="text-emerald-400 relative italic">
                    {current.subtitle}
                    <motion.span initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ delay: 0.5, duration: 1 }} className="absolute -bottom-2 left-0 h-2 bg-emerald-400/30 -z-10" />
                  </span>
                </h1>
                
                <div className="flex items-start gap-6 border-l-4 border-emerald-400 pl-8 py-4">
                  <p className="text-lg text-emerald-100/70 font-semibold leading-relaxed max-w-sm">
                    {current.description}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-12 gap-6 relative">
                <motion.div className="col-span-8 relative perspective-1000">
                  <div className="h-[450px] rounded-[4rem] bg-cover bg-center border-[12px] border-emerald-900 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] overflow-hidden relative group"
                    style={{ backgroundImage: `url(${current.mainImage})` }}>
                    <div className="absolute inset-0 bg-emerald-950/20"></div>
                    <div className="absolute top-10 left-10 p-6 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl">
                        <Globe size={24} className="text-emerald-400 mb-2" />
                        <p className="text-white font-black text-xs uppercase tracking-widest">Global Link</p>
                    </div>
                  </div>
                </motion.div>

                <div className="col-span-4 self-end">
                  <div className="h-64 rounded-[3rem] bg-white/5 backdrop-blur-xl border-[4px] border-emerald-400/20 shadow-2xl flex flex-col items-center justify-center p-8 text-center text-white">
                    <ShieldCheck size={48} className="text-emerald-400 mb-4" />
                    <p className="font-black uppercase tracking-widest text-[10px]">Vault Secured</p>
                    <p className="text-xs text-emerald-200/60 mt-2 font-bold italic tracking-wider">Protocol Locked</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="relative group">
                <div className="h-[600px] rounded-[5rem] bg-cover bg-center border-[15px] border-emerald-900 shadow-2xl relative z-0 overflow-hidden"
                  style={{ backgroundImage: `url(${current.floatingImage})` }}>
                   <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 to-transparent"></div>
                </div>

                <motion.div className="absolute -right-10 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-2xl p-12 rounded-[4rem] border border-white/20 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] max-w-md z-10">
                  <h3 className="text-4xl font-black text-white mb-6 tracking-tighter leading-none uppercase">
                    AI <span className="text-emerald-400 italic">Core</span>
                  </h3>
                  
                  <div className="space-y-6 mb-10">
                    {current.features.map((item, i) => (
                      <div key={i} className="flex items-center gap-4 group cursor-pointer">
                        <div className="p-3 bg-emerald-400/10 rounded-2xl group-hover:bg-emerald-400 group-hover:text-emerald-950 transition-all duration-300 border border-emerald-400/20">
                           <item.icon size={20} className="text-emerald-400 group-hover:text-emerald-950" />
                        </div>
                        <p className="font-bold text-white/80 text-sm tracking-tight uppercase tracking-wider">{item.text}</p>
                      </div>
                    ))}
                  </div>
                  
                  <motion.button whileHover={{ scale: 1.05, letterSpacing: '0.4em' }} className="w-full py-5 bg-emerald-50 text-emerald-900 font-black rounded-3xl transition-all uppercase tracking-[0.2em] text-[10px] shadow-2xl">
                    Access System
                  </motion.button>
                </motion.div>
              </div>

              <div className="lg:pl-20">
                <motion.p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 mb-6">Market Statistics</motion.p>
                <h2 className="text-7xl font-black text-white mb-12 tracking-tighter leading-none uppercase italic">Global <br /> Precision.</h2>
                
                <div className="space-y-8">
                  {current.stats.map((card, i) => (
                    <motion.div key={i} whileHover={{ x: 20 }} className="p-10 bg-white/5 backdrop-blur-md rounded-[3.5rem] border border-white/10 shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-400 rounded-full -mr-20 -mt-20 opacity-5"></div>
                      <p className="text-7xl font-black text-emerald-400 mb-4 tracking-tighter">{card.val}</p>
                      <div className="relative z-10">
                        <p className="text-xs font-black uppercase tracking-widest text-white mb-2">{card.label}</p>
                        <p className="text-sm font-medium text-emerald-100/60 leading-relaxed font-bold tracking-wide">{card.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.div animate={{ top: ['0%', '100%', '0%'] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute left-0 w-full h-[2px] bg-white/10 z-0 shadow-[0_0_15px_rgba(255,255,255,0.5)]" />

      <style jsx>{`
        .perspective-1000 { perspective: 1000px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default ContactSection;