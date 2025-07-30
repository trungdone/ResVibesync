"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { searchAll } from "@/lib/api/search";
import { recordSearch } from "@/lib/api/listen";
import { useAuth } from "@/context/auth-context"; // ✅ Add this

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const router = useRouter();
  const { user } = useAuth(); // ✅ Get logged-in user

  const [results, setResults] = useState({ songs: [], artists: [], albums: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setLoading(true);
      fetch("http://localhost:8000/api/search")
        .then((res) => res.json())
        .then(setResults)
        .catch((err) => console.error("Failed to fetch trending:", err))
        .finally(() => setLoading(false));
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchAll(query.trim());
        setResults(data);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const topArtist = results.artists?.[0] || null;

  return (
    <section className="p-6 space-y-12">
      {/* 🔝 Top Result + Songs */}
      <div className="flex flex-col lg:flex-row gap-10">
        {/* 🎯 Top Result */}
        {topArtist && (
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4">Top Result</h2>
            <Link
              href={`/artist/${topArtist._id || topArtist.id}`}
              className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition"
            >
              <Image
                src={topArtist.image || topArtist.avatar_url || "/placeholder.svg"}
                alt={topArtist.name}
                width={96}
                height={96}
                className="rounded-full object-cover"
              />
              <div>
                <h3 className="text-xl font-semibold">{topArtist.name}</h3>
                <p className="text-sm text-gray-400">Artist</p>
              </div>
            </Link>
          </div>
        )}

        {/* 🎵 Songs */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-4">Songs</h2>
          <div className="space-y-3">
            {results.songs.slice(0, 4).map((song) => (
              <div
                key={song._id || song.id}
                className="flex items-center justify-between p-3 rounded hover:bg-white/5 cursor-pointer"
                onClick={async () => {
                  if (user?.id) {
                    try {
                      await recordSearch(user.id, song._id || song.id, new Date().toISOString());
                    } catch (err) {
                      console.error("Failed to record search:", err);
                    }
                  }
                  router.push(`/song/${song._id || song.id}`);
                }}
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
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 💿 Albums */}
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

// 📦 Section container for each result block
function ResultBlock({ title, loading, items, children }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {loading ? (
        <p className="text-gray-400">Loading…</p>
      ) : items?.length ? (
        children
      ) : (
        <p className="text-gray-500 italic">No {title.toLowerCase()} found.</p>
      )}
    </div>
  );
}

// ⏱ Format duration in mm:ss
function formatDuration(sec = 0) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
