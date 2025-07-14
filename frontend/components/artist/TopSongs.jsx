"use client";

import { useState } from "react";
import SongList from "@/components/songs/song-list";
import { Play } from "lucide-react";

export default function TopSongs({ topSongs = [] }) {
  const [showAllTopSongs, setShowAllTopSongs] = useState(false);

  const visibleTopSongs = showAllTopSongs ? topSongs : topSongs.slice(0, 5);

  if (!topSongs || topSongs.length === 0) return null;

  return (
    <div>
      <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Play size={24} className="text-green-500" /> Top Songs of the Month
      </h3>
      <SongList songs={visibleTopSongs} />
      {topSongs.length > 5 && (
        <button
          onClick={() => setShowAllTopSongs((prev) => !prev)}
          className="mt-4 text-purple-400 hover:underline text-sm"
        >
          {showAllTopSongs ? "Hide" : "See more"}
        </button>
      )}
    </div>
  );
}
