import React from "react";
import { Home, Calendar, Headphones, UserCircle } from "lucide-react";

const AboutSection = () => {
  return (
    <section className="bg-gray-50 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Top Label */}
        <div className="mb-8">
          <p className="flex items-center gap-2 text-sm text-gray-600">
            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
            About Us
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Images */}
          <div className="flex gap-4">
            <div
              className="w-56 h-64 rounded-3xl bg-cover bg-center shadow-lg"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=80')",
              }}
            ></div>
            <div
              className="w-56 h-64 rounded-3xl bg-cover bg-center shadow-lg"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&q=80')",
              }}
            ></div>
          </div>

          {/* Right Side - Content */}
          <div>
            <h2 className="text-5xl font-bold leading-tight mb-8">
              <span className="text-gray-900">Amidst the </span>
              <span className="text-gray-400">
                advancements in agricultural technology, the prevalence of
                traditional farming methods, with their inherent{" "}
              </span>
              <span className="text-gray-900">
                labor-intensive characteristics.
              </span>
            </h2>

            {/* Feature Icons Grid */}
            <div className="grid grid-cols-4 gap-6 mt-12">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-3">
                  <Home className="text-gray-700" size={24} />
                </div>
                <p className="text-sm font-medium text-gray-900">
                  AgriMonitor
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-3">
                  <Calendar className="text-gray-700" size={24} />
                </div>
                <p className="text-sm font-medium text-gray-900">StockSure</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-3">
                  <Headphones className="text-gray-700" size={24} />
                </div>
                <p className="text-sm font-medium text-gray-900">CapAid</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-3">
                  <UserCircle className="text-gray-700" size={24} />
                </div>
                <p className="text-sm font-medium text-gray-900">Assistant</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
