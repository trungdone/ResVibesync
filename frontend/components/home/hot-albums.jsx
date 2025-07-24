import Image from "next/image";
import Link from "next/link";
import { fetchAlbums } from "@/lib/api/albums";
import PlayAlbumButton from "@/components/album/play-album-button"; // ✅ Client component nhỏ

export default async function HotAlbums() {
  const albums = await fetchAlbums({ limit: 12 }) || [];

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">Hot Albums</h2>
        <Link
          href="/viewAll/albums"
          className="text-sm font-medium text-[#39FF14] hover:underline hover:text-white transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
{albums.map((album) => (
  <div key={album.id} className="relative group">
    {/* Container for image and Play button */}
    <div className="relative aspect-square rounded-lg overflow-hidden mb-3 bg-gray-800 group-hover:shadow-lg group-hover:shadow-purple-500/20 transition-all">
      <Link href={`/album/${album.id}`}>
        <Image
          src={album.cover_art || "/placeholder.svg"}
          alt={album.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* ✅ Play button needs pointerEvents none on parent or stopPropagation */}
      <PlayAlbumButton albumId={album.id} />
    </div>

    <h3 className="text-sm font-medium text-center text-white truncate">{album.title}</h3>
    <p className="text-xs text-gray-400 text-center">{album.release_year}</p>
  </div>
))}
      </div>
    </section>
  );
}