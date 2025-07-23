"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Top100 from "./Top100"; // ✅ Đã import

const newReleases = [
  {
    title: "Trao Về Anh",
    artist: "Juky San",
    time: "2 hours ago",
    region: "vietnam",
    image: "/jukysan.jpg",
  },
  {
    title: "Chinatown",
    artist: "Jaigon Orchestra",
    time: "Today",
    region: "international",
    image: "/chinatown.jpg",
    premium: true,
  },
  {
    title: "I'LL BE THERE",
    artist: "EM XINH, Orange",
    time: "Yesterday",
    region: "vietnam",
    image: "/illbethere.jpg",
  },
  {
    title: "Cruel Summer",
    artist: "Taylor Swift",
    time: "2 days ago",
    region: "usuk",
    image: "/taylor.jpg",
  },
  {
    title: "Kill This Love",
    artist: "BLACKPINK",
    time: "3 days ago",
    region: "usuk",
    image: "/blackpink.jpg",
  },
];

export default function DiscoveryPage() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredReleases = newReleases.filter((song) => {
    if (activeTab === "all") return true;
    return song.region === activeTab;
  });

  return (
    <div className="p-6 text-white space-y-10">
      {/* ✅ GỌI COMPONENT Top100 */}
      <Top100 />

      {/* NEW RELEASES SECTION */}
      <section>
        <h2 className="text-2xl font-bold mb-2">International Music</h2>

        <div className="flex gap-2 mb-6">
          {["all", "vietnam", "international", "usuk"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm px-3 py-1 rounded border border-white/10 ${
                activeTab === tab
                  ? "bg-white/20 text-white font-semibold"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {tab === "all"
                ? "All"
                : tab === "vietnam"
                ? "Vietnam"
                : tab === "international"
                ? "International"
                : "US-UK"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReleases.map((song, index) => (
            <div
              key={index}
              className="flex items-center gap-4 bg-white/5 hover:bg-white/10 p-3 rounded-lg"
            >
              <Image
                src={song.image}
                alt={song.title}
                width={60}
                height={60}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h4 className="font-semibold">{song.title}</h4>
                <p className="text-sm text-gray-400">{song.artist}</p>
                <p className="text-xs text-gray-500">{song.time}</p>
              </div>
              {song.premium && (
                <span className="text-xs text-yellow-300 border border-yellow-300 rounded px-2 py-0.5">
                  PREMIUM
                </span>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
