"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import PlayAlbumButton from "@/components/album/play-album-button";
import { fetchAlbums } from "@/lib/api/albums";

export default function HotAlbums() {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const loadAlbums = async () => {
      const fetchedAlbums = await fetchAlbums({ limit: 12 }) || [];
      setAlbums(fetchedAlbums.slice(0, 10));
    };
    loadAlbums();
  }, []);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/viewAll/albums"
            className="text-2xl font-bold text-white hover:text-purple-500 transition-colors"
          >
            Hot Albums
          </Link>
        </div>
        <Link
          href="/viewAll/albums"
          className="text-sm font-medium text-white hover:text-purple-500 transition-colors"
        >
          View All
        </Link>
      </div>

      <div
        className="flex space-x-4 overflow-x-auto"
        style={{
          WebkitOverflowScrolling: 'touch',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          touchAction: 'pan-x',
        }}
      >
        {albums.map((album) => (
          <div
            key={album.id}
            className="relative group flex-shrink-0"
            style={{ width: "250px" }}
          >
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-800 group-hover:shadow-md group-hover:shadow-gray-500 transition-all duration-500">
              <Link href={`/album/${album.id}`}>
                <Image
                  src={album.cover_art || "/placeholder.svg"}
                  alt={album.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </Link>
              <PlayAlbumButton albumId={album.id} />
            </div>
            <h3 className="text-sm font-medium text-center text-white truncate mt-2">{album.title}</h3>
            <p className="text-xs text-gray-400 text-center">{album.release_year}</p>
          </div>
        ))}
        <style jsx>{`
          .overflow-x-auto::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </section>
  );
}