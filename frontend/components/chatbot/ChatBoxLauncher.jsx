// components/chatbot/ChatBoxLauncher.jsx
"use client";

import { useState, useEffect } from "react";
import ChatBox from "./ChatBox";

export default function ChatBoxLauncher() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("isChatOpen");
    if (saved === "true") setIsChatOpen(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("isChatOpen", isChatOpen.toString());
  }, [isChatOpen]);

  return (
    <>
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center z-50"
      >
        💬
      </button>

      {isChatOpen && (
        <ChatBox isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      )}
    </>
  );
}
