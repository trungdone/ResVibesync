"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { fetchLikedSongs, fetchHistory } from "@/lib/api/user";
import { getAllPlaylists } from "@/lib/api/playlists";
import SongList from "@/components/songs/song-list";
import PlaylistGrid from "@/components/playlist/playlist-grid";

export default function ArtistProfileView() {
  const { user, loading: authLoading } = useAuth();
  const [likedSongs, setLikedSongs] = useState([]);
  const [history, setHistory] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/signin");
      return;
    }

const loadData = async () => {
  try {
    const [liked, historyRes, playlistData] = await Promise.all([
      fetchLikedSongs(),
      fetchHistory(user.id),
      getAllPlaylists(), // nếu không cần user.id
    ]);

    setLikedSongs(
      (liked.liked || []).map((song) => ({
        id: song._id || song.id,
        title: song.title,
        artist: song.artist,
        coverArt: song.coverArt,
        audioUrl: song.audioUrl,
      }))
    );

    setHistory(
      (historyRes.history || []).map((item) => ({
        id: item.song_info?.id,
        title: item.song_info?.title,
        artist: item.song_info?.artist,
        coverArt: item.song_info?.coverArt,
        audioUrl: item.song_info?.audioUrl,
      }))
    );

    setPlaylists(playlistData || []);
  } catch (error) {
    console.error("❌ Error loading profile view:", error);
    router.push("/signin");
  } finally {
    setLoading(false);
  }
};

    loadData();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return <div className="flex justify-center items-center h-[60vh]">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      {/* Header */}
      <div className="flex items-center gap-8">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-600">
          <Image
            src={user?.avatar || "/placeholder.svg"}
            alt="Artist Avatar"
            width={128}
            height={128}
            className="object-cover w-full h-full"
          />
        </div>
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-2 text-white">
            {user?.name}
            {user?.role === "artist" && (
              <Image
                src="/verified-badge-3d-icon.png"
                alt="Verified"
                width={40}
                height={40}
                className="ml-2"
              />
            )}
          </h1>
          <p className="text-gray-300">Email: {user?.email}</p>
          <p className="text-gray-400 mt-2">Role: {user?.role}</p>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-10">
        <section>
          <h2 className="text-2xl font-semibold text-purple-400 mb-3">Playlists</h2>
          <PlaylistGrid playlists={playlists} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-purple-400 mb-3">Liked Songs</h2>
          <SongList songs={likedSongs} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-purple-400 mb-3">Listening History</h2>
          <SongList songs={history} />
        </section>
      </div>
    </div>
  );
}
