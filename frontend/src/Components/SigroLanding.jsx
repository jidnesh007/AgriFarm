import React from "react";

const SigroLanding = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Hero Section */}
      <header className="flex justify-between items-start gap-10 mb-8">
        <div className="flex-[2]">
          <p className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
            Our Sustainable Products
          </p>
          <h1 className="text-5xl font-bold leading-tight text-gray-900">
            Explore Sigro Tech
            <br />
            Revolutionizing{" "}
            <span className="text-gray-500">Agriculture</span>
            <br />
            And Food.
          </h1>
        </div>

        <div className="flex-1 max-w-xs">
          <p className="text-sm text-gray-600 leading-relaxed">
            Become part of a supportive community dedicated to fostering
            innovation in agriculture. Engage in discussions, ask questions.
          </p>
        </div>
      </header>

      {/* Product Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        <div className="flex flex-col gap-2">
          <div
            className="h-48 rounded-3xl bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=80')",
            }}
          ></div>
          <p className="text-sm font-medium text-gray-900">Organic Fertilizer</p>
        </div>

        <div className="flex flex-col gap-2">
          <div
            className="h-48 rounded-3xl bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&q=80')",
            }}
          ></div>
          <p className="text-sm font-medium text-gray-900">Technology Irrigation</p>
        </div>

        <div className="flex flex-col gap-2">
          <div
            className="h-48 rounded-3xl bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&q=80')",
            }}
          ></div>
          <p className="text-sm font-medium text-gray-900">Agricultural Monitoring</p>
        </div>
      </section>

      {/* Middle Section */}
      <section className="max-w-2xl mb-6">
        <h2 className="text-4xl font-bold text-gray-900 leading-tight mb-3">
          Discover Sirgo Modern
          <br />
          Farming Solutions.
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          At Sirgo, we offer innovative services to revolutionize modern
          agriculture, helping you maximize productivity, minimize environmental
          impact, and achieve sustainable growth.
        </p>
      </section>

      {/* Benefits List */}
<section className="max-w-3xl mt-16">
  <p className="flex items-center gap-2 text-sm text-gray-600 mb-6">
    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
    Benefits Of Sirgo
  </p>

  <div className="space-y-3">
    <div className="flex items-center justify-between px-8 py-5 rounded-3xl bg-lime-200 cursor-pointer">
      <div className="flex items-center gap-6">
        <span className="text-gray-600 font-medium text-base">01</span>
        <span className="font-bold text-2xl text-gray-900">
          Increase Crop Yield
        </span>
      </div>
      <span className="text-2xl text-gray-900 font-light">→</span>
    </div>

    <div className="flex items-center justify-between px-8 py-5 rounded-3xl bg-white border border-gray-100 hover:bg-gray-50 cursor-pointer transition">
      <div className="flex items-center gap-6">
        <span className="text-gray-600 font-medium text-base">02</span>
        <span className="font-bold text-2xl text-gray-900">
          Reduce Water Usage
        </span>
      </div>
      <span className="text-2xl text-gray-900 font-light">→</span>
    </div>

    <div className="flex items-center justify-between px-8 py-5 rounded-3xl bg-white border border-gray-100 hover:bg-gray-50 cursor-pointer transition">
      <div className="flex items-center gap-6">
        <span className="text-gray-600 font-medium text-base">03</span>
        <span className="font-bold text-2xl text-gray-900">
          Improve Soil Health
        </span>
      </div>
      <span className="text-2xl text-gray-900 font-light">→</span>
    </div>
  </div>
</section>

    </div>
  );
};

export default SigroLanding;
