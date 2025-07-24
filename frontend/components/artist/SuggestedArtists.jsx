// components/artist/SuggestedArtists.jsx
"use client";

import Link from "next/link";
import Image from "next/image";

export default function SuggestedArtists({ artists }) {
  if (!artists || artists.length === 0) return null;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-green-500">💡</span> You May Like
        </h3>
        <Link href="/artists" className="text-sm text-purple-400 hover:underline">
          View All
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {artists.map((artist, index) => (
          <Link
            href={`/artist/${artist._id || artist.id || "default"}?from=youmaylike`}
            key={artist._id || `suggested-${index}`}
          >
            <div className="bg-gray-800/50 p-4 rounded-lg text-center hover:bg-gray-700/50 transition-transform duration-300 transform hover:scale-105">
              <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden shadow-md">
                <Image
                  src={artist.image || "/placeholder.svg"}
                  alt={artist.name || "Artist image"}
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="text-base font-semibold mt-3 text-white">{artist.name || "Unknown Artist"}</h4>
              <p className="text-xs text-gray-400">{artist.genres?.join(", ") || "No genres available"}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
