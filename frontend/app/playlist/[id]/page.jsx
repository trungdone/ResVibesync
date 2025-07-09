import { notFound } from "next/navigation";
import SongList from "@/components/songs/song-list";
import { getPlaylistById } from "@/lib/api/playlists";
import { getSongById } from "@/lib/api/songs";

// ⛳️ Metadata (dynamic browser title based on playlist name)
export async function generateMetadata({ params }) {

  const id = typeof params?.id === "string" ? params.id : undefined;

  if (!id) return { title: "Playlist" };

  try {
    const playlist = await getPlaylistById(id);
    return { title: playlist?.title || "Playlist" };
  } catch {
    return { title: "Playlist not found" };
  }
}

export default async function PlaylistPage({ params }) {
  const id = typeof params?.id === "string" ? params.id : undefined;

  if (!id) return notFound();

  const playlist = await getPlaylistById(id);
  if (!playlist) return notFound();

  // 🧠 Fetch full song data using songIds array
  let songDetails = [];
  try {
    if (Array.isArray(playlist.songIds)) {
      const promises = playlist.songIds.map((songId) => getSongById(songId));
      songDetails = await Promise.all(promises);
    }
  } catch (err) {
    console.error("❌ Failed to fetch songs:", err);
  }

  const validSongs = songDetails.filter(Boolean); // Remove nulls

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-6">
        <img
          src={playlist.coverArt || "/placeholder.svg"}
          alt="Playlist cover"
          className="w-40 h-40 object-cover rounded shadow"
        />
        <div>
          <h1 className="text-3xl font-bold">{playlist.title}</h1>
          <p className="text-gray-400">{playlist.description || "No description."}</p>
          <p className="text-sm text-muted-foreground">
            {validSongs.length} {validSongs.length === 1 ? "song" : "songs"}
          </p>
        </div>
      </div>

      <SongList songs={validSongs} />
    </div>
  );
}