// src/components/Chat/ChatHeader.jsx
import React from "react";
import {
  FaTimes,
  FaMinus,
  FaChevronDown,
  FaChevronUp,
  FaUser,
  FaHeadset,
  FaCheckCircle,
} from "react-icons/fa";

const ChatHeader = ({
  agent,
  onClose,
  onMinimize,
  onShowAgentInfo,
  showAgentInfo,
}) => {
  return (
    <div className="bg-gradient-to-r from-[#0057FF] to-[#0066FF] p-4 text-white">
      <div className="flex items-center justify-between">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={onShowAgentInfo}
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              {agent.avatar ? (
                <img
                  src={agent.avatar}
                  alt={agent.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <FaHeadset className="text-xl" />
              )}
            </div>
            {agent.online && (
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white"></span>
            )}
          </div>
          <div>
            <p className="font-bold text-sm">{agent.name}</p>
            <p className="text-xs text-blue-100 flex items-center gap-1">
              <FaCheckCircle className="text-green-300 text-[10px]" />
              {agent.online ? "Online" : "Away"} • {agent.responseTime}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onMinimize}
            className="w-8 h-8 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center"
          >
            <FaMinus className="text-sm" />
          </button>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center"
          >
            <FaTimes className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
