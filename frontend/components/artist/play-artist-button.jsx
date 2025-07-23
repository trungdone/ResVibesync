"use client";

import { Play } from "lucide-react";
import { useMusic } from "@/context/music-context";
import axios from "@/lib/axiosInstance";
import WaveBars from "@/components/ui/WaveBars";

export default function PlayArtistButton({ artistId }) {
  const { currentSong, isPlaying, setSongs, playSong, setContext, setContextId } = useMusic();

  // ✅ Kiểm tra đúng bài của nghệ sĩ đang phát
  const isThisArtistPlaying = isPlaying && currentSong?.artist_id === artistId;

  const handlePlay = async (e) => {
    e.stopPropagation();

    try {
      const res = await axios.get(`/api/artists/${artistId}/songs`);
      const songs = res.data?.songs || [];

      if (songs.length > 0) {
        const songsWithContext = songs.map((s) => ({
          ...s,
          artist_id: artistId,
        }));

        setSongs(songsWithContext);
        setContext("artist");
        setContextId(artistId);
        playSong(songsWithContext[0]);
      }
    } catch (err) {
      console.error("❌ Failed to play artist:", err);
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-black/30 pointer-events-none">
      {/* ▶️ Play / WaveBars */}
      <button
        onClick={handlePlay}
        className="pointer-events-auto bg-purple-600 hover:bg-purple-500 text-white rounded-full p-2"
      >
        {isThisArtistPlaying ? <WaveBars /> : <Play className="w-5 h-5" />}
      </button>
    </div>
  );
}
