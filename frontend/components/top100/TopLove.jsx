'use client';

import { useEffect, useState } from "react";
import SongList from "../songs/song-list";
import { fetchSongsByGenre } from "@/lib/api/songs";

export default function TopLove() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadLoveSongs() {
      try {
        const { songs: usukSongs } = await fetchSongsByGenre("Love", 500);
        setSongs(usukSongs);
      } catch (err) {
        console.error("Lỗi khi tải bài hát:", err);
        setError("Không thể tải bài hát UK-US.");
      } finally {
        setLoading(false);
      }
    }

    loadLoveSongs();
  }, []);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!songs.length) return <p>Không có bài hát UK-US nào.</p>;

  const topSong = songs[0];
  const topSongImage = topSong?.thumbnail || "/default-image.jpg";

  return (
    <div className="flex h-[80vh] p-4 gap-6 overflow-hidden">
      <div className="w-80 bg-gradient-to-b from-blue-500 to-blue-700 text-white rounded-xl p-4 shrink-0">
        <img
          src={topSongImage}
          alt="Top USUK Songs"
          className="w-full h-auto object-cover rounded-xl mb-4"
        />
        <h2 className="text-xl font-bold mb-2">Top 100 Bài Hát US-UK Hay Nhất</h2>
        <p className="text-sm mb-2">Cập nhật: {new Date().toLocaleDateString("vi-VN")}</p>
        <p className="text-sm">3.1M người yêu thích</p>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 scrollbar-custom">
        <SongList songs={songs} />
      </div>
    </div>
  );
}
