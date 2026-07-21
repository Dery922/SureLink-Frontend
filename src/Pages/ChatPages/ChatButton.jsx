// src/components/Chat/ChatButton.jsx
import React, { useState, useEffect } from "react";
import { FaComments, FaTimes, FaHeadset, FaChevronUp } from "react-icons/fa";
import ChatWindow from "./ChatWindow";

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  // Check for unread messages (simulated)
  useEffect(() => {
    // In real app, this would check for unread messages
    const unreadCheck = setInterval(() => {
      // Simulate unread messages
      if (!isOpen && Math.random() > 0.8) {
        setHasUnread(true);
      }
    }, 30000);

    return () => clearInterval(unreadCheck);
  }, [isOpen]);

  // Hide tooltip after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (hasUnread) setHasUnread(false);
    if (isMinimized) setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (isOpen) {
    return (
      <>
        <ChatWindow
          onClose={toggleChat}
          onMinimize={toggleMinimize}
          isMinimized={isMinimized}
        />
      </>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      {/* Tooltip */}
      {showTooltip && (
        <div className="mb-3 bg-gray-800 text-white text-sm px-4 py-2 rounded-xl shadow-lg animate-bounce relative">
          <span className="flex items-center gap-2">
            <FaHeadset className="text-blue-400" />
            Need help? Chat with us!
          </span>
          <div className="absolute -bottom-1 right-4 w-3 h-3 bg-gray-800 transform rotate-45"></div>
        </div>
      )}

      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className="relative w-16 h-16 rounded-full bg-gradient-to-r from-[#0057FF] to-[#0066FF] text-white shadow-2xl hover:shadow-[#0057FF]/50 transition-all duration-300 hover:scale-110 group"
      >
        {/* Pulse animation */}
        <span className="absolute inset-0 rounded-full bg-[#0057FF] animate-ping opacity-75"></span>

        {/* Icon */}
        <div className="relative flex items-center justify-center w-full h-full">
          <FaComments className="text-2xl group-hover:rotate-12 transition-transform" />
        </div>

        {/* Unread badge */}
        {hasUnread && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            1
          </span>
        )}
      </button>
    </div>
  );
};

export default ChatButton;
