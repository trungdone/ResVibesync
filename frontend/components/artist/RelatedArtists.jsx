"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { RelatedArtistCard } from "./RelatedArtistCard";

export default function RelatedArtists({ suggestedArtists = [], navigationLevel = 1 }) {
  if (navigationLevel !== 1 || suggestedArtists.length === 0) return null;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold flex items-center gap-2">
          <Heart size={24} className="text-green-500" /> You May Like
        </h3>
        <Link href="/artists" className="text-sm text-purple-400 hover:underline">
          View All
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {suggestedArtists.map((artist, index) => (
          <RelatedArtistCard key={artist._id || `suggested-${index}`} artist={artist} />
        ))}
      </div>
    </div>
  );
}
