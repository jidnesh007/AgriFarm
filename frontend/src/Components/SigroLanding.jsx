import React from "react";
import { motion } from "framer-motion";
import { Sprout, Leaf, Activity, ArrowRight, Zap } from "lucide-react";

const SigroLanding = () => {
  const products = [
    {
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=80",
      label: "Organic Fertilizer",
      icon: <Leaf className="w-5 h-5 text-emerald-600" />
    },
    {
      image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&q=80",
      label: "Technology Irrigation",
      icon: <Activity className="w-5 h-5 text-emerald-600" />
    },
    {
      image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&q=80",
      label: "Agricultural Monitoring",
      icon: <Sprout className="w-5 h-5 text-emerald-600" />
    }
  ];

  const benefits = [
    { num: "01", title: "Increase Crop Yield", active: true },
    { num: "02", title: "Reduce Water Usage", active: false },
    { num: "03", title: "Improve Soil Health", active: false }
  ];

  return (
    // Added id here
    <div id="sigro-landing" className="relative min-h-screen bg-[#F0FDF4] font-sans overflow-hidden">
      {/* Nature Background Pattern - Matches Dashboard */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:32px_32px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 py-20">
        {/* Header Section */}
        <header className="flex flex-col lg:flex-row justify-between items-start gap-10 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="flex-[2]"
          >
            <motion.p
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200 mb-6"
            >
              <motion.span
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-2 h-2 bg-emerald-600 rounded-full"
              ></motion.span>
              OUR SUSTAINABLE ECOSYSTEM
            </motion.p>
            
            <motion.h1
              className="text-6xl font-black leading-none text-emerald-900 tracking-tighter"
            >
              Explore Sigro Tech <br />
              <span className="text-emerald-400">Revolutionizing</span> <br />
              Agriculture & Food.
            </motion.h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="flex-1 max-w-sm mt-8 lg:mt-16"
          >
            <p className="text-lg text-emerald-700/80 font-medium leading-relaxed">
              Become part of a supportive community dedicated to fostering
              innovation in agriculture. Engage in precision farming tools and data-driven growth.
            </p>
          </motion.div>
        </header>

        {/* Product Cards - Transparent Glass Style */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {products.map((product, i) => (
            <motion.div
              key={product.label}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="group flex flex-col gap-4"
            >
              <motion.div
                whileHover={{ y: -12 }}
                className="h-64 rounded-[2.5rem] bg-cover bg-center overflow-hidden border-4 border-white shadow-2xl relative shadow-emerald-900/10"
                style={{ backgroundImage: `url('${product.image}')` }}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="w-full h-full bg-emerald-900/40 backdrop-blur-sm flex items-center justify-center"
                >
                  <motion.div className="bg-white p-4 rounded-full shadow-xl">
                    <ArrowRight className="text-emerald-700 w-6 h-6" />
                  </motion.div>
                </motion.div>
              </motion.div>
              <div className="flex items-center gap-3 px-2">
                <div className="p-2 bg-emerald-100 rounded-lg">{product.icon}</div>
                <p className="text-lg font-black text-emerald-900 uppercase tracking-widest text-sm">{product.label}</p>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Discover Solutions Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <h2 className="text-5xl font-black text-emerald-900 tracking-tighter mb-6 leading-tight">
              Discover Sigro Modern <br />
              <span className="text-emerald-400">Farming Solutions.</span>
            </h2>
            
            <p className="text-lg text-emerald-700/80 leading-relaxed font-medium mb-10">
              At Sigro, we offer innovative services to revolutionize modern
              agriculture, helping you maximize productivity, minimize environmental
              impact, and achieve sustainable growth using AI insights.
            </p>
            
            <div className="flex gap-4">
              <motion.div whileHover={{ scale: 1.1 }} className="p-4 bg-emerald-900 rounded-3xl text-white">
                <Zap size={24} />
              </motion.div>
              <p className="text-sm font-bold text-emerald-900 max-w-[200px]">AI-Powered efficiency for every field.</p>
            </div>
          </motion.section>

          {/* Benefits List - Matches Sidebar Nav Style */}
          <section className="w-full">
            <div className="space-y-4">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={benefit.num}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ x: 10 }}
                  className={`flex items-center justify-between px-8 py-6 rounded-[2rem] cursor-pointer border-2 transition-all duration-300 ${
                    benefit.active
                      ? 'bg-emerald-500 text-white border-emerald-400 shadow-xl shadow-emerald-900/20'
                      : 'bg-white/60 backdrop-blur-md border-emerald-100 text-emerald-900 hover:bg-white hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center gap-8">
                    <span className={`text-sm font-black ${benefit.active ? 'text-emerald-100' : 'text-emerald-400'}`}>
                      {benefit.num}
                    </span>
                    <span className="font-black text-2xl tracking-tighter italic uppercase">
                      {benefit.title}
                    </span>
                  </div>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <ArrowRight size={28} className={benefit.active ? "text-white" : "text-emerald-400"} />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SigroLanding;