// src/components/chat/ChatWindow.jsx
import { useState } from "react";
import { ArrowLeft, MoreVertical, Paperclip, Send } from "lucide-react";

// Mock messages
const mockMessages = [
  { id: 1, sender: "them", message: "Hey! How's it going?", time: "10:30 AM" },
  {
    id: 2,
    sender: "me",
    message: "Great! Working on the new project",
    time: "10:32 AM",
  },
  {
    id: 3,
    sender: "them",
    message: "That sounds exciting! Can you tell me more?",
    time: "10:33 AM",
  },
  {
    id: 4,
    sender: "me",
    message: "Sure! We're building a new chat feature",
    time: "10:35 AM",
  },
  {
    id: 5,
    sender: "them",
    message: "Amazing! Let me know if you need any help",
    time: "10:36 AM",
  },
];

export default function ChatWindow({ chat, onBack }) {
  const [message, setMessage] = useState("");
  const [messages] = useState(mockMessages);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    console.log("Sending:", message);
    setMessage("");
  };

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <button
          onClick={onBack}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors lg:hidden"
        >
          <ArrowLeft size={18} className="text-gray-600 dark:text-gray-400" />
        </button>
        <img
          src={chat.avatar}
          alt={chat.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
            {chat.name}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {chat.online ? "Online" : "Last seen recently"}
          </p>
        </div>
        <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <MoreVertical
            size={18}
            className="text-gray-600 dark:text-gray-400"
          />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                msg.sender === "me"
                  ? "bg-blue-600 text-white rounded-tr-sm"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-tl-sm"
              }`}
            >
              <p className="text-sm">{msg.message}</p>
              <span
                className={`text-xs mt-1 block ${
                  msg.sender === "me"
                    ? "text-blue-100"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {msg.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSend}
        className="p-3 border-t border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Paperclip size={18} className="text-gray-500 dark:text-gray-400" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a message..."
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className={`p-2 rounded-full transition-colors ${
              message.trim()
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
            }`}
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
