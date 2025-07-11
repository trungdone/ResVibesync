"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Image from "next/image";
import Link from "next/link";
import { Music, User, Disc, PlayCircle } from "lucide-react";
import SongList from "@/components/songs/song-list";
import PlaylistGrid from "@/components/playlist/playlist-grid";
import Player from "@/components/player";

export default function ArtistDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [artist, setArtist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "artist") {
      router.push("/signin");
      return;
    }

async function loadData() {
  try {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("⚠️ Missing token");
      router.push("/signin");
      return;
    }

    const artistResponse = await fetch("http://localhost:8000/api/artist/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!artistResponse.ok) {
      const text = await artistResponse.text();
      throw new Error(`Failed to fetch artist profile: ${artistResponse.status} - ${text}`);
    }

    const data = await artistResponse.json();
    setArtist(data);
    setSongs(data.songs || []);
    setAlbums(data.albums || []);
  } catch (err) {
    console.error("❌ Load failed:", err.message);
    router.push("/signin");
  } finally {
    setLoading(false);
  }
}

    if (!authLoading) loadData();
  }, [user, authLoading]);

  if (authLoading || loading || !artist) {
    return <div className="flex justify-center items-center h-[60vh]">Loading...</div>;
  }

  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto">
      <div className="flex items-center gap-6 bg-gradient-to-r from-purple-600 to-indigo-600 p-8 rounded-2xl">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white/10">
          <Image
            src={artist.image || "/placeholder.svg?height=128&width=128&query=artist+avatar"}
            alt="Artist Profile"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white">{artist.name}</h1>
          <p className="text-gray-200">{artist.bio || "No bio available"}</p>
          <div className="flex gap-6 mt-4">
            <div>
              <span className="text-gray-300">Songs</span>
              <p className="font-semibold text-white">{songs.length}</p>
            </div>
            <div>
              <span className="text-gray-300">Albums</span>
              <p className="font-semibold text-white">{albums.length}</p>
            </div>
            <div>
              <span className="text-gray-300">Followers</span>
              <p className="font-semibold text-white">{artist.followers}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Link href="/role_artist/profile" className="btn-primary flex items-center gap-2">
          <User size={20} /> Edit Profile
        </Link>
        <Link href="/role_artist/songs" className="btn-primary flex items-center gap-2">
          <PlayCircle size={20} /> Manage Songs
        </Link>
        <Link href="/role_artist/albums" className="btn-primary flex items-center gap-2">
          <Disc size={20} /> Manage Albums
        </Link>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="bg-white/5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="songs">Songs</TabsTrigger>
          <TabsTrigger value="albums">Albums</TabsTrigger>
        </TabsList>
      <TabsContent value="overview" className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
      <h2 className="text-2xl font-bold mb-4">Recent Songs</h2>
      <SongList songs={songs.slice(0, 5)} />
    </div>
    <div>
      <h2 className="text-2xl font-bold mb-4">Recent Albums</h2>
      <PlaylistGrid
        playlists={albums.slice(0, 4).map((album) => ({
          id: album.id,
          title: album.title,
          slug: album.id,
          coverArt: album.cover_art?.startsWith("http")
            ? album.cover_art
            : `http://localhost:8000/${album.cover_art}`,
          creator: artist?.name || "Unknown",
        }))}
      />
       </div>
      </div>
      </TabsContent>
        <TabsContent value="songs" className="mt-6">
          <SongList songs={songs} />
        </TabsContent>
     <TabsContent value="albums" className="mt-6">
     <PlaylistGrid
     playlists={albums.map((album) => ({
      id: album.id,
      title: album.title,
      slug: album.id,
      coverArt: album.cover_art?.startsWith("http")
        ? album.cover_art
        : `http://localhost:8000/${album.cover_art}`,
      creator: artist?.name || "Unknown",
    }))}
    />
    </TabsContent>
      </Tabs>
    </div>
  );
}