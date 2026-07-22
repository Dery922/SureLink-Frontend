// src/components/chat/ChatList.jsx
import { useState } from "react";
import { Plus } from "lucide-react";
import ChatListItem from "./ChatListItem";

// Mock data
const mockChats = [
  {
    id: 1,
    name: "John Doe",
    avatar: "https://i.pravatar.cc/150?img=1",
    lastMessage: "Hey, how are you doing?",
    timestamp: "2m ago",
    unread: 2,
    online: true,
    title: "Software Engineer",
  },
  {
    id: 2,
    name: "Sarah Smith",
    avatar: "https://i.pravatar.cc/150?img=5",
    lastMessage: "Thanks for connecting!",
    timestamp: "1h ago",
    unread: 0,
    online: false,
    title: "Product Designer",
  },
  {
    id: 3,
    name: "Mike Johnson",
    avatar: "https://i.pravatar.cc/150?img=3",
    lastMessage: "See you tomorrow at the meeting",
    timestamp: "3h ago",
    unread: 0,
    online: true,
    title: "Marketing Manager",
  },
  {
    id: 4,
    name: "Emily Wilson",
    avatar: "https://i.pravatar.cc/150?img=9",
    lastMessage: "I sent you the files",
    timestamp: "1d ago",
    unread: 0,
    online: false,
    title: "UX Researcher",
  },
];

export default function ChatList({ onSelectChat }) {
  const [activeId, setActiveId] = useState(null);

  const handleSelect = (chat) => {
    setActiveId(chat.id);
    onSelectChat(chat);
  };

  return (
    <div className="h-full overflow-y-auto">
      {mockChats.map((chat) => (
        <ChatListItem
          key={chat.id}
          chat={chat}
          isActive={activeId === chat.id}
          onClick={() => handleSelect(chat)}
        />
      ))}

      {/* Start New Chat Button */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium">
          <Plus size={16} />
          Start new conversation
        </button>
      </div>
    </div>
  );
}
