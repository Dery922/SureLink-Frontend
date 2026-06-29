// src/components/chat/ChatListItem.jsx
export default function ChatListItem({ chat, isActive, onClick }) {
  const { name, avatar, lastMessage, timestamp, unread, online, title } = chat;

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
        isActive ? "bg-blue-50 dark:bg-blue-900/20" : ""
      }`}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <img
          src={avatar}
          alt={name}
          className="w-12 h-12 rounded-full object-cover"
        />
        {online && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
            {name}
          </h4>
          <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
            {timestamp}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
          {lastMessage}
        </p>
        {title && (
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
            {title}
          </p>
        )}
      </div>

      {/* Unread Badge */}
      {unread > 0 && (
        <div className="flex-shrink-0 mt-1">
          <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-blue-600 text-white text-xs font-bold rounded-full">
            {unread}
          </span>
        </div>
      )}
    </button>
  );
}
