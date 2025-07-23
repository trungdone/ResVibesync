'use client';

import SongList from "../songs/song-list";
import { fetchSongs } from "@/lib/api";
import { useEffect, useState } from "react";

export default function TopSongs() {
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSongs() {
      try {
        const response = await fetchSongs({ sort: "views" });
        const data = Array.isArray(response) ? response : response?.songs || [];

        // ✅ Lọc bài hát theo genre === "Korean"
        const koreanSongs = data.filter((song) => {
          const genre = song.genre;
          if (typeof genre === "string") {
            return genre.toLowerCase() === "korean";
          }
          if (Array.isArray(genre)) {
            return genre.some(
              (g) => typeof g === "string" && g.toLowerCase() === "korean"
            );
          }
          return false;
        });

        setSongs(koreanSongs);
      } catch (err) {
        console.error("Error fetching songs:", err);
        setError("Failed to load songs.");
      } finally {
        setLoading(false);
      }
    }

    loadSongs();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!songs.length) return <p>No Korean songs found.</p>;

  const topSong = songs[0];
  const topSongImage = topSong?.thumbnail || "/default-image.jpg";

  return (
    <div className="flex h-[80vh] p-4 gap-6 overflow-hidden">
      {/* Bên trái: Ảnh top bài hát */}
      <div className="w-80 bg-gradient-to-b from-pink-500 to-pink-700 text-white rounded-xl p-4 shrink-0">
        <img
          src={topSongImage}
          alt="Top 100"
          className="w-full h-auto object-cover rounded-xl mb-4"
        />
        <h2 className="text-xl font-bold mb-2">Top 100 Bài Hát KPOP Hay Nhất</h2>
        <p className="text-sm mb-2">Cập nhật: {new Date().toLocaleDateString("vi-VN")}</p>
        <p className="text-sm">1.8M người yêu thích</p>
      </div>

      {/* Bên phải: Danh sách bài hát cuộn được */}
      <div className="flex-1 overflow-y-auto pr-1 scrollbar-custom">
        <SongList songs={songs} />
      </div>
    </div>
  );
}
