import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Lock, Sprout, Leaf, Phone } from "lucide-react";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
        }
      );

      setSuccess(true);
      setTimeout(() => {
        navigate("/login", {
          state: { message: "Registration successful! Please login." },
        });
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
        style={{ zIndex: -2 }}
      >
        <source src="/farmer.mp4" type="video/mp4" />
      </video>

      {/* ULTRA TRANSPARENT OVERLAY - Exact Match */}
      <div 
        className="absolute inset-0"
        style={{ 
          zIndex: -1,
          background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.3) 0%, rgba(2, 44, 34, 0.4) 50%, rgba(0, 0, 0, 0.5) 100%)'
        }}
      ></div>

      {/* Animated Background Particles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.2; }
          33% { transform: translate(30px, -30px) rotate(120deg); opacity: 0.4; }
          66% { transform: translate(-20px, 20px) rotate(240deg); opacity: 0.3; }
        }
        
        @keyframes slideInFromLeft {
          from { transform: translateX(-100%) scale(0.8); opacity: 0; }
          to { transform: translateX(0) scale(1); opacity: 1; }
        }
        
        @keyframes slideInFromRight {
          from { transform: translateX(100%) scale(0.8); opacity: 0; }
          to { transform: translateX(0) scale(1); opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .register-card-enter { animation: fadeInUp 0.8s ease-out forwards; }
        .register-content-enter { animation: slideInFromRight 0.6s ease-out 0.3s forwards; opacity: 0; }
        .welcome-panel-enter { animation: slideInFromLeft 0.6s ease-out 0.2s forwards; opacity: 0; }
        
        .form-field { animation: fadeInUp 0.5s ease-out forwards; opacity: 0; }
        .form-field:nth-child(1) { animation-delay: 0.5s; }
        .form-field:nth-child(2) { animation-delay: 0.6s; }
        .form-field:nth-child(3) { animation-delay: 0.7s; }
        .form-field:nth-child(4) { animation-delay: 0.8s; }
        
        .particle {
          position: absolute;
          background: rgba(16, 185, 129, 0.2);
          border-radius: 50%;
          pointer-events: none;
          animation: float 15s infinite ease-in-out;
        }
        .particle:nth-child(1) { width: 80px; height: 80px; top: 10%; left: 10%; }
        .particle:nth-child(2) { width: 60px; height: 60px; top: 60%; left: 80%; }
        .particle:nth-child(3) { width: 100px; height: 100px; top: 80%; left: 20%; }
        .particle:nth-child(4) { width: 50px; height: 50px; top: 30%; left: 70%; }
      `}</style>

      {/* Floating Particles */}
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>

      {/* Main Register Card Container */}
      <div className="relative z-10 w-full max-w-2xl register-card-enter" style={{ perspective: '1500px' }}>
        <div 
          className="relative overflow-visible"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(12px) saturate(160%)',
            WebkitBackdropFilter: 'blur(12px) saturate(160%)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3), 0 0 40px rgba(16, 185, 129, 0.1)',
            borderRadius: '24px',
            transition: 'transform 0.3s ease'
          }}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 50;
            const rotateY = (centerX - x) / 50;
            e.currentTarget.style.transform = `perspective(1500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
          }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'perspective(1500px) rotateX(0deg) rotateY(0deg)'; }}
        >
          <div className="relative p-12 flex">
            
            {/* Left Panel: Matches Login Style */}
            <div 
              className="absolute top-0 left-0 flex items-start justify-center welcome-panel-enter"
              style={{
                clipPath: 'polygon(0% 0%, 100% 0%, 30% 100%, 0% 100%)',
                width: '50%',
                height: '100%',
                background: 'rgba(16, 185, 129, 0.08)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
                borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                borderTopLeftRadius: '24px',
                borderBottomLeftRadius: '24px',
              }}
            >
              <div className="w-full pt-20 text-center">
                <Leaf className="w-10 h-10 text-emerald-400 opacity-80 mx-auto mb-4" />
                <h3 
                  className="text-3xl font-bold text-white leading-tight"
                  style={{ 
                    textShadow: '0 0 15px rgba(16, 185, 129, 0.6), 0 2px 5px rgba(0, 0, 0, 0.5)',
                    animation: 'pulse 3s ease-in-out infinite'
                  }}
                >
                  JOIN <br /> <span className="text-emerald-300">SIGRO</span>
                </h3>
              </div>
            </div>

            {/* Right Side: Register Content */}
            <div className="relative z-10 ml-auto register-content-enter" style={{ width: '50%', paddingLeft: '2rem' }}>
              <div className="flex items-center gap-2 mb-4">
                <Sprout className="w-6 h-6 text-emerald-400" />
                <span className="text-emerald-400 uppercase tracking-widest text-[10px] font-bold">Agriculture AI</span>
              </div>

              {/* Heading: Solid White Exact Match */}
              <h2 className="text-5xl font-bold text-white mb-12" style={{ textShadow: '0 4px 15px rgba(0, 0, 0, 0.4)' }}>
                Register
              </h2>

              {/* Status Messages */}
              {(error || success) && (
                <div 
                  className="px-4 py-3 rounded-xl mb-6 text-sm backdrop-blur-md"
                  style={{
                    background: error ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                    border: `1px solid ${error ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                    color: error ? '#fca5a5' : '#a7f3d0',
                  }}
                >
                  {error ? error : "Account created! Redirecting..."}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="relative group form-field">
                  <User className="absolute left-0 bottom-3 text-emerald-400" size={18} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent border-b border-white/30 focus:border-emerald-400 text-white text-sm pl-7 pb-3 outline-none transition-all placeholder-white"
                    placeholder="Full Name"
                  />
                </div>

                <div className="relative group form-field">
                  <Phone className="absolute left-0 bottom-3 text-emerald-400" size={18} />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    maxLength="10"
                    className="w-full bg-transparent border-b border-white/30 focus:border-emerald-400 text-white text-sm pl-7 pb-3 outline-none transition-all placeholder-white"
                    placeholder="Phone Number"
                  />
                </div>

                <div className="relative group form-field">
                  <Lock className="absolute left-0 bottom-3 text-emerald-400" size={18} />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                    className="w-full bg-transparent border-b border-white/30 focus:border-emerald-400 text-white text-sm pl-7 pb-3 outline-none transition-all placeholder-white"
                    placeholder="Password"
                  />
                </div>

                {/* Confirm Password (logic matches your original) */}
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="hidden"
                />

                <div className="pt-4 form-field">
                  <button
                    type="submit"
                    disabled={loading || success}
                    onClick={() => setFormData(p => ({ ...p, confirmPassword: p.password }))}
                    className="w-full text-white font-bold text-sm py-4 rounded-full transition-all duration-300 disabled:opacity-50 uppercase tracking-widest relative overflow-hidden group shadow-lg"
                    style={{
                      background: 'rgba(16, 185, 129, 0.25)',
                      backdropFilter: 'blur(5px)',
                      border: '1px solid rgba(16, 185, 129, 0.5)',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    <span className="relative z-10">{loading ? "Processing..." : "Register"}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  </button>
                </div>
              </form>

              <div className="text-center mt-8" style={{ animation: 'fadeInUp 0.5s ease-out 0.9s forwards', opacity: 0 }}>
                <p className="text-white/60 text-sm">
                  Already a member?{" "}
                  <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-bold hover:underline">
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom glow - Matches Login */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-24"
        style={{ background: 'linear-gradient(to top, rgba(2, 44, 34, 0.4), transparent)' }}
      ></div>
    </div>
  );
};

export default Register;