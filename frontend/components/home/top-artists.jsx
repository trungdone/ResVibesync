

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react"; // Thêm useState để giữ dữ liệu artists
import PlayArtistButton from "@/components/artist/play-artist-button";
import { fetchArtists } from "@/lib/api";

export default function TopArtists() {
  const [artists, setArtists] = useState([]); // State để lưu artists

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchArtists() || {};
        const fetchedArtists = data.artists || [];
        setArtists(fetchedArtists.slice(0, 10)); // Giới hạn 10 nghệ sĩ
      } catch (error) {
        console.error("Error fetching artists:", error);
        setArtists([]);
      }
    };
    fetchData();
  }, []);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">Top Artists</h2>
        <Link
          href="/viewAll/artists"
          className="text-sm font-medium text-white hover:text-purple-600 transition-colors"
        >
          View All
        </Link>
      </div>

      <div
        className="flex space-x-4 overflow-x-auto"
        style={{
          WebkitOverflowScrolling: 'touch', // Tối ưu cuộn trên iOS
          msOverflowStyle: 'none',         // Ẩn thanh cuộn cho IE và Edge
          scrollbarWidth: 'none',          // Ẩn thanh cuộn cho Firefox
          touchAction: 'pan-x',            // Cho phép cuộn ngang bằng cảm ứng
        }}
      >
        {artists.map((artist) => (
          <div
            key={artist.id}
            className="group relative flex-none w-40 md:w-48"
          >
            {/* Container ảnh với bo góc rõ rệt */}
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden group-hover:shadow-lg group-hover:shadow-purple-500/20 transition-all">
              <Link href={`/artist/${artist.id}`}>
                <Image
                  src={artist.image || "/placeholder.svg"}
                  alt={artist.name}
                  fill
                  className="object-cover group-hover:scale-105 group-hover:brightness-110 transition-all duration-300"
                />
              </Link>

              {/* Thông tin nghệ sĩ lồng vào ảnh, luôn hiển thị */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <h3 className="font-medium text-white truncate">{artist.name}</h3>
                <p className="text-xs text-gray-300 truncate">
                  {Array.isArray(artist.genres) && artist.genres.length > 0
                    ? artist.genres[0]
                    : "Unknown"}
                </p>
              </div>

              {/* Nút phát nhạc */}
              <PlayArtistButton artistId={artist.id} />
            </div>
          </div>
        ))}
        {/* Ẩn thanh cuộn cho Webkit-based browsers (Chrome, Safari, Opera) */}
        <style jsx>{`
          .overflow-x-auto::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </section>
  );
}