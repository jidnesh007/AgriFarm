import React from "react";
import { Home, Calendar, Headphones, UserCircle, Sprout, Leaf, Activity } from "lucide-react";
import { motion } from "framer-motion";

const AboutSection = () => {
  // Enhanced features with specific dashboard-themed sub-labels
  const features = [
    { icon: Sprout, label: "AgriMonitor", color: "bg-emerald-100 text-emerald-700" },
    { icon: Activity, label: "StockSure", color: "bg-lime-100 text-lime-700" },
    { icon: Calendar, label: "CapAid", color: "bg-emerald-100 text-emerald-700" },
    { icon: UserCircle, label: "Assistant", color: "bg-emerald-900 text-white" }
  ];

  return (
    <section id="about" className="relative bg-[#F0FDF4] py-24 px-6 overflow-hidden">
      {/* --- Dashboard Style Nature Background Pattern --- */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:32px_32px]"></div>
        <Leaf className="absolute top-20 right-10 text-emerald-200 w-64 h-64 rotate-12 opacity-20" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Top Label - Styled like Dashboard Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
            <motion.span
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-2 h-2 bg-emerald-600 rounded-full"
            ></motion.span>
            ABOUT SIGRO AI
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left Side - Image Composition with Dashboard-style Shadows */}
          <div className="relative flex gap-6">
            <motion.div
              initial={{ opacity: 0, x: -50, rotate: -5 }}
              whileInView={{ opacity: 1, x: 0, rotate: -3 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
              className="w-64 h-80 rounded-[2.5rem] bg-cover bg-center shadow-2xl border-4 border-white relative z-10"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=80')",
              }}
            >
                <div className="absolute inset-0 bg-emerald-900/10 rounded-[2.5rem]"></div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50, rotate: 5 }}
              whileInView={{ opacity: 1, x: 0, rotate: 3 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
              className="w-64 h-80 rounded-[2.5rem] bg-cover bg-center shadow-2xl border-4 border-white mt-12"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&q=80')",
              }}
            >
                <div className="absolute inset-0 bg-emerald-900/10 rounded-[2.5rem]"></div>
            </motion.div>
          </div>

          {/* Right Side - Content Matching Hero Typography */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="text-6xl font-black leading-[1.1] mb-8 tracking-tighter"
            >
              <span className="text-emerald-900">Amidst the </span>
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-emerald-300"
              >
                digital evolution in agriculture, 
              </motion.span>
              <br />
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="text-emerald-900"
              >
                we bridge the gap.
              </motion.span>
            </motion.h2>

            <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-emerald-700/80 text-lg mb-12 max-w-xl leading-relaxed font-medium"
            >
                We empower farmers with AI-driven insights, moving beyond labor-intensive traditions to precision growth and sustainable harvesting.
            </motion.p>

            {/* Feature Icons Grid - Transparent Dashboard Style */}
            <div className="grid grid-cols-4 gap-6 mt-12">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1, type: "spring" }}
                  className="flex flex-col items-center group"
                >
                  <motion.div
                    whileHover={{ 
                        rotate: 360, 
                        scale: 1.1,
                        boxShadow: "0 20px 25px -5px rgba(16, 185, 129, 0.2)" 
                    }}
                    transition={{ duration: 0.6 }}
                    className={`w-20 h-20 rounded-3xl ${feature.color} backdrop-blur-md flex items-center justify-center mb-4 shadow-sm border border-white/50 transition-all`}
                  >
                    <feature.icon size={28} />
                  </motion.div>
                  <p className="text-xs font-black text-emerald-900 uppercase tracking-widest">
                    {feature.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;