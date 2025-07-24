import Link from "next/link"
import PlaylistGrid from "./playlist-grid"
import { getAllPublicPlaylists } from "@/lib/api/playlists";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export default async function RecommendedPlaylists() {
  // Fetch playlists from API
  const playlistsData = (await getAllPublicPlaylists() || []).filter(p => p.isPublic);
  // Filter first 6 playlists
  const recommendedPlaylists = playlistsData.slice(0, 6)


  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Recommended for You</h2>
        <Link href="/recommendations" className="text-sm text-purple-400 hover:underline">
          View All
        </Link>
      </div>

      <PlaylistGrid playlists={recommendedPlaylists} />
    </section>
  )
 
}