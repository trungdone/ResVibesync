"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Heart, MoreHorizontal, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useMusic } from "@/context/music-context";
import { formatDuration } from "@/lib/utils";
import WaveBars from "@/components/ui/WaveBars";
import SongActionsMenu from "./song-actions-menu";
import axios from "axios";


export default function PlaylistSongList({ songs: propSongs,playlistId  }) {
  const { playSong, isPlaying, currentSong, togglePlayPause, nextSong,  setSongs,
  setContext,setContextId } = useMusic();
  const [optionsOpenId, setOptionsOpenId] = useState(null);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0 });
  const [likedSongs, setLikedSongs] = useState(new Set());
  const moreBtnRefs = useRef({});
  const popupRef = useRef(null);
  const observerRef = useRef(null);
  const scrollRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

const handlePlayClick = (song) => {
  if (!song) return;

  // Nếu đang phát bài đó thì toggle play/pause
  if (currentSong?.id?.toString() === song.id?.toString()) {
    togglePlayPause();
  } else {
    // Gán toàn bộ danh sách hiện tại làm context
    setSongs(propSongs);
    setContext("new-releases"); 
    setContextId(null); 
    playSong(song); 
  }
};


const handleRemoveFromPlaylist = async (songId) => {
  try {
    const res = await axios.delete(`http://localhost:8000/api/playlists/${playlistId}/songs/${songId}`);

    // Optionally: update local UI
    console.log("Removed song:", res.data);
    setOptionsOpenId(null);
    window.location.reload(); // or update the local songs state
  } catch (err) {
    console.error("Failed to remove song:", err);
  }
};

  const toggleLike = (songId) => {
    const updated = new Set(likedSongs);
    updated.has(songId) ? updated.delete(songId) : updated.add(songId);
    setLikedSongs(updated);
  };

  const toggleOptions = (songId) => {
    if (optionsOpenId === songId) return setOptionsOpenId(null);
    const rect = moreBtnRefs.current[songId]?.getBoundingClientRect();
    if (rect) {
      setPopupPos({
        top: rect.bottom + window.scrollY + 8,
        left: rect.right - 300,
      });
    }
    setOptionsOpenId(songId);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setOptionsOpenId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!optionsOpenId || !moreBtnRefs.current[optionsOpenId]) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) setOptionsOpenId(null);
      },
      { threshold: 0.1 }
    );

    observer.observe(moreBtnRefs.current[optionsOpenId]);
    observerRef.current = observer;
    return () => observer.disconnect();
  }, [optionsOpenId]);

  const handleLyrics = () => setOptionsOpenId(null);
  const handlePlayNext = () => {
    nextSong();
    setOptionsOpenId(null);
  };

  const handleBlock = () => {
    console.log(`Block song ${optionsOpenId}`);
    setOptionsOpenId(null);
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/song/${optionsOpenId}`;
    navigator.clipboard
      .writeText(link)
      .then(() => alert("✅ Link copied to clipboard!"))
      .catch(() => alert("❌ Failed to copy link."));
    setOptionsOpenId(null);
  };

  return (
    <div className="bg-zinc-900 shadow-md rounded-xl overflow-hidden relative border border-zinc-700">
      <div
        ref={scrollRef}
        className="max-h-[360px] overflow-y-auto scroll-container transition-all duration-300 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900"
        onScroll={() => {
          if (scrollRef.current) scrollRef.current.classList.add("scrolling");
          clearTimeout(scrollTimeoutRef.current);
          scrollTimeoutRef.current = setTimeout(() => {
            scrollRef.current?.classList.remove("scrolling");
          }, 1000);
        }}
      >
        <table className="w-full text-sm text-left">
          <thead className=" top-0 bg-zinc-800 z-10">
            <tr className="border-b border-zinc-700 text-gray-200 uppercase">
              <th className="p-3 w-10 font-medium">#</th>
              <th className="p-3 font-medium">Title</th>
              <th className="p-3 font-medium hidden md:table-cell">Album</th>
              <th className="p-3 font-medium hidden md:table-cell">Duration</th>
              <th className="p-3 w-10 text-right font-medium">•••</th>
            </tr>
          </thead>
          <tbody>
            {propSongs.map((song, index) => {
              const isCurrent = currentSong?.id?.toString() === song.id?.toString();
              const isLiked = likedSongs.has(song.id);

              return (
                <tr
                  key={song.id}
                  className={`group border-b border-zinc-700 hover:bg-zinc-800 transition ${
                    isCurrent ? "bg-zinc-800" : ""
                  }`}
                >
                  <td className="p-3 text-gray-400">
                    <div className="w-6 h-6 flex items-center justify-center relative">
                      {isCurrent && isPlaying ? (
                        <WaveBars />
                      ) : (
                        <>
                          <span className="group-hover:opacity-0">{index + 1}</span>
                          <button
                            onClick={() => handlePlayClick(song)}
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center"
                          >
                            <Play size={16} className="text-white" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 relative">
                        <Image
                          src={song.coverArt || "/placeholder.svg"}
                          alt={song.title || "Cover"}
                          fill
                          className={`object-cover ${
                            isCurrent && isPlaying ? "animate-pulse" : ""
                          }`}
                        />
                      </div>
                      <div className="relative group">
                        <Link href={`/song/${song.id}`} className="text-gray-100 font-medium hover:underline">
                          {song.title}
                        </Link>
                        <div className="text-sm text-gray-400">{song.artist}</div>

                        {/* Tooltip */}
                        <div className="absolute z-50 hidden group-hover:block top-full left-0 mt-2 w-64 p-3 bg-zinc-800 text-white text-xs rounded shadow-lg border border-zinc-700">
                          <div><strong>Artist:</strong> {song.artist}</div>
                          <div><strong>Album:</strong> {song.album || "Unknown"}</div>
                          <div><strong>Genre:</strong> {Array.isArray(song.genre) ? song.genre.join(", ") : song.genre || "Unknown"}</div>
                          <div><strong>Release Year:</strong> {song.releaseYear || "Unknown"}</div>
                        </div>
                      </div>

                    </div>
                  </td>
                  <td className="p-3 text-gray-400 hidden md:table-cell">
                    {song.album || "N/A"}
                  </td>
                  <td className="p-3 text-gray-400 hidden md:table-cell">
                    {formatDuration(song.duration || 0)}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => toggleLike(song.id)}
                        className={`hover:text-white ${
                          isLiked ? "text-pink-500" : "text-gray-400"
                        }`}
                      >
                        <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
                      </button>
                      <button
                        ref={(el) => (moreBtnRefs.current[song.id] = el)}
                        onClick={() => toggleOptions(song.id)}
                        className="text-gray-400 hover:text-white"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Popup menu */}
      {optionsOpenId && (
        <div
          ref={popupRef}
          className="fixed w-72 bg-zinc-800 text-white rounded-xl shadow-xl z-50 p-4 animate-fadeIn"
          style={{ top: popupPos.top, left: popupPos.left }}
        >
          <div className="flex gap-3">
            <div className="w-14 h-14 relative rounded overflow-hidden flex-shrink-0">
              <Image
                src={propSongs.find((s) => s.id === optionsOpenId)?.coverArt || "/placeholder.svg"}
                alt="cover"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-base truncate">
                {propSongs.find((s) => s.id === optionsOpenId)?.title}
              </div>
              <div className="text-sm text-gray-400">
                {propSongs.find((s) => s.id === optionsOpenId)?.artist}
              </div>
            </div>
            <button onClick={() => setOptionsOpenId(null)} className="text-gray-400 hover:text-white">
              <X size={16} />
            </button>
          </div>

          <div className="mt-4 border-t border-zinc-700 pt-3">
            <ul className="text-sm mt-2 space-y-2">
                <li
                onClick={() => handleRemoveFromPlaylist(optionsOpenId)}
                className="hover:bg-zinc-700 rounded p-2 cursor-pointer"
                >
                Remove this from playlist
                </li>
    

              <li onClick={handleCopyLink} className="hover:bg-zinc-700 rounded p-2 cursor-pointer">Copy Link</li>
            <SongActionsMenu
              song={propSongs.find((s) => s.id === optionsOpenId)}
              onClose={() => setOptionsOpenId(null)}
            />              
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
