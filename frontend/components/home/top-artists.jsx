
import Image from "next/image";
import Link from "next/link";
import { fetchArtists } from "@/lib/api";
import PlayArtistButton from "@/components/artist/play-artist-button"; // ✅ Thêm nút phát

export default async function TopArtists() {
  const data = await fetchArtists() || {};
  const artists = data.artists || [];
  const topArtists = artists.slice(0, 6);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">Top Artists</h2>
        <Link href="/artists" className="text-sm text-purple-400 hover:underline">
          View All
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {topArtists.map((artist) => (
          <div key={artist.id} className="group relative">
            {/* Avatar + Hover effect */}
            <div className="relative aspect-square rounded-full overflow-hidden mb-3 group-hover:shadow-lg group-hover:shadow-purple-500/20 transition-all">
              <Link href={`/artist/${artist.id}`}>
                <Image
                  src={artist.image || "/placeholder.svg"}
                  alt={artist.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>

              {/* Nút phát nhạc */}
              <PlayArtistButton artistId={artist.id} />
            </div>

            {/* Info */}
            <h3 className="font-medium text-center text-white truncate">{artist.name}</h3>
            <p className="text-sm text-gray-400 text-center">
              {Array.isArray(artist.genres) && artist.genres.length > 0 ? artist.genres[0] : "Unknown"}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
