// src/components/chat/ChatDrawer.jsx
import { useState } from "react";
import { X, Search, Settings } from "lucide-react";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";

export default function ChatDrawer({ onClose }) {
  const [activeChat, setActiveChat] = useState(null);

  return (
    <div className="w-96 h-[600px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col animate-slideUp">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Messages
        </h3>
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Settings size={18} className="text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={18} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search conversations"
            className="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeChat ? (
          <ChatWindow chat={activeChat} onBack={() => setActiveChat(null)} />
        ) : (
          <ChatList onSelectChat={setActiveChat} />
        )}
      </div>
    </div>
  );
}
