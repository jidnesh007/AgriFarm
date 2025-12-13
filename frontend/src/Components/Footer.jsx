import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#0d1f1c] text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pb-12 border-b border-gray-700">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold">Sigro</span>
            </div>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              We are custom home builder located in Dallas, TX
              <br />
              servicing Highland Park, Buffview & Preston Hollow!
            </p>
            {/* Social Icons */}
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center cursor-pointer transition">
                <Facebook size={18} />
              </div>
              <div className="w-9 h-9 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center cursor-pointer transition">
                <Twitter size={18} />
              </div>
              <div className="w-9 h-9 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center cursor-pointer transition">
                <Instagram size={18} />
              </div>
              <div className="w-9 h-9 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center cursor-pointer transition">
                <Linkedin size={18} />
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-white">COMPANY</h3>
            <ul className="space-y-2.5">
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Resource Links */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-white">RESOURCE</h3>
            <ul className="space-y-2.5">
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition">
                  Customer Stories
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition">
                  Information
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition">
                  Legal
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition">
                  Payments
                </a>
              </li>
            </ul>
          </div>

          {/* Career Links */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-white">CAREER</h3>
            <ul className="space-y-2.5">
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition">
                  Jobs
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition">
                  Hiring
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition">
                  News
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition">
                  Tips & Tricks
                </a>
              </li>
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-white">HELP</h3>
            <ul className="space-y-2.5">
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition">
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Middle Section - Get In Touch */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-12 border-b border-gray-700">
          {/* Newsletter */}
          <div>
            <h2 className="text-4xl font-bold mb-3">Get In Touch!</h2>
            <p className="text-sm text-gray-400 mb-2">
              have questions or need assistance?
            </p>
            <p className="text-sm text-gray-400 mb-6">We're here to help!</p>
            
            <div className="relative max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-6 py-3.5 pr-32 rounded-full bg-white text-gray-900 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button className="absolute right-1 top-1 bottom-1 px-6 bg-green-600 hover:bg-green-700 text-white rounded-full text-sm font-medium transition">
                Subscribe
              </button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-xs font-semibold text-gray-400 mb-3 tracking-wider">
                ADDRESS
              </h4>
              <p className="text-sm text-white">
                1901 Thornridge Cir.
                <br />
                Shiloh, Hawaii 81063
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-gray-400 mb-3 tracking-wider">
                PHONE
              </h4>
              <p className="text-sm text-white">(603) 875-2983</p>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-gray-400 mb-3 tracking-wider">
                ADDRESS
              </h4>
              <p className="text-sm text-white">
                1901 Thornridge Cir.
                <br />
                Shiloh, Hawaii
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-gray-400 mb-3 tracking-wider">
                EMAIL
              </h4>
              <p className="text-sm text-white">hello.sirgo@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Bottom Section - Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6">
          <p className="text-xs text-gray-400">
            © Copyright 2025, Arsgotou All Rights Reserved
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-xs text-gray-400 hover:text-white transition">
              FAQ
            </a>
            <a href="#" className="text-xs text-gray-400 hover:text-white transition">
              Term of Service
            </a>
            <a href="#" className="text-xs text-gray-400 hover:text-white transition">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
