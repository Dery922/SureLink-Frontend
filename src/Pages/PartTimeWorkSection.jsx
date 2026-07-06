// components/PartTimeWorkSection.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PartTimeTicker from "../components/PartTimeWorkCard";

function PartTimeWorkSection() {
  return (
    <section className="bg-[#F5F8FF] py-12 md:py-16">
      <div className="max-w-[1280px] mx-auto px-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl md:text-2xl font-bold text-[#1A1A1A]">
                🔥 Part-Time Work
              </h2>
              <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                LIVE
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Scroll through live opportunities • Updated in real-time
            </p>
          </div>
          <Link
            to="/part-time/all"
            className="text-sm text-[#0057FF] hover:underline flex items-center gap-1 whitespace-nowrap"
          >
            View all
            <i className="fa-solid fa-arrow-right text-xs"></i>
          </Link>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-[#E8F0FF] text-center hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-[#0057FF]">156</div>
            <div className="text-xs text-gray-500">Active Opportunities</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-[#E8F0FF] text-center hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-red-500">12</div>
            <div className="text-xs text-gray-500">Urgent Jobs</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-[#E8F0FF] text-center hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-[#00A86B]">89</div>
            <div className="text-xs text-gray-500">Active Providers</div>
          </div>
        </div>

        {/* Ticker Component - This replaces the card grid */}
        <PartTimeTicker />

        {/* Quick Action for Providers */}
        <div className="mt-6 text-center">
          <Link
            to="/provider/create-part-time"
            className="inline-flex items-center gap-2 bg-[#0057FF] text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-[#0057FF]/20"
          >
            <i className="fa-solid fa-plus"></i>
            Post a Part-Time Opportunity
          </Link>
          <p className="text-xs text-gray-400 mt-2">
            Providers: Find skilled workers for your projects
          </p>
        </div>
      </div>
    </section>
  );
}

export default PartTimeWorkSection;
