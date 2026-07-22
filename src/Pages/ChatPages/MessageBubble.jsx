// src/components/Chat/MessageBubble.jsx
import React from "react";
import { FaCheck, FaCheckDouble, FaClock, FaImage } from "react-icons/fa";

const MessageBubble = ({ message, isOwn, formatTime }) => {
  const isFile = message.isFile;
  const isImage = isFile && message.fileType?.startsWith("image/");

  return (
    <div
      className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-3 animate-fadeInUp`}
    >
      <div className={`max-w-[80%] ${isOwn ? "order-2" : "order-1"}`}>
        {!isOwn && (
          <p className="text-xs text-gray-400 mb-1 ml-1">
            {message.senderName}
          </p>
        )}

        <div
          className={`px-4 py-2.5 rounded-2xl shadow-sm ${
            isOwn
              ? "bg-[#0057FF] text-white rounded-br-none"
              : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
          }`}
        >
          {isFile ? (
            <div className="flex items-center gap-2">
              {isImage ? (
                <div className="relative">
                  <img
                    src={message.fileUrl || "https://via.placeholder.com/150"}
                    alt={message.fileName}
                    className="max-w-[200px] max-h-[150px] rounded-lg object-cover"
                  />
                  <span className="absolute bottom-1 right-1 bg-black/50 text-white text-xs px-2 py-0.5 rounded">
                    {message.fileName}
                  </span>
                </div>
              ) : (
                <div
                  className={`flex items-center gap-2 p-2 rounded-lg ${isOwn ? "bg-white/10" : "bg-gray-50"}`}
                >
                  <FaImage
                    className={isOwn ? "text-white" : "text-[#0057FF]"}
                  />
                  <div>
                    <p className="text-sm font-medium">{message.fileName}</p>
                    <p className="text-xs opacity-60">{message.fileSize}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm whitespace-pre-wrap break-words">
              {message.text}
            </p>
          )}
        </div>

        <div
          className={`flex items-center gap-1 mt-1 text-xs text-gray-400 ${isOwn ? "justify-end" : "justify-start"}`}
        >
          <span>{formatTime(message.timestamp)}</span>
          {isOwn && (
            <span className="ml-1">
              {message.status === "sending" && (
                <FaClock className="text-gray-400 text-xs animate-pulse" />
              )}
              {message.status === "sent" && (
                <FaCheck className="text-gray-400 text-xs" />
              )}
              {message.status === "delivered" && (
                <FaCheckDouble className="text-gray-400 text-xs" />
              )}
              {message.status === "read" && (
                <FaCheckDouble className="text-blue-500 text-xs" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
