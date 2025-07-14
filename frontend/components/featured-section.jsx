"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchTopSongs } from "@/lib/api/songs";

// Mảng ảnh theo thời điểm
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

  // Xử lý nút chuyển ảnh
  const handlePrev = () => setBgIndex((prev) => (prev - 1 + backgroundImages.length) % backgroundImages.length);
  const handleNext = () => setBgIndex((prev) => (prev + 1) % backgroundImages.length);

  const featuredBg = backgroundImages[bgIndex].src;

  // Load bài hát
  useEffect(() => {
    async function loadSongs() {
      const topSongs = await fetchTopSongs(20);
      const validSongs = topSongs.filter((song) => song.coverArt?.startsWith("http"));
      setSongs(validSongs);
      if (validSongs.length > 0) {
        const random = validSongs[Math.floor(Math.random() * validSongs.length)];
        setFeatured(random);
      }
    }
    loadSongs();
  }, []);

  // Đổi bài hát mỗi 60s
  useEffect(() => {
    if (!songs.length) return;
    const interval = setInterval(() => {
      const random = songs[Math.floor(Math.random() * songs.length)];
      setFeatured(random);
    }, 60000);
    return () => clearInterval(interval);
  }, [songs]);

  if (!featured) return null;

  return (
    <div className="relative w-full max-w-6xl mx-auto h-[340px] md:h-[400px] lg:h-[450px] rounded-2xl overflow-hidden shadow-xl ring-1 ring-purple-700/30 group transition-all duration-500 hover:ring-4 hover:ring-purple-500/50 hover:shadow-2xl">
      
      {/* Ảnh nền có hiệu ứng hover */}
      <div className="absolute inset-0 transition-all duration-700 ease-in-out group-hover:scale-105 group-hover:brightness-110">
        <Image
          src={featuredBg}
          alt="Background"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Overlay đen để chữ nổi bật */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Nút chuyển trái/phải */}
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

      {/* Nội dung bài hát */}
      <div className="relative z-20 h-full flex flex-col md:flex-row items-center justify-between p-6 md:p-10 gap-6">
        {/* Ảnh bài hát */}
        <div className="w-[160px] h-[160px] rounded-xl overflow-hidden ring-2 ring-purple-600 shadow-md hover:ring-4 hover:ring-purple-400 transition-all duration-300">
          <Image
            src={featured.coverArt}
            alt={featured.title}
            width={160}
            height={160}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Văn bản */}
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
