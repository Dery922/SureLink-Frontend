// src/components/chat/ChatToggle.jsx
import { MessageCircle } from "lucide-react";

export default function ChatToggle({ onClick }) {
  const unreadCount = 3; // Mock unread count

  return (
    <button
      onClick={onClick}
      className="relative group flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-3 shadow-lg transition-all duration-200 hover:shadow-xl"
    >
      <MessageCircle size={20} />
      <span className="text-sm font-medium">Messages</span>

      {/* Unread Badge */}
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </button>
  );
}
