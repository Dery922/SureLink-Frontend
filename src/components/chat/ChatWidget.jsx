// src/components/chat/ChatWidget.jsx
import { useState } from "react";
import ChatDrawer from "./ChatDrawer";
import ChatToggle from "./ChatToggle";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-150">
      {isOpen ? (
        <ChatDrawer onClose={() => setIsOpen(false)} />
      ) : (
        <ChatToggle onClick={() => setIsOpen(true)} />
      )}
    </div>
  );
}
