"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { searchAll } from "@/lib/api/search";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const [results, setResults] = useState({ songs: [], artists: [], albums: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  console.log("🎯 Album results:", results.albums);
}, [results.albums]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ songs: [], artists: [], albums: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchAll(query.trim());
        setResults(data);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const topArtist = results.artists?.[0] || null;

  return (
    <section className="p-6 space-y-12">
      {/* -------- Kết quả hàng đầu -------- */}
      {topArtist && (
        <div className="flex items-center gap-8">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4">Kết quả hàng đầu</h2>
            <Link href={`/artist/${topArtist._id || topArtist.id}`} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition">
              <Image
                src={topArtist.image || topArtist.avatar_url || "/placeholder.svg"}
                alt={topArtist.name}
                width={96}
                height={96}
                className="rounded-full object-cover"
              />
              <div>
                <h3 className="text-xl font-semibold">{topArtist.name}</h3>
                <p className="text-sm text-gray-400">Nghệ sĩ</p>
              </div>
            </Link>
          </div>

          {/* Songs list next to top artist */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4">Bài hát</h2>
            <div className="space-y-3">
              {results.songs.slice(0, 4).map((song) => (
                <Link
                  key={song._id || song.id}
                  href={`/song/${song._id || song.id}`}
                  className="flex items-center justify-between p-3 rounded hover:bg-white/5"
                >
                  <div className="flex items-center gap-4">
                    <Image
                      src={song.coverArt || "/placeholder.svg"}
                      alt={song.title}
                      width={56}
                      height={56}
                      className="rounded object-cover"
                    />
                    <div>
                      <p className="font-medium">{song.title}</p>
                      <p className="text-xs text-gray-400">
                        {song.artist?.name || song.artist || "Unknown Artist"}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDuration(song.duration)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* -------- Albums -------- */}
<ResultBlock title="Albums" loading={loading} items={results.albums}>
  <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
    {results.albums.map((album) => {
      const cover =
        album.cover_art ||
        album.cover_url ||
        album.coverArt ||
        album.coverImage ||
        "/placeholder.svg";
      const releaseYear = album.release_year || album.releaseYear || "";

      return (
        <Link
          key={album._id || album.id}
          href={`/album/${album._id || album.id}`}
          className="flex flex-col gap-2 hover:bg-white/5 p-3 rounded"
        >
          <Image
            src={cover}
            alt={album.title}
            width={160}
            height={160}
            className="w-full aspect-square object-cover rounded"
          />
          <p className="text-sm font-medium leading-tight truncate">{album.title}</p>
          {releaseYear && (
            <p className="text-xs text-gray-500">{releaseYear}</p>
          )}
        </Link>
      );
    })}
  </div>
</ResultBlock>

    </section>
  );
}

function ResultBlock({ title, loading, items, children }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {loading ? (
        <p className="text-gray-400">Đang tải…</p>
      ) : items?.length ? (
        children
      ) : (
        <p className="text-gray-500 italic">Không tìm thấy {title.toLowerCase()} nào.</p>
      )}
    </div>
  );
}

function formatDuration(sec = 0) {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
