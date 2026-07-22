// src/components/Chat/ChatInput.jsx
import React from "react";
import { FaPaperPlane, FaPaperclip, FaSmile } from "react-icons/fa";

const ChatInput = ({
  newMessage,
  setNewMessage,
  onSend,
  onFileUpload,
  fileInputRef,
  isTyping,
}) => {
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="border-t border-gray-200 p-3 bg-white">
      <div className="flex items-center gap-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="text-gray-400 hover:text-[#0057FF] transition-colors p-2 hover:bg-gray-100 rounded-full"
          disabled={isTyping}
        >
          <FaPaperclip className="text-sm" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileUpload}
          className="hidden"
          accept="image/*,.pdf,.txt"
        />

        <div className="flex-1 relative">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0057FF] resize-none text-sm min-h-[44px] max-h-[100px] bg-gray-50 focus:bg-white transition-colors"
            rows={1}
            disabled={isTyping}
          />
        </div>

        <button
          onClick={onSend}
          disabled={!newMessage.trim() || isTyping}
          className={`p-2.5 rounded-xl transition-all ${
            newMessage.trim() && !isTyping
              ? "bg-[#0057FF] text-white hover:bg-blue-700 shadow-lg shadow-blue-200"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          <FaPaperPlane className="text-sm" />
        </button>
      </div>

      <div className="flex items-center justify-between mt-1.5 px-1">
        <p className="text-xs text-gray-400">
          <span className="font-medium">Support</span> • Usually replies in 2-5
          minutes
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span>
            Online
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
