// src/components/Chat/SupportAgentCard.jsx
import React from "react";
import {
  FaTimes,
  FaStar,
  FaStarHalfAlt,
  FaCheckCircle,
  FaClock,
  FaAward,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";

const SupportAgentCard = ({ agent, onClose }) => {
  return (
    <div className="absolute inset-0 bg-white z-10 animate-slideRight">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-bold text-lg text-gray-800">Support Agent</h3>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
        >
          <FaTimes className="text-gray-500 text-sm" />
        </button>
      </div>

      <div className="p-6">
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <img
              src={agent.avatar}
              alt={agent.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-[#0057FF]/20"
            />
            {agent.online && (
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></span>
            )}
          </div>
          <h4 className="font-bold text-xl text-gray-800 mt-3">{agent.name}</h4>
          <p className="text-sm text-[#0057FF] font-medium">{agent.role}</p>

          <div className="flex items-center gap-1 mt-2">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-sm" />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700 ml-1">
              {agent.rating}
            </span>
          </div>

          <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <FaCheckCircle className="text-green-500" />
              {agent.totalResolved} resolved
            </span>
            <span className="flex items-center gap-1">
              <FaClock className="text-blue-500" />
              {agent.responseTime}
            </span>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-6">
          <h5 className="font-semibold text-gray-700 mb-3">
            Contact Information
          </h5>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-[#0057FF]">
                <FaPhone />
              </div>
              <div>
                <p className="text-xs text-gray-400">Phone</p>
                <p className="font-medium">+233 24 123 4567</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-[#0057FF]">
                <FaEnvelope />
              </div>
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="font-medium">support@surelink.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 rounded-xl p-4">
          <p className="text-sm text-gray-600 flex items-start gap-2">
            <FaAward className="text-[#0057FF] mt-0.5" />
            <span>
              <span className="font-medium">Top Rated Agent</span> —{agent.name}{" "}
              has been recognized for exceptional customer service
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupportAgentCard;
