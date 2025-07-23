"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchTopSongs } from "@/lib/api/songs";

const backgroundImages = [
  { time: "7AM", src: "/7am.jpg" },
  { time: "12PM", src: "/12pm.jpg" },
  { time: "6PM", src: "/18pm.jpg" },
];

export default function FeaturedSection() {
  const [songs, setSongs] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [bgIndex, setBgIndex] = useState(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 0;
    if (hour >= 12 && hour < 18) return 1;
    return 2;
  });
  const [songIndex, setSongIndex] = useState(0);

  const featuredBg = backgroundImages[bgIndex].src;

  const handlePrev = () => setBgIndex((prev) => (prev - 1 + backgroundImages.length) % backgroundImages.length);
  const handleNext = () => setBgIndex((prev) => (prev + 1) % backgroundImages.length);

  const handleSongPrev = () => {
    const newIndex = (songIndex - 1 + songs.length) % songs.length;
    setSongIndex(newIndex);
    setFeatured(songs[newIndex]);
  };

  const handleSongNext = () => {
    const newIndex = (songIndex + 1) % songs.length;
    setSongIndex(newIndex);
    setFeatured(songs[newIndex]);
  };

  useEffect(() => {
    async function loadSongs() {
      const topSongs = await fetchTopSongs(20);
      const validSongs = topSongs.filter((song) => song.coverArt?.startsWith("http"));
      setSongs(validSongs);
      if (validSongs.length > 0) {
        const randomIndex = Math.floor(Math.random() * validSongs.length);
        setFeatured(validSongs[randomIndex]);
        setSongIndex(randomIndex);
      }
    }
    loadSongs();
  }, []);

  useEffect(() => {
    if (!songs.length) return;
    const interval = setInterval(() => {
      const newIndex = Math.floor(Math.random() * songs.length);
      setFeatured(songs[newIndex]);
      setSongIndex(newIndex);
    }, 5000);
    return () => clearInterval(interval);
  }, [songs]);

  if (!featured) return null;

  return (
    <div className="relative w-full mx-0 h-[340px] md:h-[400px] lg:h-[450px] rounded-2xl overflow-hidden shadow-xl ring-1 ring-purple-700/30 group transition-all duration-500 hover:ring-4 hover:ring-purple-500/50 hover:shadow-2xl">

      {/* Background */}
      <div className="absolute inset-0 transition-all duration-700 ease-in-out group-hover:scale-105 group-hover:brightness-110">
        <Image src={featuredBg} alt="Background" fill priority className="object-cover" />
      </div>

      <div className="absolute inset-0 bg-black/60" />

      {/* Dot Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
        {backgroundImages.map((_, idx) => (
          <span
            key={idx}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === bgIndex ? "bg-white" : "bg-white/40"}`}
          />
        ))}
      </div>

      {/* Background Switch */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full"
      >
        <ChevronRight size={24} />
      </button>

      {/* Content */}
      <div className="relative h-full flex flex-col md:flex-row items-center justify-between p-6 md:p-10 gap-6">
      <div className="w-[300px] h-[300px] rounded-2xl overflow-hidden ring-2 ring-purple-600 shadow-md hover:ring-4 hover:ring-purple-400 transition-all duration-300 relative">
      <Image
       src={featured.coverArt}
       alt={featured.title}
       width={300}
       height={300}
       className="object-cover w-full h-full"
      />

     {/* Song Controls */}
     <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-3">
      <button
      onClick={handleSongPrev}
      className="bg-white/20 hover:bg-white/40 p-1 rounded-full text-white"
      >
      <ChevronLeft size={16} />
      </button>
      <button
      onClick={handleSongNext}
      className="bg-white/20 hover:bg-white/40 p-1 rounded-full text-white"
      >
      <ChevronRight size={16} />
     </button>
     </div>
     </div>
        <div className="flex-1 text-white">
          <h2 className="text-purple-400 text-sm uppercase mb-1">Featured Song</h2>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{featured.title}</h1>
          <p className="text-gray-200 mb-5 max-w-2xl">
            {featured.description || "Enjoy this specially curated track for the moment."}
          </p>

          <div className="flex gap-4 flex-wrap">
            <Link href={`/song/${featured.id}`} className="btn-primary flex items-center gap-2">
              <Play size={18} /> Listen Now
            </Link>
            <Link href={`/artist/${featured.artistId || 1}`} className="btn-secondary">
              View Artist
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
