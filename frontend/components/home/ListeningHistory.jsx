"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";

export default function ListeningHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (user?.id) {
      console.log("🟡 Gửi request lịch sử cho user:", user.id);
      fetch(`http://localhost:8000/api/history/user/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("🟢 Lịch sử nhận được:", data.history);
          setHistory(data.history || []);
        })
        .catch((err) => {
          console.error("🔴 Lỗi khi lấy lịch sử:", err);
        });
    }
  }, [user]);

  if (!user?.id || history.length === 0) return null;

  return (
    <div className="px-4 sm:px-8">
      <div className="flex justify-between items-center mb-4">

        <h2 className="text-2xl font-semibold">🕘 Recently listened</h2>

        <Link
          href="/history"
          className="text-sm text-blue-500 hover:underline font-medium"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {history.slice(0, 6).map((item) => (
          <Link key={item._id} href={`/song/${item.song_id}`}>
            <div className="group cursor-pointer">
              <div className="aspect-square relative rounded-md overflow-hidden shadow-sm">
                <Image
                  src={item.song_info.coverArt || "/placeholder.svg"}
                  alt={item.song_info.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="mt-2 text-sm font-medium truncate">
                {item.song_info.title}
              </div>
              <div className="text-xs text-gray-400 truncate">
                {item.song_info.artist}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
