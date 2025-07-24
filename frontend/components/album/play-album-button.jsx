"use client";

import { useState } from "react";
import { Play, Heart } from "lucide-react";
import { useMusic } from "@/context/music-context";
import axios from "@/lib/axiosInstance";
import WaveBars from "@/components/ui/WaveBars";

export default function PlayAlbumButton({ albumId }) {
  const { currentSong, isPlaying, setSongs, playSong } = useMusic();
  const [liked, setLiked] = useState(false);

  // Kiểm tra album hiện tại có đang phát không
  const isThisAlbumPlaying = isPlaying && currentSong?.album_id === albumId;

  // Xử lý khi nhấn nút Play
  const handlePlay = async (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan ra ngoài
    try {
      const res = await axios.get(`/api/albums/${albumId}/songs`);
      const songs = res.data?.songs || [];

      if (songs.length > 0) {
        setSongs(songs); // Gán danh sách bài hát

        // Phát bài đầu tiên của album
        const firstSong = {
          ...songs[0],
          album_id: albumId,
        };
        playSong(firstSong);
      }
    } catch (err) {
      console.error("Failed to play album:", err);
    }
  };

  // Toggle trạng thái yêu thích
  const toggleLike = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan ra ngoài
    setLiked(!liked);    // Đảo trạng thái thích
  };

  return (
    <div
      className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-black/30 pointer-events-none"
    >
      {/* ==== Nút yêu thích album ==== */}
      <button
        onClick={toggleLike}
        className="pointer-events-auto bg-black/70 hover:bg-black text-white rounded-full p-2"
      >
        <Heart
          className={`w-5 h-5 ${liked ? "fill-red-500 text-red-500" : ""}`}
        />
      </button>

      {/* ==== Nút phát album ==== */}
      <button
        onClick={handlePlay}
        className="pointer-events-auto bg-purple-600 hover:bg-purple-500 text-white rounded-full p-2"
      >
        {isThisAlbumPlaying ? <WaveBars /> : <Play className="w-5 h-5" />}
      </button>
    </div>
  );
}
