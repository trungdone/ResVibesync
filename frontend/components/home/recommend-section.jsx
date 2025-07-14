"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const fetchRecommendations = async (userId, limit = 12) => {
  try {
    const res = await fetch(
      `http://localhost:8000/api/recommendations?user_id=${userId}&limit=${limit}`
    );
    if (!res.ok) throw new Error("Failed to fetch recommendations");
    const data = await res.json();
    console.log("🎵 Recommended songs:", data);
    return data;
  } catch (err) {
    console.error("❌ Fetch error:", err.message);
    return [];
  }
};

export default function RecommendSection() {
  const [songs, setSongs] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (!storedUserId) {
      console.warn("⚠️ No user_id found in localStorage.");
      setLoading(false);
      return;
    }

    setUserId(storedUserId);
    fetchRecommendations(storedUserId, 12)
      .then(setSongs)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  if (!userId)
    return (
      <div className="text-white px-4 py-2">
        ⚠️ Bạn cần đăng nhập để nhận gợi ý bài hát.
      </div>
    );

  if (!songs.length)
    return (
      <div className="text-white px-4 py-2">
        📭 Không tìm thấy gợi ý phù hợp cho bạn.
      </div>
    );

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">Recommended for You</h2>
        <Link
          href="/recommendations"
          className="text-sm text-purple-400 hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {songs.map((song) => (
          <Link key={song.id} href={`/song/${song.id}`} className="group">
            <div className="relative aspect-square rounded-lg overflow-hidden mb-3 bg-gray-800">
              <Image
                src={song.cover_art || "/placeholder.svg"}
                alt={song.title || "Recommended song"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="text-sm font-medium text-center text-white truncate">
              {song.title}
            </h3>
            <p className="text-xs text-gray-400 text-center">{song.artist}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
