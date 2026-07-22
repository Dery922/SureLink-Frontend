// src/components/Chat/TypingIndicator.jsx
import React from "react";

const TypingIndicator = ({ agentName }) => {
  return (
    <div className="flex items-start gap-3 mb-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#0057FF] to-[#0066FF] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
        S
      </div>
      <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none border border-gray-200 shadow-sm">
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-400 mr-1">
            {agentName} is typing
          </span>
          <span className="flex gap-1">
            <span
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></span>
            <span
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></span>
            <span
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
