"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
<<<<<<< HEAD
import { fetchSongs } from "@/lib/api";
=======
import axios from "axios";
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6

const MusicContext = createContext();

export function MusicProvider({ children }) {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0);
<<<<<<< HEAD
  const audioRef = useRef(typeof Audio !== "undefined" ? new Audio() : null);

  useEffect(() => {
    fetchSongs().then((data) => {
      const normalized = data?.map((song) => ({
        ...song,
        id: song._id || song.id, // ✅ Chuẩn hóa id
      })) || [];
      setSongs(normalized);
    });
  }, []);

  useEffect(() => {
    if (!currentSong || !audioRef.current) return;

    audioRef.current.src = currentSong.audioUrl;

    audioRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch((err) => {
        console.warn("🎵 Không thể tự động phát:", err.message);
      });
  }, [currentSong]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

=======
  const [context, setContext] = useState("new-releases");
  const [contextId, setContextId] = useState(null);
  const audioRef = useRef(null);

  const resetPlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setCurrentSong(null);
    setIsPlaying(false);
  };

  const updateSongsForContext = async (newContext, newContextId) => {
    try {
      if (!newContextId && ["album", "playlist", "artist"].includes(newContext)) return;

      const token = localStorage.getItem("token");
      let data = [];

      if (newContext === "album") {
        const res = await axios.get(`http://localhost:8000/api/albums/${newContextId}/songs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        data = res.data.songs || [];
      } else if (newContext === "playlist") {
        const res = await axios.get(`http://localhost:8000/api/playlists/${newContextId}/songs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        data = res.data.songs || [];
      } else if (newContext === "artist") {
        const res = await axios.get(`http://localhost:8000/api/songs?artistId=${newContextId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        data = res.data.songs || [];
      }

      setSongs(data);
    } catch (err) {
      console.error("❌ updateSongsForContext failed:", err);
      setSongs([]);
    }
  };

  // ✅ CHỈ fetch khi songs rỗng
  useEffect(() => {
    if (!context || !contextId) return;
    if (songs.length === 0) {
      updateSongsForContext(context, contextId);
    }
  }, [context, contextId]);

  const playSong = (song) => {
    if (!song || !song.id) return;
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
<<<<<<< HEAD
      if (audio.currentTime === audio.duration) {
        audio.currentTime = 0;
      }
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const playSong = (song) => {
    if (!song || !song.audioUrl) return;
    setCurrentSong({
      ...song,
      id: song._id || song.id, // ✅ Đảm bảo luôn có .id
    });
  };

  const nextSong = () => {
    if (!songs.length || !currentSong) return;

    const idx = songs.findIndex((s) => s.id === currentSong.id);
    let next = null;

=======
      if (audio.currentTime >= audio.duration) audio.currentTime = 0;
      audio.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  const nextSong = () => {
    if (!songs.length || !currentSong) return;
    const idx = songs.findIndex(s => s.id.toString() === currentSong.id.toString());
    if (idx === -1) return playSong(songs[0]);

    let next;
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
    if (isShuffling) {
      let r;
      do {
        r = Math.floor(Math.random() * songs.length);
      } while (r === idx && songs.length > 1);
      next = songs[r];
    } else {
      const isLast = idx === songs.length - 1;
      if (isLast) {
        if (repeatMode === 2) next = songs[0];
<<<<<<< HEAD
        else {
          setIsPlaying(false);
          return;
        }
      } else next = songs[idx + 1];
    }

    if (next) setCurrentSong(next);
=======
        else if (repeatMode === 1) return audioRef.current.play();
        else return setIsPlaying(false);
      } else {
        next = songs[idx + 1];
      }
    }
    if (next) playSong(next);
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
  };

  const prevSong = () => {
    if (!songs.length || !currentSong) return;
<<<<<<< HEAD
    const idx = songs.findIndex((s) => s.id === currentSong.id);
    const prev = songs[(idx - 1 + songs.length) % songs.length];
    setCurrentSong(prev);
  };

  const toggleShuffle = () => setIsShuffling((prev) => !prev);
  const toggleRepeat = () => setRepeatMode((mode) => (mode + 1) % 3);

  return (
    <MusicContext.Provider
      value={{
        songs,
        currentSong,
        isPlaying,
        isShuffling,
        repeatMode,
        audioRef,
        playSong,
        togglePlayPause,
        nextSong,
        prevSong,
        toggleShuffle,
        toggleRepeat,
      }}
    >
=======
    const idx = songs.findIndex(s => s.id.toString() === currentSong.id.toString());
    if (idx === -1) return playSong(songs[0]);

    let prev;
    if (idx === 0) {
      if (repeatMode === 2) prev = songs[songs.length - 1];
      else if (repeatMode === 1) return audioRef.current.play();
      else return setIsPlaying(false);
    } else {
      prev = songs[idx - 1];
    }
    if (prev) playSong(prev);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (repeatMode === 1) {
        audio.currentTime = 0;
        audio.play();
      } else {
        nextSong();
      }
    };

    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [currentSong, repeatMode, songs, isShuffling]);

  return (
    <MusicContext.Provider value={{
      songs, currentSong, isPlaying, isShuffling, repeatMode,
      audioRef, playSong, togglePlayPause, nextSong, prevSong, setSongs,
      toggleShuffle: () => setIsShuffling(p => !p),
      toggleRepeat: () => setRepeatMode(m => songs.length <= 1 ? (m === 1 ? 0 : 1) : (m + 1) % 3),
      resetPlayer, setContext, setContextId, updateSongsForContext
    }}>
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
      {children}
    </MusicContext.Provider>
  );
}

export const useMusic = () => useContext(MusicContext);
