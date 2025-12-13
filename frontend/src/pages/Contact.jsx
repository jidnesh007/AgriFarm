import React from "react";
import { Cloud, Sprout, Droplet } from "lucide-react";

const ContactSection = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Top Navigation Pills */}
        <div className="flex gap-3 mb-6">
          <button className="px-5 py-2 bg-green-600 text-white text-sm font-medium rounded-full hover:bg-green-700 transition">
            Benefits
          </button>
          <button className="px-5 py-2 bg-white text-gray-700 text-sm font-medium rounded-full hover:bg-gray-100 transition border border-gray-200">
            Vintage
          </button>
          <button className="px-5 py-2 bg-white text-gray-700 text-sm font-medium rounded-full hover:bg-gray-100 transition border border-gray-200">
            Solutions
          </button>
          <button className="px-5 py-2 bg-white text-gray-700 text-sm font-medium rounded-full hover:bg-gray-100 transition border border-gray-200">
            Limited
          </button>
        </div>

        {/* Top Section - Empower Agriculture */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Left Side - Text Content */}
          <div className="flex flex-col justify-center">
            <p className="text-sm text-gray-600 mb-4">+ Connect With Us</p>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Empower
              <br />
              Agriculture
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed mb-8">
              Become part of a supportive community dedicated to
              <br />
              fostering innovation in agriculture. Engage in discussions,
              <br />
              ask questions, and share your experiences with fellow enthusiasts
              <br />
              and experts.
            </p>
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            </div>
          </div>

          {/* Right Side - Image Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 relative">
              <div
                className="h-64 rounded-3xl bg-cover bg-center relative"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80')",
                }}
              >
                {/* Weather Widget */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg">
                  <div className="flex items-start gap-3">
                    <Cloud className="text-yellow-500" size={32} />
                    <div>
                      <p className="text-3xl font-bold text-gray-900">-18°C</p>
                      <p className="text-xs text-gray-600">Cloudy</p>
                    </div>
                    <div className="ml-4 text-xs text-gray-600">
                      <p>18°</p>
                      <p>High: 24°</p>
                      <p>Low: 18°</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="h-40 rounded-3xl bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&q=80')",
              }}
            ></div>
            <div
              className="h-40 rounded-3xl bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&q=80')",
              }}
            ></div>
          </div>
        </div>

        {/* Bottom Section - Growing Innovation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Large Image with Overlay Card */}
          <div className="relative">
            <div
              className="h-96 rounded-3xl bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80')",
              }}
            ></div>

            {/* Overlay Card - Knock Knock */}
            <div className="absolute bottom-6 left-6 right-6 bg-white rounded-3xl p-6 shadow-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Knock Knock!
                <br />
                You've Stepped
                <br />
                Into Our Zone!
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Here's what you should know:
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-green-600">○</span> Follow the Travel
                  Route.
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-green-600">○</span> Complete the Field
                  4
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-green-600">○</span> Join Our Team Left
                </li>
              </ul>
              <button className="w-full py-3 bg-green-600 text-white text-sm font-medium rounded-full hover:bg-green-700 transition">
                Contact Our Team →
              </button>
            </div>
          </div>

          {/* Right Side - Content */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Growing Innovation
            </h2>
            <p className="text-sm text-gray-600 mb-8">
              Join today to make Find industry new greener and awesome for the
              future
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-lime-100 rounded-2xl p-5">
                <Sprout className="text-green-600 mb-2" size={32} />
                <p className="text-3xl font-bold text-gray-900 mb-1">50%</p>
                <p className="text-xs text-gray-600">
                  Increase in crop
                  <br />
                  yield using our
                  <br />
                  solutions
                </p>
              </div>

              <div className="bg-lime-100 rounded-2xl p-5">
                <Droplet className="text-green-600 mb-2" size={32} />
                <p className="text-3xl font-bold text-gray-900 mb-1">45%</p>
                <p className="text-xs text-gray-600">
                  Reduction in
                  <br />
                  Water
                  <br />
                  consumption
                </p>
              </div>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div
                className="h-32 rounded-2xl bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=300&q=80')",
                }}
              ></div>
              <div
                className="h-32 rounded-2xl bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=300&q=80')",
                }}
              ></div>
              <div
                className="h-32 rounded-2xl bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=300&q=80')",
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
