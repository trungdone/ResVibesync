"use client";

import { useState, useEffect, useRef } from "react";
import { X, Trash2 } from "lucide-react";
import styles from "./chatbox.module.css";
import Link from "next/link";

export default function ChatBox({ isOpen, onClose }) {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const chatLogRef = useRef(null);

  // Lấy user_id và tên khách hàng từ localStorage
  const getUserId = () => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const userObj = JSON.parse(userStr);
        return {
          id: userObj._id || userObj.id || null,
          name: userObj.name || "Khách hàng", // Lấy tên, nếu không có thì dùng mặc định
        };
      }
    } catch {
      return { id: null, name: "Khách hàng" };
    }
    return { id: null, name: "Khách hàng" };
  };

  const scrollToBottom = () => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  };

  // Lấy lịch sử và thêm lời chào khi mở
  useEffect(() => {
    const fetchChatHistory = async () => {
      const user = getUserId();
      if (!user.id) {
        setChatHistory([
          {
            text: "❌ Không tìm thấy user_id. Vui lòng đăng nhập lại.",
            sender: "bot",
          },
        ]);
        return;
      }

      try {
        const res = await fetch(`http://localhost:8000/chat/history/${user.id}`);
        const data = await res.json();
        if (res.ok) {
          // Thêm lời chào vào lịch sử nếu không có tin nhắn trước đó
          const history = data.history || [];
          if (history.length === 0) {
            setChatHistory([
              {
                text: `Xin chào ${user.name}, hôm nay bạn thế nào?`,
                sender: "bot",
              },
            ]);
          } else {
            setChatHistory(history);
          }
        } else {
          console.error("Không thể tải lịch sử:", data);
        }
      } catch (err) {
        console.error("Lỗi khi lấy lịch sử:", err);
      }
    };

    if (isOpen) {
      fetchChatHistory();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSend = async (e) => {
    if (e.type === "click" || (e.key === "Enter" && message.trim())) {
      e.preventDefault();
      const trimmed = message.trim();
      if (!trimmed) return;

      const user = getUserId();
      if (!user.id) {
        setChatHistory((prev) => [
          ...prev,
          {
            text: "❌ Không tìm thấy user_id. Vui lòng đăng nhập lại.",
            sender: "bot",
          },
        ]);
        return;
      }

      // Hiện tin nhắn của người dùng
      const userMsg = { text: trimmed, sender: "user" };
      setChatHistory((prev) => [...prev, userMsg]);
      setMessage("");

      try {
        const res = await fetch("http://localhost:8000/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed, user_id: user.id }),
        });

        const data = await res.json();

        if (res.ok && data.response) {
          const botMsg = { text: data.response, sender: "bot" };
          setChatHistory(data.history); // Cập nhật luôn toàn bộ lịch sử mới từ server
        } else {
          setChatHistory((prev) => [
            ...prev,
            {
              text: "🤖 Không có phản hồi từ AI.",
              sender: "bot",
            },
          ]);
        }
      } catch (err) {
        console.error("Lỗi gửi tin nhắn:", err);
        setChatHistory((prev) => [
          ...prev,
          {
            text: "❌ Lỗi khi gửi yêu cầu đến máy chủ.",
            sender: "bot",
          },
        ]);
      }
    }
  };

  useEffect(() => {
    const keyHandler = (e) => {
      if (e.key === "Enter" && isOpen) {
        handleSend(e);
      }
    };
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, [message, isOpen]);

  const handleClearHistory = async () => {
    const user = getUserId();
    if (user.id) {
      try {
        await fetch(`http://localhost:8000/chat/history/${user.id}`, {
          method: "DELETE",
        });
        setChatHistory([]);
      } catch (err) {
        console.error("Lỗi khi xoá lịch sử:", err);
      }
    }
  };

  if (!isOpen) return null;

  const renderMessageText = (text) => {
    const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
    const elements = [];
    let lastIndex = 0;
    let match;

    while ((match = markdownLinkRegex.exec(text)) !== null) {
      const [fullMatch, label, url] = match;
      const start = match.index;

      if (start > lastIndex) {
        elements.push(<span key={lastIndex}>{text.slice(lastIndex, start)}</span>);
      }

      const isInternal = url.startsWith("http://localhost:3000");
      const href = isInternal ? url.replace("http://localhost:3000", "") : url;

      elements.push(
        isInternal ? (
          <Link key={start} href={href} className="text-blue-500 underline">
            {label}
          </Link>
        ) : (
          <a
            key={start}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            {label}
          </a>
        )
      );

      lastIndex = start + fullMatch.length;
    }

    if (lastIndex < text.length) {
      elements.push(<span key={lastIndex}>{text.slice(lastIndex)}</span>);
    }

    return elements;
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <span className="font-bold">Trợ lý AI</span>
        <div className="flex items-center gap-2">
          <button onClick={handleClearHistory} title="Xoá lịch sử">
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className={styles.chatLog} ref={chatLogRef}>
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={`${styles.messageWrapper} ${
              chat.sender === "user" ? styles.messageUserWrapper : styles.messageBotWrapper
            }`}
          >
            <img
              src={chat.sender === "user" ? "/save-your-tears-album-cover.png" : "/robot.jpg"}
              alt={chat.sender === "user" ? "User Avatar" : "Bot Avatar"}
              className={styles.avatar}
            />

            <div
              className={`${styles.message} ${
                chat.sender === "user" ? styles.messageUser : styles.messageBot
              }`}
            >
              {chat.sender === "bot" ? renderMessageText(chat.text) : chat.text}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.chatInput}>
        <input
          type="text"
          value={message}
          placeholder="Nhập nội dung..."
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSend}>Gửi</button>
      </div>
    </div>
  );
}