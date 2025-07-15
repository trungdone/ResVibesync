"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Music4 } from "lucide-react";
import { fetchArtists } from "@/lib/api";

export default function AllArtistsSection() {
  const [artists, setArtists] = useState([]);
  const [activeArtistId, setActiveArtistId] = useState(null); // ID nghệ sĩ đang được click

  useEffect(() => {
    fetchArtists()
      .then((data) => {
        if (data?.artists) setArtists(data.artists);
      })
      .catch(console.error);
  }, []);

  if (!artists || artists.length === 0) {
    return <p className="text-white">No artists found.</p>;
  }

  return (
    <section className="w-full space-y-8">
      {/* Grid hiển thị nghệ sĩ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-8">
        {artists.map((artist) => (
          <div key={artist.id} className="group text-center space-y-4">
            {/* Ảnh nghệ sĩ lớn hơn + có border trắng khi được click */}
            <div
              className={`relative w-52 h-52 mx-auto rounded-full overflow-hidden transition-transform duration-300 group-hover:scale-105 ${
                activeArtistId === artist.id ? "ring-4 ring-white" : ""
              }`}
              onClick={() => setActiveArtistId(artist.id)}
            >
              <Link href={`/artist/${artist.id}`}>
                <Image
                  src={artist.image || "/placeholder.svg"}
                  alt={artist.name}
                  fill
                  className="object-cover"
                />
              </Link>
            </div>

            {/* Tên + icon + thể loại */}
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <Music4
                  size={18}
                  className="text-white group-hover:text-[#00FFC6] transition-colors duration-300"
                />
                <h3 className="text-white font-semibold truncate max-w-[200px]">
                  {artist.name}
                </h3>
              </div>
              <p className="text-sm text-gray-400">
                {Array.isArray(artist.genres) && artist.genres.length > 0
                  ? artist.genres[0]
                  : "Unknown"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
