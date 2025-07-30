import Link from "next/link";
import { fetchSongs } from "@/lib/api";
import SongList from "@/components/songs/song-list.jsx";
import PlayNewReleasesClient from "./play-new-releases-client"; // Nút Play All

export default async function NewReleasesSection() {
  const fetched = await fetchSongs({ sort: "releaseYear", limit: 25 });
  const newReleases = Array.isArray(fetched) ? fetched : fetched?.songs || [];

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        {/* Tiêu đề + Nút Play */}
        <div className="flex items-center gap-3">
          <Link
            href="/viewAll/songs"
            className="text-2xl font-bold text-white hover:text-purple-600 transition-colors"
          >
            New Releases
          </Link>
          <PlayNewReleasesClient songs={newReleases} />
        </div>

        {/* Nút View All */}
        <Link
          href="/viewAll/songs"
          className="text-sm font-medium text-white hover:text-purple-600 transition-colors"
        >
          View All
        </Link>
      </div>

      {/* Danh sách bài hát */}
      {newReleases.length > 0 ? (
        <SongList
          songs={newReleases}
          enablePlayContext
          contextName="new-releases"
        />
      ) : (
        <p className="text-gray-400">No new releases available</p>
      )}
    </section>
  );
}
