"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
<<<<<<< HEAD
import {
  Play, Pause, SkipBack, SkipForward,
  Volume2, Volume1, VolumeX,
  Repeat, Shuffle, Heart, MoreHorizontal, X
} from "lucide-react";
import { useMusic } from "@/context/music-context";
import { useAuth } from "@/context/auth-context";
import { formatDuration } from "@/lib/utils";

export default function Player() {
  const {
    currentSong,
    isPlaying,
    togglePlayPause,
    nextSong,
    prevSong,
    audioRef,
    isShuffling,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
  } = useMusic();

  const { user } = useAuth();
=======
import { useMusic } from "@/context/music-context";
import {
  Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX,
  Repeat, Shuffle, Heart, MoreHorizontal, X
} from "lucide-react";
import { formatDuration } from "@/lib/utils";
import { toggleLikeSong } from "@/lib/api/user";

export default function Player() {
  const {
  currentSong,
  isPlaying,
  togglePlayPause,
  nextSong,
  prevSong,
  audioRef,
  isShuffling,
  toggleShuffle,
  repeatMode,
  toggleRepeat,
  } = useMusic();

>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
<<<<<<< HEAD
  const [isLiked, setIsLiked] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [optionsOpenId, setOptionsOpenId] = useState(null);

  const progressBarRef = useRef(null);
  const popupRef = useRef(null);

  const toggleLike = () => setIsLiked(!isLiked);

  useEffect(() => {
  // 🪵 Debug dữ liệu
  console.log("✅ currentSong:", currentSong);
  console.log("✅ user:", user);
  console.log("✅ currentSong.id:", currentSong?.id);  // ✅ sửa _id → id
  console.log("✅ user.id:", user?.id);

  if (currentSong && user?.id && currentSong.id) {
    fetch("http://localhost:8000/api/history/listen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        song_id: currentSong.id, // ✅ dùng id thay vì _id
      }),
    }).catch((err) => console.error("❌ History Error:", err));
  }
}, [currentSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    isPlaying ? audio.play().catch(() => {}) : audio.pause();
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMore && popupRef.current && !popupRef.current.contains(event.target)) {
        setShowMore(false);
      }
    };
    const handleScroll = () => {
      setShowMore(false);
      setOptionsOpenId(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [showMore]);

=======

  const progressBarRef = useRef(null);
  const [showMore, setShowMore] = useState(false);
  const [optionsOpenId, setOptionsOpenId] = useState(null);
  const popupRef = useRef(null);
  const [likedSongs, setLikedSongs] = useState(new Set());

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const isLiked = currentSong?.id && likedSongs.has(currentSong.id);

  useEffect(() => {
  console.log("🔁 Audio src updated:", currentSong?.audioUrl);
}, [currentSong]);

  useEffect(() => {
  const handleClickOutside = (event) => {
    // Nếu popup đang hiển thị và người dùng click ra ngoài popup
    if (showMore && popupRef.current && !popupRef.current.contains(event.target)) {
      setShowMore(false);
    }
  };

  const handleScroll = () => {
    setShowMore(false);
    setOptionsOpenId(null);
  };

  document.addEventListener("mousedown", handleClickOutside);
  window.addEventListener("scroll", handleScroll, true);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
    window.removeEventListener("scroll", handleScroll, true);
  };
}, []);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.play()
    }
  }, [currentSong])

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play()
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    }
  };
<<<<<<< HEAD

  const handleProgressChange = (e) => {
    const audio = audioRef.current;
    const progressBar = progressBarRef.current;
    if (!audio || !progressBar || isNaN(audio.duration)) return;

    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * audio.duration;

    if (isFinite(newTime)) {
      audio.currentTime = newTime;
      if (!isPlaying) togglePlayPause();
    }
  };
=======
  

const handleProgressChange = (e) => {
  const audio = audioRef.current;
  const progressBar = progressBarRef.current;
  if (!audio || !progressBar || isNaN(audio.duration)) return;

  const rect = progressBar.getBoundingClientRect();
  const pos = (e.clientX - rect.left) / rect.width;

  const newTime = pos * audio.duration;

  if (isFinite(newTime)) {
    audio.currentTime = newTime;
      if (newTime < audio.duration && !isPlaying) {
    audio.play().then(() => setIsPlaying(true)).catch((err) => console.error("Play error after seek:", err));
  }
  }
};
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6

  const handleVolumeChange = (e) => {
    const newVol = parseInt(e.target.value);
    setVolume(newVol);
    setIsMuted(newVol === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
<<<<<<< HEAD
=======

>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
    if (isMuted) {
      audio.volume = volume / 100;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

<<<<<<< HEAD
=======
    const handleToggleLike = async () => {
    if (!currentSong?.id || !token) return;
    try {
      const data = await toggleLikeSong(currentSong.id, token);
      setLikedSongs(new Set(data.likedSongs));
    } catch (err) {
      console.error("❌ Failed to toggle like:", err);
    }
  };

>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
  if (!currentSong) {
    return (
      <div className="h-20 bg-black/50 backdrop-blur-md border-t border-white/10 px-4 flex items-center justify-center text-gray-400">
        No song is currently playing
      </div>
    );
  }

  return (
    <div className="h-20 bg-black/50 backdrop-blur-md border-t border-white/10 px-4 flex items-center">
<<<<<<< HEAD
      {/* 🎵 Audio element with key = song id to force reload */}
      <audio
        key={currentSong.id || currentSong._id}
        ref={audioRef}
        src={currentSong.audioUrl}
        type="audio/mpeg"
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => {
          if (repeatMode === 1) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
          } else {
            nextSong();
          }
        }}
        autoPlay
      />

      {/* Left */}
=======
<audio
  ref={audioRef}
  src={currentSong.audioUrl}
  type="audio/mpeg"
  onTimeUpdate={handleTimeUpdate}
  onEnded={() => {
    if (repeatMode === 1) {
      audioRef.current.currentTime = 0;
      audioRef.current.play(); // 🛠 Lặp lại bài
    } else {
      nextSong(); // 🛠 Gọi nextSong nếu không phải repeat one
    }
  }}
  autoPlay
/>

>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
      <div className="flex items-center gap-4 w-1/4">
        <div className="relative w-14 h-14 rounded overflow-hidden flex-shrink-0">
          <Image
            src={currentSong.coverArt || "/placeholder.svg"}
            alt={currentSong.title}
            fill
            className="object-cover"
          />
        </div>
<<<<<<< HEAD
        <div className="truncate">
          <Link href={`/song/${currentSong.id || currentSong._id}`} className="font-medium hover:underline truncate block">
            {currentSong.title}
          </Link>
          <Link href={`/artist/${currentSong.artistId}`} className="text-sm text-gray-400 hover:underline truncate block">
            {currentSong.artist}
          </Link>
        </div>
        <button
          className={`text-gray-400 hover:text-white ${isLiked ? "text-purple-500" : ""}`}
          onClick={toggleLike}
        >
          <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
        </button>
        <button
          onClick={() => setShowMore(!showMore)}
          className="text-gray-400 hover:text-white ml-2"
        >
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Middle: Controls */}
      <div className="flex-1 flex flex-col items-center justify-center gap-2">
        <div className="flex items-center gap-4">
          <button className={`text-gray-400 hover:text-white ${isShuffling ? "text-purple-500" : ""}`} onClick={toggleShuffle}>
=======

        <div className="truncate">
          <Link href={`/song/${currentSong.id}`} className="font-medium hover:underline truncate block">
            {currentSong.title}
          </Link>
          <Link
            href={`/artist/${currentSong.artistId}`}
            className="text-sm text-gray-400 hover:underline truncate block"
          >
            {currentSong.artist}
          </Link>
        </div>
        
        <button
          className={`text-gray-400 hover:text-white ${isLiked ? "text-purple-500" : ""}`}
          onClick={handleToggleLike}
          title={isLiked ? "Unlike" : "Like"}
        >
          <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
        </button>
        
<button
  onClick={() => setShowMore(!showMore)}
  className="text-gray-400 hover:text-white ml-2"
>
  <MoreHorizontal size={20} />
</button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-2">
        <div className="flex items-center gap-4">
          <button
            className={`text-gray-400 hover:text-white ${isShuffling ? "text-purple-500" : ""}`}
            onClick={toggleShuffle}
          >
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
            <Shuffle size={18} />
          </button>
          <button className="text-gray-400 hover:text-white" onClick={prevSong}>
            <SkipBack size={22} />
          </button>
          <button
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black hover:scale-105 transition-transform"
            onClick={togglePlayPause}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
          </button>
<<<<<<< HEAD
=======

>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
          <button className="text-gray-400 hover:text-white" onClick={nextSong}>
            <SkipForward size={22} />
          </button>
          <button
<<<<<<< HEAD
            className={`text-gray-400 hover:text-white ${repeatMode > 0 ? "text-purple-500" : ""} relative`}
            onClick={toggleRepeat}
          >
            <Repeat size={18} />
            {repeatMode === 2 && <span className="absolute text-[8px] font-bold -top-1 right-0">1</span>}
          </button>
        </div>

        {/* Progress bar */}
=======
            className={`text-gray-400 hover:text-white ${repeatMode > 0 ? "text-purple-500" : ""}`}
            onClick={toggleRepeat}
          >
            <Repeat size={18} />
            {repeatMode === 2 && <span className="absolute text-[8px] font-bold">1</span>}
          </button>
        </div>

>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
        <div className="w-full flex items-center gap-2">
          <span className="text-xs text-gray-400 w-10 text-right">{formatDuration(currentTime)}</span>
          <div
            ref={progressBarRef}
            className="flex-1 h-1 bg-white/20 rounded-full cursor-pointer relative overflow-hidden"
            onClick={handleProgressChange}
          >
            <div
              className="absolute h-full bg-white rounded-full"
              style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
            />
          </div>
          <span className="text-xs text-gray-400 w-10">{formatDuration(duration)}</span>
        </div>
      </div>

<<<<<<< HEAD
      {/* Right: Volume & popup */}
=======
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
      <div className="w-1/4 flex justify-end items-center gap-2">
        <button className="text-gray-400 hover:text-white" onClick={toggleMute}>
          {isMuted ? <VolumeX size={18} /> : volume < 50 ? <Volume1 size={18} /> : <Volume2 size={18} />}
        </button>
        <input
          type="range"
          min="0"
          max="100"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="w-24 h-1 bg-white/20 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
        />
<<<<<<< HEAD

        {showMore && (
          <div
            ref={popupRef}
            className="fixed bottom-24 left-4 sm:left-20 bg-[#181818] text-white w-72 rounded-xl shadow-lg z-50 p-4"
          >
            <div className="flex gap-3 items-start">
              <div className="w-14 h-14 relative rounded overflow-hidden flex-shrink-0">
                <Image
                  src={currentSong.coverArt || "/placeholder.svg"}
                  alt={currentSong.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 group relative">
                <div className="font-semibold text-base truncate">{currentSong.title}</div>
                <div className="text-sm text-gray-400">{currentSong.artist}</div>
                <div className="absolute bottom-full left-0 mb-2 w-max bg-black/90 text-xs text-white px-3 py-2 rounded hidden group-hover:block z-50 whitespace-nowrap">
                  <div><strong>Album:</strong> {currentSong.album || "Unknown"}</div>
                  <div><strong>Genre:</strong> {Array.isArray(currentSong.genre) ? currentSong.genre.join(", ") : currentSong.genre || "Unknown"}</div>
                </div>
              </div>
              <button onClick={() => {
                setShowMore(false);
                setOptionsOpenId(null);
              }} className="text-gray-400 hover:text-white">
                <X size={16} />
              </button>
            </div>
            <ul className="text-sm mt-4 space-y-2 border-t border-white/10 pt-3">
              <li className="hover:bg-white/10 rounded p-2 cursor-pointer">Add to Playlist</li>
              <li className="hover:bg-white/10 rounded p-2 cursor-pointer">Lyrics</li>
              <li className="hover:bg-white/10 rounded p-2 cursor-pointer">Play next</li>
              <li className="hover:bg-white/10 rounded p-2 cursor-pointer">Block</li>
              <li className="hover:bg-white/10 rounded p-2 cursor-pointer">Copy Link</li>
            </ul>
          </div>
        )}
=======
{showMore && (
  <div 
  ref={popupRef}
  className="fixed bottom-24 left-4 sm:left-20 bg-[#181818] text-white w-72 rounded-xl shadow-lg z-50 p-4">
    {/* Header with image + song info */}
    <div className="flex gap-3 items-start">
      <div className="w-14 h-14 relative rounded overflow-hidden flex-shrink-0">
        <Image
          src={currentSong.coverArt || "/placeholder.svg"}
          alt={currentSong.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1 group relative">
        <div className="font-semibold text-base truncate">
          {currentSong.title}
        </div>
        <div className="text-sm text-gray-400">{currentSong.artist}</div>

        {/* Tooltip on hover */}
        <div className="absolute bottom-full left-0 mb-2 w-max bg-black/90 text-xs text-white px-3 py-2 rounded hidden group-hover:block z-50 whitespace-nowrap">
          <div><strong>Album:</strong> {currentSong.album || "Unknown"}</div>
          <div><strong>Genre:</strong> {Array.isArray(currentSong.genre) ? currentSong.genre.join(", ") : currentSong.genre || "Unknown"}</div>
        </div>
      </div>
<button
  onClick={() => {
    setShowMore(false);
    setOptionsOpenId(null);
  }}
  className="text-gray-400 hover:text-white"
>
  <X size={16} />
</button>
    </div>
    {/* Action Options */}
    <ul className="text-sm mt-4 space-y-2 border-t border-white/10 pt-3">
      <li className="hover:bg-white/10 rounded p-2 cursor-pointer">Add to Playlist</li>
      <li className="hover:bg-white/10 rounded p-2 cursor-pointer">Lyrics</li>
      <li className="hover:bg-white/10 rounded p-2 cursor-pointer">Play next</li>
      <li className="hover:bg-white/10 rounded p-2 cursor-pointer">Block</li>
      <li className="hover:bg-white/10 rounded p-2 cursor-pointer">Copy Link</li>
    </ul>
  </div>
)}
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
      </div>
    </div>
  );
}
