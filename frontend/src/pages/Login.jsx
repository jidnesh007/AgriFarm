import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { User, Lock, Sprout, Leaf } from "lucide-react";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    phoneNumber: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userName", response.data.userName || "Farmer");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
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

      {/* Enhanced Dark Overlay with Emerald Tint */}
      <div 
        className="absolute inset-0"
        style={{ 
          zIndex: -1,
          background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.7) 0%, rgba(2, 44, 34, 0.6) 50%, rgba(0, 0, 0, 0.8) 100%)'
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
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 30px rgba(16, 185, 129, 0.4), 0 4px 15px rgba(0, 0, 0, 0.3); }
          50% { box-shadow: 0 0 50px rgba(16, 185, 129, 0.7), 0 4px 20px rgba(0, 0, 0, 0.4); }
        }
        
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .login-card-enter {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .login-content-enter {
          animation: slideInFromLeft 0.6s ease-out 0.3s forwards;
          opacity: 0;
        }
        
        .welcome-panel-enter {
          animation: slideInFromRight 0.6s ease-out 0.2s forwards;
          opacity: 0;
        }
        
        .form-field {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
        
        .form-field:nth-child(1) { animation-delay: 0.5s; }
        .form-field:nth-child(2) { animation-delay: 0.6s; }
        .form-field:nth-child(3) { animation-delay: 0.7s; }
        
        .particle {
          position: absolute;
          background: rgba(16, 185, 129, 0.2);
          border-radius: 50%;
          pointer-events: none;
          animation: float 15s infinite ease-in-out;
        }
        
        .particle:nth-child(1) { width: 80px; height: 80px; top: 10%; left: 10%; animation-delay: 0s; }
        .particle:nth-child(2) { width: 60px; height: 60px; top: 60%; left: 80%; animation-delay: 3s; }
        .particle:nth-child(3) { width: 100px; height: 100px; top: 80%; left: 20%; animation-delay: 6s; }
        .particle:nth-child(4) { width: 50px; height: 50px; top: 30%; left: 70%; animation-delay: 9s; }
      `}</style>

      {/* Floating Particles (Emerald Green) */}
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>

      {/* Main Login Card Container */}
      <div className="relative z-10 w-full max-w-2xl login-card-enter" style={{ perspective: '1500px' }}>
        <div 
          className="relative overflow-visible"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(25px) saturate(150%)',
            WebkitBackdropFilter: 'blur(25px) saturate(150%)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            boxShadow: `
              0 8px 32px 0 rgba(0, 0, 0, 0.5),
              0 0 80px rgba(16, 185, 129, 0.15),
              inset 0 1px 0 rgba(255, 255, 255, 0.05)
            `,
            borderRadius: '24px',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
          }}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 40;
            const rotateY = (centerX - x) / 40;
            e.currentTarget.style.transform = `perspective(1500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'perspective(1500px) rotateX(0deg) rotateY(0deg)';
          }}
        >
          <div className="relative p-12">
            {/* Welcome Back Panel - Dashboard Emerald Theme */}
            <div 
              className="absolute top-0 right-0 px-12 py-16 welcome-panel-enter"
              style={{
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 70% 100%)',
                width: '50%',
                height: '100%',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.1) 100%)',
                backdropFilter: 'blur(25px) brightness(1.2)',
                WebkitBackdropFilter: 'blur(25px) brightness(1.2)',
                borderLeft: '1px solid rgba(16, 185, 129, 0.3)',
                boxShadow: 'inset 0 0 60px rgba(16, 185, 129, 0.05)',
                borderBottomLeftRadius: '120px',
                borderTopRightRadius: '24px',
                borderBottomRightRadius: '24px',
              }}
            >
              <div className="absolute top-12 right-12 text-right">
                <div className="flex justify-end mb-4">
                  <Leaf className="w-10 h-10 text-emerald-400 opacity-80" />
                </div>
                <h3 
                  className="text-3xl font-bold text-white leading-tight"
                  style={{
                    textShadow: '0 0 20px rgba(16, 185, 129, 0.8), 0 2px 10px rgba(0, 0, 0, 0.5)',
                    animation: 'pulse 3s ease-in-out infinite'
                  }}
                >
                  SIGRO <br />
                  <span className="text-emerald-300">FARMING</span>
                </h3>
              </div>
            </div>

            {/* Login Content */}
            <div className="relative z-10 login-content-enter" style={{ maxWidth: '55%' }}>
              <div className="flex items-center gap-2 mb-4">
                <Sprout className="w-6 h-6 text-emerald-400" />
                <span className="text-emerald-400 uppercase tracking-widest text-[10px] font-bold">Agriculture AI</span>
              </div>
              
              {/* Heading: Changed to solid White */}
              <h2 
                className="text-5xl font-bold text-white mb-16"
                style={{
                  textShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                  animation: 'fadeInUp 0.8s ease-out'
                }}
              >
                Login
              </h2>

              {/* Error/Success Messages */}
              {error && (
                <div 
                  className="px-4 py-3 rounded-xl mb-6 text-sm"
                  style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#fca5a5',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  {error}
                </div>
              )}

              {success && (
                <div 
                  className="px-4 py-3 rounded-xl mb-6 text-sm"
                  style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    color: '#a7f3d0',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  {success}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="relative group form-field">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 text-emerald-400 transition-all duration-300 group-focus-within:text-emerald-300 group-focus-within:scale-110">
                    <User size={18} />
                  </div>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    maxLength="10"
                    pattern="\d{10}"
                    className="w-full bg-transparent border-b-2 border-white/10 focus:border-emerald-400 text-white text-sm pl-7 pb-3 pt-1 outline-none transition-all duration-300 placeholder-white/30"
                    placeholder="Phone Number"
                  />
                  <div 
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-emerald-400 to-green-500 transition-all duration-300 origin-left"
                    style={{ width: formData.phoneNumber ? '100%' : '0%' }}
                  ></div>
                </div>

                <div className="relative group form-field">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 text-emerald-400 transition-all duration-300 group-focus-within:text-emerald-300 group-focus-within:scale-110">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent border-b-2 border-white/10 focus:border-emerald-400 text-white text-sm pl-7 pb-3 pt-1 outline-none transition-all duration-300 placeholder-white/30"
                    placeholder="Password"
                  />
                  <div 
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-emerald-400 to-green-500 transition-all duration-300 origin-left"
                    style={{ width: formData.password ? '100%' : '0%' }}
                  ></div>
                </div>

                <div className="pt-4 form-field">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full text-white font-bold text-sm py-4 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest relative overflow-hidden group shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.4) 0%, rgba(5, 150, 105, 0.4) 100%)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(16, 185, 129, 0.5)',
                    }}
                  >
                    <span className="relative z-10">{loading ? "Authenticating..." : "Login"}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </button>
                </div>
              </form>

              <div className="text-center mt-8" style={{ animation: 'fadeInUp 0.5s ease-out 0.8s forwards', opacity: 0 }}>
                <p className="text-white/50 text-sm">
                  New to Sigro?{" "}
                  <Link
                    to="/register"
                    className="text-emerald-400 hover:text-emerald-300 font-bold transition-all duration-300 hover:underline"
                    style={{ textShadow: '0 0 10px rgba(16, 185, 129, 0.3)' }}
                  >
                    Create Account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom reflection effect */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{
          background: 'linear-gradient(to top, rgba(2, 44, 34, 0.8), transparent)'
        }}
      ></div>
    </div>
  );
};

export default Login;