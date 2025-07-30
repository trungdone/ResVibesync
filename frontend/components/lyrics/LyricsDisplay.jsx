"use client";
import { useEffect, useRef, useState } from "react";
import { useMusic } from "@/context/music-context";

export default function LyricsDisplay({ lrc, songId }) {
  const { isPlaying, currentSong } = useMusic();
  const lines = lrc.split("\n").filter(Boolean);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);

  // Reset index khi đổi bài hát
  useEffect(() => {
    setCurrentIndex(0);
  }, [songId]);

  // Chạy lyric khi đang play
  useEffect(() => {
    if (isPlaying && currentSong?.id === songId) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev < lines.length - 1) return prev + 1;
          clearInterval(intervalRef.current);
          return prev;
        });
      }, 3000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, currentSong?.id, songId, lines]);

  // Auto scroll tới dòng
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const scrollY = currentIndex * 40;
      container.scrollTo({ top: scrollY, behavior: "smooth" });
    }
  }, [currentIndex]);

  return (
   <div
   ref={containerRef}
   className="scroll-container relative h-32 overflow-y-auto rounded-xl p-4 border border-purple-700/30 shadow-[0_0_20px_#a855f7] custom-scroll transition-all duration-300"
   style={{
    background: `linear-gradient(to bottom, #3b0a4d, #2e063b, #240632, #1d052a)`,
    }}
    >
      <div className="flex flex-col space-y-1">
        {lines.map((line, idx) => {
          const baseStyle =
            "text-center text-base font-semibold transition-all duration-500";
          const gradientStyle =
            idx === currentIndex
              ? {
                  background: "linear-gradient(to right, #a855f7, #f472b6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }
              : {};
          const className =
            idx < currentIndex
              ? `${baseStyle} text-gray-500 opacity-40`
              : idx === currentIndex
              ? `${baseStyle} scale-105 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]`
              : `${baseStyle} text-gray-800 opacity-70`;

          return (
            <div
              key={idx}
              className={className}
              style={{
                height: "2.5rem",
                lineHeight: "2.5rem",
                ...gradientStyle,
              }}
            >
              {line}
            </div>
          );
        })}
      </div>
    </div>
  );
}
