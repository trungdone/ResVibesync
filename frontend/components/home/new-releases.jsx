import Link from "next/link";
import SongList from "../songs/song-list"; 
import { fetchSongs } from "@/lib/api";

export default async function NewReleases() {
  let newReleases = [];
  try {
    newReleases = await fetchSongs({ sort: "releaseYear", limit: 19 });
    // Kiểm tra và trích xuất mảng songs nếu newReleases là object
    newReleases = Array.isArray(newReleases) ? newReleases : newReleases?.songs || [];
  } catch (error) {
    console.error("Error in NewReleases:", error);
    newReleases = [];
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">New Releases</h2>
        <Link href="/new-releases" className="text-sm text-purple-400 hover:underline">
          View All
        </Link>
      </div>
      {newReleases.length > 0 ? (
        <SongList songs={newReleases} />
      ) : (
        <p>No new releases available</p>
      )}
    </section>
  );
}