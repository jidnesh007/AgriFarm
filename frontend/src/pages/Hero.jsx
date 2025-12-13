import React from "react";
import { ArrowUpRight, Cloud, MapPin, Calendar } from "lucide-react";

const HeroSection = () => {
  // Smooth scroll function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1600&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navbar */}
        <nav className="flex items-center justify-between px-8 py-5 bg-white/95 backdrop-blur-sm">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Sigro</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollToSection('about')}
              className="px-5 py-2 text-sm font-medium text-gray-900 rounded-full border border-gray-900 hover:bg-gray-100 transition"
            >
              About Us
            </button>
            <a
              href="#membership"
              className="px-5 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition"
            >
              Membership
            </a>
            <a
              href="#shop"
              className="px-5 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition"
            >
              Shop
            </a>
            <a
              href="#article"
              className="px-5 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition"
            >
              Article
            </a>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition">
              <Calendar size={20} className="text-gray-900" />
            </button>
            <button
              onClick={() => scrollToSection('footer')}
              className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-medium rounded-full hover:bg-green-700 transition"
            >
              Contact Us
              <ArrowUpRight size={16} />
            </button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="px-8 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Side - Widgets */}
              <div className="space-y-6">
                {/* Location Widget */}
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg max-w-sm">
                  <div className="flex items-start gap-2 mb-4">
                    <MapPin size={18} className="text-gray-600 mt-1" />
                    <p className="text-sm text-gray-600">
                      Jakartra, Green GC 98765, Indonesia
                    </p>
                  </div>

                  {/* Weather Card */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <MapPin size={14} />
                          Jakartra, Indonesia
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-bold text-gray-900">
                            +18°C
                          </span>
                          <div className="text-xs text-gray-600">
                            <p>
                              H: <span className="font-semibold">26°C</span>
                            </p>
                            <p>
                              L: <span className="font-semibold">16°C</span>
                            </p>
                          </div>
                        </div>
                      </div>
                      <Cloud size={48} className="text-yellow-400" />
                    </div>

                    {/* Weather Stats Grid */}
                    <div className="grid grid-cols-4 gap-3 pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Humidity</p>
                        <p className="text-sm font-bold text-gray-900">40%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Precipitation
                        </p>
                        <p className="text-sm font-bold text-gray-900">
                          5.1 ml
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Pressure</p>
                        <p className="text-sm font-bold text-gray-900">
                          450 hPa
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Wind</p>
                        <p className="text-sm font-bold text-gray-900">
                          23 m/s
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Growth Chart Widget */}
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg max-w-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">
                        Growth
                      </h4>
                      <p className="text-2xl font-bold text-gray-900">0.80</p>
                    </div>
                    <div className="flex gap-2 text-xs text-gray-500">
                      <span className="cursor-pointer hover:text-gray-900">
                        W
                      </span>
                      <span className="cursor-pointer hover:text-gray-900 font-semibold text-gray-900">
                        M
                      </span>
                      <span className="cursor-pointer hover:text-gray-900">
                        Y
                      </span>
                    </div>
                  </div>

                  {/* Bar Chart */}
                  <div className="flex items-end justify-between gap-1 h-32">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-green-500 to-green-400 rounded-t"
                        style={{
                          height: `${Math.random() * 100}%`,
                          opacity: i < 10 ? 0.3 : 1,
                        }}
                      ></div>
                    ))}
                  </div>

                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>January, 01</span>
                    <span>July, 01</span>
                  </div>
                </div>

                {/* Membership Badge */}
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <img
                      src="https://i.pravatar.cc/100?img=1"
                      alt="Member"
                      className="w-10 h-10 rounded-full border-2 border-white"
                    />
                    <img
                      src="https://i.pravatar.cc/100?img=2"
                      alt="Member"
                      className="w-10 h-10 rounded-full border-2 border-white"
                    />
                    <img
                      src="https://i.pravatar.cc/100?img=3"
                      alt="Member"
                      className="w-10 h-10 rounded-full border-2 border-white"
                    />
                    <img
                      src="https://i.pravatar.cc/100?img=4"
                      alt="Member"
                      className="w-10 h-10 rounded-full border-2 border-white"
                    />
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-red-500"></div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">
                      12k + Membership
                    </p>
                    <p className="text-xs text-white/80">
                      Enjoy our facilities
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Side - Hero Text */}
              <div className="flex flex-col justify-center items-start">
                <div className="mb-6">
                  <span className="inline-block px-4 py-1.5 bg-lime-300 text-xs font-semibold text-gray-900 rounded-full mb-6">
                    WELCOME TO SIRGO
                  </span>
                  <h1 className="text-7xl font-bold text-white leading-tight mb-6">
                    Bring Growth
                    <br />
                    Fresh Agricultur
                  </h1>
                  <p className="text-lg text-white/90 mb-8 max-w-md">
                    Experience the ultimate golfing journey with expert tips,
                    <br />
                    premium gear, and professional insights.
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-4">
                  <button className="flex items-center gap-2 px-8 py-3.5 bg-white text-gray-900 text-sm font-semibold rounded-full hover:bg-gray-100 transition shadow-lg">
                    Join Now
                    <ArrowUpRight size={18} />
                  </button>
                  <button className="flex items-center gap-2 px-8 py-3.5 bg-gray-900/50 backdrop-blur-sm text-white text-sm font-semibold rounded-full hover:bg-gray-900/70 transition border border-white/20">
                    Learn Services
                    <ArrowUpRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
