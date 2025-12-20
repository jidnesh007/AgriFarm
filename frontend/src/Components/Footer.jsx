import React from "react";
import { 
  Facebook, Twitter, Instagram, Linkedin, 
  Leaf, CircleDashed, Flower2, Send, 
  MapPin, Phone, Mail, Zap 
} from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  const companyLinks = ['Features', 'AI Assistant', 'About Sigro', 'Contact'];
  const resourceLinks = ['AgriBlog', 'Farmer Stories', 'Data Privacy', 'Legal'];
  const careerLinks = ['Open Positions', 'Hiring', 'Tech News'];
  const helpLinks = ['FAQ', 'Support Center', 'System Status'];
  const socialIcons = [Facebook, Twitter, Instagram, Linkedin];

  return (
    <footer id="footer" className="relative bg-emerald-950 text-white overflow-hidden border-t border-emerald-900/50">
      
      {/* --- DASHBOARD DECORATIVE ELEMENTS --- */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-10">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -right-20"
        >
          <CircleDashed className="w-96 h-96 text-emerald-400" />
        </motion.div>
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -bottom-10 -left-10"
        >
          <Flower2 className="w-80 h-80 text-emerald-500" />
        </motion.div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-10">
        
        {/* TOP SECTION: BRANDING & LINKS */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-12 pb-16 border-b border-emerald-900/50">
          
          {/* Brand Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="md:col-span-2"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <Leaf className="w-6 h-6 text-emerald-700 fill-emerald-700" />
              </div>
              <div>
                <span className="text-2xl font-bold tracking-tight">Sigro</span>
                <p className="text-[10px] text-emerald-400 uppercase tracking-widest font-black">Agriculture AI</p>
              </div>
            </div>
            
            <p className="text-sm text-emerald-100/60 mb-8 leading-relaxed max-w-xs">
              Empowering the next generation of farmers with real-time neural insights and precision agricultural monitoring.
            </p>
            
            {/* Social Icons - Dashboard Nav Style */}
            <div className="flex gap-3">
              {socialIcons.map((Icon, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.1, backgroundColor: '#10b981', color: '#fff' }}
                  className="w-10 h-10 rounded-xl bg-emerald-900/50 border border-emerald-800 flex items-center justify-center cursor-pointer transition-all text-emerald-400"
                >
                  <Icon size={18} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Link Columns */}
          {[
            { title: 'System', links: companyLinks },
            { title: 'Resources', links: resourceLinks },
            { title: 'Network', links: careerLinks },
            { title: 'Support', links: helpLinks }
          ].map((section, idx) => (
            <motion.div 
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="md:col-span-1"
            >
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-6 text-emerald-400">
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <motion.a
                      whileHover={{ x: 5, color: '#10b981' }}
                      href="#"
                      className="text-sm text-emerald-100/50 transition-colors font-medium"
                    >
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* MIDDLE SECTION: NEWSLETTER & CONTACT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 py-16 border-b border-emerald-900/50">
          
          {/* Premium Newsletter */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-4xl font-black mb-4 tracking-tighter">Stay Synchronized.</h2>
            <p className="text-emerald-100/60 mb-8 text-sm max-w-sm font-medium">
              Receive weekly AI harvest reports and exclusive agricultural technology updates.
            </p>
            
            <div className="relative max-w-md group">
              <input
                type="email"
                placeholder="Enter field operator email"
                className="w-full px-6 py-4 rounded-2xl bg-emerald-900/50 border border-emerald-800 text-white text-sm placeholder-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-emerald-900 transition-all"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="absolute right-2 top-2 bottom-2 px-6 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg"
              >
                Sync Now
              </motion.button>
            </div>
          </motion.div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-2 gap-8">
            {[
              { icon: MapPin, title: 'Global HQ', content: '1901 Sigro Valley.\nJakarta, Indonesia' },
              { icon: Phone, title: 'Operations', content: '+62 875 2983 00' },
              { icon: Mail, title: 'Network', content: 'hello.sigro@ai.com' },
              { icon: Zap, title: 'Membership', content: 'Premium Active' }
            ].map((info, i) => (
              <motion.div key={i} whileHover={{ y: -5 }}>
                <div className="flex items-center gap-2 mb-3">
                  <info.icon size={14} className="text-emerald-500" />
                  <h4 className="text-[10px] font-black text-emerald-400 tracking-[0.2em] uppercase">
                    {info.title}
                  </h4>
                </div>
                <p className="text-sm text-emerald-100 font-bold whitespace-pre-line leading-relaxed">
                  {info.content}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* BOTTOM SECTION: COPYRIGHT */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-10 text-emerald-100/40">
          <p className="text-[10px] font-black uppercase tracking-widest">
            © 2025 Sigro Agriculture AI. All Protocols Reserved.
          </p>
          <div className="flex gap-8 mt-6 md:mt-0">
            {['Privacy Policy', 'Data Terms', 'Security'].map((link, i) => (
              <a key={i} href="#" className="text-[10px] font-bold uppercase tracking-widest hover:text-emerald-400 transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;