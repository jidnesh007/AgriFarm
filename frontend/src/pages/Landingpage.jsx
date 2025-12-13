import React, { useEffect, useState } from 'react';
import { Menu, X, ChevronRight, Leaf, Droplets, TrendingUp, Users, Target, Award } from 'lucide-react';

// Navbar Component
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-white/95 shadow-md'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-lime-400 rounded-lg flex items-center justify-center">
              <Leaf className="w-6 h-6 text-green-900" />
            </div>
            <span className="text-2xl font-bold text-green-900">SigroTech</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-green-900 hover:text-lime-500 font-medium transition">Home</a>
            <a href="#about" className="text-green-900 hover:text-lime-500 font-medium transition">About</a>
            <a href="#services" className="text-green-900 hover:text-lime-500 font-medium transition">Services</a>
            <a href="#contact" className="text-green-900 hover:text-lime-500 font-medium transition">Contact</a>
            <button className="bg-lime-400 text-green-900 px-6 py-3 rounded-full font-semibold hover:bg-lime-500 transition transform hover:scale-105">
              Get Started
            </button>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-green-900">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 pt-4 pb-6 space-y-4">
            <a href="#home" className="block text-green-900 hover:text-lime-500 font-medium">Home</a>
            <a href="#about" className="block text-green-900 hover:text-lime-500 font-medium">About</a>
            <a href="#services" className="block text-green-900 hover:text-lime-500 font-medium">Services</a>
            <a href="#contact" className="block text-green-900 hover:text-lime-500 font-medium">Contact</a>
            <button className="w-full bg-lime-400 text-green-900 px-6 py-3 rounded-full font-semibold">
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

// Hero Section
const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80" 
          alt="Agriculture" 
          className="w-full h-full object-cover brightness-75"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
              Bring Growth to <span className="text-lime-400">Fresh Agriculture</span>
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Transform your farming with cutting-edge technology. Increase yields, reduce costs, and cultivate a sustainable future with our innovative agricultural solutions.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-lime-400 text-green-900 px-8 py-4 rounded-full font-semibold hover:bg-lime-500 transition transform hover:scale-105 flex items-center">
                Explore Now <ChevronRight className="ml-2" />
              </button>
              <button className="bg-white/20 backdrop-blur-sm text-white border-2 border-white px-8 py-4 rounded-full font-semibold hover:bg-white/30 transition">
                Learn More
              </button>
            </div>
          </div>

          <div className="relative animate-slide-in">
            <img 
              src="https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&q=80" 
              alt="Farmer with drone" 
              className="rounded-3xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl max-w-xs">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-lime-400 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-green-900" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Crop Yield</p>
                  <p className="text-2xl font-bold text-green-900">+45%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// About Section
const About = () => {
  return (
    <section id="about" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-4xl lg:text-5xl font-bold text-green-900 mb-4">
            About Our Mission
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Pioneering sustainable agriculture through innovation and technology
          </p>
        </div>

        <p className="text-center text-gray-700 text-lg max-w-4xl mx-auto mb-16 leading-relaxed">
          At SigroTech, we're revolutionizing farming by combining advanced technology with traditional agricultural wisdom. Our mission is to empower farmers with tools that enhance productivity while preserving our planet.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&q=80',
            'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600&q=80',
            'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&q=80'
          ].map((img, i) => (
            <div key={i} className="animate-zoom-in" style={{animationDelay: `${i * 0.1}s`}}>
              <img 
                src={img} 
                alt={`Agriculture ${i + 1}`} 
                className="rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:scale-105 w-full h-64 object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Empower Section
const EmpowerAgriculture = () => {
  const features = [
    { icon: Target, title: 'Precision Farming', desc: 'Data-driven insights for optimal crop management' },
    { icon: Droplets, title: 'Smart Irrigation', desc: 'Automated water management systems' },
    { icon: TrendingUp, title: 'Yield Optimization', desc: 'Maximize output with minimal resources' }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-fade-right">
            <h2 className="text-4xl lg:text-5xl font-bold text-green-900 leading-tight">
              Empower Your <span className="text-lime-500">Agriculture</span> Business
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              Leverage cutting-edge technology to transform your farming operations. Our integrated solutions provide real-time monitoring, predictive analytics, and automated controls to maximize efficiency and profitability.
            </p>
            
            <div className="space-y-6">
              {features.map((feature, i) => (
                <div key={i} className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition">
                  <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-green-900" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900 text-lg mb-1">{feature.title}</h3>
                    <p className="text-gray-600">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 animate-fade-left">
            <img 
              src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=80" 
              alt="Field" 
              className="rounded-2xl shadow-lg col-span-2 h-64 object-cover"
            />
            <img 
              src="https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&q=80" 
              alt="Technology" 
              className="rounded-2xl shadow-lg h-48 object-cover"
            />
            <img 
              src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&q=80" 
              alt="Farming" 
              className="rounded-2xl shadow-lg h-48 object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// Growing Innovation Section
const GrowingInnovation = () => {
  const stats = [
    { value: '40%', label: 'Cost Reduction' },
    { value: '80%', label: 'Water Saved' },
    { value: '95%', label: 'Client Satisfaction' }
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden animate-fade-up">
          <div className="grid lg:grid-cols-2">
            <img 
              src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&q=80" 
              alt="Tractor" 
              className="w-full h-full object-cover"
            />
            <div className="p-12 flex flex-col justify-center">
              <h2 className="text-4xl font-bold text-green-900 mb-6">
                Growing Through Innovation
              </h2>
              <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                Our advanced agricultural solutions have helped thousands of farmers increase productivity while reducing environmental impact.
              </p>
              
              <div className="grid grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-3xl font-bold text-lime-500 mb-2">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-8">
          {[
            'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=400&q=80',
            'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&q=80',
            'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&q=80',
            'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400&q=80'
          ].map((img, i) => (
            <img 
              key={i}
              src={img} 
              alt={`Feature ${i + 1}`} 
              className="rounded-xl shadow-md h-24 w-full object-cover hover:scale-105 transition"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Explore Section
const ExploreSigro = () => {
  const tiles = [
    { title: 'Smart Farming Solutions', img: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80' },
    { title: 'Sustainable Practices', img: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80' },
    { title: 'Advanced Analytics', img: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&q=80' }
  ];

  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-4xl lg:text-5xl font-bold text-green-900 mb-4">
            Explore SigroTech Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive technology for modern agriculture
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {tiles.map((tile, i) => (
            <div key={i} className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition animate-zoom-in" style={{animationDelay: `${i * 0.1}s`}}>
              <img 
                src={tile.img} 
                alt={tile.title} 
                className="w-full h-96 object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <h3 className="text-white text-2xl font-bold p-8">{tile.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Discover Solutions Section
const DiscoverSolutions = () => {
  const solutions = [
    { icon: TrendingUp, title: 'Increase Crop Yield', desc: 'Optimize growth with precision agriculture' },
    { icon: Droplets, title: 'Reduce Water Usage', desc: 'Smart irrigation for sustainable farming' },
    { icon: Leaf, title: 'Improve Soil Health', desc: 'Data-driven soil management solutions' }
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-4xl lg:text-5xl font-bold text-green-900 mb-4">
            Discover Sigro Solutions
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {solutions.map((solution, i) => (
            <div 
              key={i} 
              className="bg-lime-400 rounded-2xl p-8 flex items-center justify-between hover:bg-lime-500 transition transform hover:scale-105 cursor-pointer animate-fade-up"
              style={{animationDelay: `${i * 0.1}s`}}
            >
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-green-900 rounded-xl flex items-center justify-center">
                  <solution.icon className="w-8 h-8 text-lime-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-green-900 mb-2">{solution.title}</h3>
                  <p className="text-green-800">{solution.desc}</p>
                </div>
              </div>
              <ChevronRight className="w-8 h-8 text-green-900" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  return (
    <footer id="contact" className="bg-green-950 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-lime-400 rounded-lg flex items-center justify-center">
                <Leaf className="w-6 h-6 text-green-900" />
              </div>
              <span className="text-2xl font-bold">SigroTech</span>
            </div>
            <p className="text-gray-400">
              Transforming agriculture with innovation and technology.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-lime-400 transition">About Us</a></li>
              <li><a href="#" className="hover:text-lime-400 transition">Careers</a></li>
              <li><a href="#" className="hover:text-lime-400 transition">Blog</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-lime-400 transition">Help Center</a></li>
              <li><a href="#" className="hover:text-lime-400 transition">Contact Us</a></li>
              <li><a href="#" className="hover:text-lime-400 transition">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Get in Touch</h3>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="flex-1 px-4 py-3 rounded-l-full bg-green-900 text-white placeholder-gray-400 focus:outline-none"
              />
              <button className="bg-lime-400 text-green-900 px-6 py-3 rounded-r-full font-semibold hover:bg-lime-500 transition">
                Send
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-green-900 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 SigroTech. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-lime-400 transition">Facebook</a>
            <a href="#" className="text-gray-400 hover:text-lime-400 transition">Twitter</a>
            <a href="#" className="text-gray-400 hover:text-lime-400 transition">Instagram</a>
            <a href="#" className="text-gray-400 hover:text-lime-400 transition">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main App
export default function App() {
  return (
    <div className="font-sans">
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-right {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fade-left {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes zoom-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
        .animate-slide-in { animation: slide-in 0.8s ease-out; }
        .animate-fade-up { animation: fade-up 0.6s ease-out; }
        .animate-fade-right { animation: fade-right 0.8s ease-out; }
        .animate-fade-left { animation: fade-left 0.8s ease-out; }
        .animate-zoom-in { animation: zoom-in 0.6s ease-out; }
      `}</style>
      
      <Navbar />
      <Hero />
      <About />
      <EmpowerAgriculture />
      <GrowingInnovation />
      <ExploreSigro />
      <DiscoverSolutions />
      <Footer />
    </div>
  );
}