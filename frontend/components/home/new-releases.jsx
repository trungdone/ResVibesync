"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import SongList from "../songs/song-list";
import { fetchSongs } from "@/lib/api";
import { useMusic } from "@/context/music-context";

export default function NewReleases() {
  const [newReleases, setNewReleases] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const {
    setSongs,
    setContext,
    setContextId,
    playSong,
    isPlaying,
    currentSong,
    songs,
  } = useMusic();

  useEffect(() => {
    async function load() {
      try {
        const fetched = await fetchSongs({ sort: "releaseYear", limit: 25 });
        const songs = Array.isArray(fetched) ? fetched : fetched?.songs || [];
        setNewReleases(songs);
      } catch (err) {
        console.error("Error in NewReleases:", err);
        setNewReleases([]);
      }
    }
    load();
  }, []);

  const handlePlayAll = () => {
    if (!newReleases || newReleases.length === 0) return;
    setSongs(newReleases);
    setContext("new-releases");
    setContextId(null);
    playSong(newReleases[0]);
    setIsActive(true);
  };

  // Khi người dùng phát bất kỳ bài nào trong danh sách
  const handlePlayFromList = (song) => {
    setSongs(newReleases);
    setContext("new-releases");
    setContextId(null);
    playSong(song);
    setIsActive(true);
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">New Releases</h2>
          <button
            onClick={handlePlayAll}
            title="Play All"
            className={`p-2 rounded-full transition ${
              isActive ? "bg-purple-600 text-white" : "bg-gray-800 text-white hover:bg-purple-400"
            }`}
          >
            <Play size={20} />
          </button>
        </div>
        <Link href="/viewAll/songs" className="text-sm font-medium text-[#39FF14] hover:underline hover:text-white transition-colors">
          View All
        </Link>
      </div>

      {newReleases.length > 0 ? (
        <SongList songs={newReleases} onPlaySong={handlePlayFromList} />
      ) : (
        <p>No new releases available</p>
      )}
    </section>
  );
}