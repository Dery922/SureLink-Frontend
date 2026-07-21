// src/components/Chat/ChatWindow.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  FaTimes,
  FaMinus,
  FaPaperPlane,
  FaUser,
  FaHeadset,
  FaCheck,
  FaCheckDouble,
  FaClock,
  FaImage,
  FaPaperclip,
  FaSmile,
  FaEllipsisV,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import SupportAgentCard from "./SupportAgentCard";

const ChatWindow = ({ onClose, onMinimize, isMinimized }) => {
  const { user } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAgentInfo, setShowAgentInfo] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Mock support agent
  const supportAgent = {
    id: "agent_001",
    name: "Sarah Mensah",
    role: "Senior Support Specialist",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    online: true,
    responseTime: "Usually replies in 2-5 minutes",
    rating: 4.9,
    totalResolved: 1247,
  };

  // Initial welcome messages
  useEffect(() => {
    const welcomeMessages = [
      {
        id: "1",
        sender: "agent",
        senderName: "Sarah Mensah",
        text: "👋 Hello! Welcome to SureLink Support. I'm Sarah, your support specialist.",
        timestamp: new Date(Date.now() - 120000),
        status: "read",
        isWelcome: true,
      },
      {
        id: "2",
        sender: "agent",
        senderName: "Sarah Mensah",
        text: "How can I help you today? Feel free to ask about bookings, payments, or any other questions you have.",
        timestamp: new Date(Date.now() - 60000),
        status: "read",
        isWelcome: true,
      },
    ];
    setMessages(welcomeMessages);
    setIsLoading(false);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle sending message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      id: `msg_${Date.now()}`,
      sender: "user",
      senderName: user?.name?.full || "You",
      text: newMessage.trim(),
      timestamp: new Date(),
      status: "sending",
    };

    setMessages((prev) => [...prev, messageData]);
    setNewMessage("");

    // Simulate agent typing
    setIsTyping(true);

    // Simulate API delay
    setTimeout(() => {
      // Update message status to sent
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageData.id ? { ...msg, status: "sent" } : msg,
        ),
      );

      // Simulate agent response
      setTimeout(() => {
        setIsTyping(false);

        const responses = [
          "Thanks for reaching out! Let me look into that for you.",
          "I understand your concern. Let me help you with that.",
          "Great question! I'll explain how that works.",
          "I can definitely assist with that. Let me check the details.",
          "Thank you for providing that information. I'll get back to you shortly.",
        ];

        const agentResponse = {
          id: `msg_${Date.now() + 1}`,
          sender: "agent",
          senderName: "Sarah Mensah",
          text: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date(),
          status: "read",
        };

        setMessages((prev) => [...prev, agentResponse]);
      }, 1500);
    }, 500);
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    // Check file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
      "text/plain",
    ];
    if (!allowedTypes.includes(file.type)) {
      alert(
        "File type not supported. Please upload image, PDF, or text files.",
      );
      return;
    }

    // Simulate file upload
    const messageData = {
      id: `msg_${Date.now()}`,
      sender: "user",
      senderName: user?.name?.full || "You",
      text: `📎 ${file.name}`,
      timestamp: new Date(),
      status: "sending",
      isFile: true,
      fileName: file.name,
      fileSize: (file.size / 1024).toFixed(1) + " KB",
      fileType: file.type,
    };

    setMessages((prev) => [...prev, messageData]);

    // Simulate upload success
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageData.id ? { ...msg, status: "sent" } : msg,
        ),
      );
    }, 1000);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Format timestamp
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups = {};
    messages.forEach((msg) => {
      const date = new Date(msg.timestamp).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });
    return groups;
  };

  if (isMinimized) {
    return (
      <div
        className="fixed bottom-6 right-6 z-[9999] bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 cursor-pointer hover:shadow-xl transition-all"
        onClick={() => onMinimize()}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#0057FF] to-[#0066FF] text-white flex items-center justify-center">
              <FaHeadset className="text-sm" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-800">Support Chat</p>
            <p className="text-xs text-gray-400">Click to resume</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="ml-2 text-gray-400 hover:text-gray-600"
          >
            <FaTimes className="text-sm" />
          </button>
        </div>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] w-[380px] sm:w-[420px] h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col animate-slideUp">
      {/* Header */}
      <ChatHeader
        agent={supportAgent}
        onClose={onClose}
        onMinimize={onMinimize}
        onShowAgentInfo={() => setShowAgentInfo(!showAgentInfo)}
        showAgentInfo={showAgentInfo}
      />

      {/* Agent Info Panel */}
      {showAgentInfo && (
        <SupportAgentCard
          agent={supportAgent}
          onClose={() => setShowAgentInfo(false)}
        />
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-[#E8F0FF] border-t-[#0057FF] rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-sm text-gray-400">Loading conversation...</p>
            </div>
          </div>
        ) : (
          <>
            {Object.entries(messageGroups).map(([date, msgs]) => (
              <div key={date}>
                <div className="flex items-center justify-center my-4">
                  <span className="text-xs text-gray-400 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-200">
                    {date}
                  </span>
                </div>
                {msgs.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    isOwn={msg.sender === "user"}
                    formatTime={formatTime}
                  />
                ))}
              </div>
            ))}
            <div ref={messagesEndRef} />

            {/* Typing Indicator */}
            {isTyping && <TypingIndicator agentName={supportAgent.name} />}
          </>
        )}
      </div>

      {/* Input Area */}
      <ChatInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        onSend={handleSendMessage}
        onFileUpload={handleFileUpload}
        fileInputRef={fileInputRef}
        isTyping={isTyping}
      />
    </div>
  );
};

export default ChatWindow;
