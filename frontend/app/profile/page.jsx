"use client"

import { useState, useEffect } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SongList from "@/components/songs/song-list";
import PlaylistGrid from "@/components/playlist/playlist-grid";
import { getAllPlaylists } from "@/lib/api/playlists";
import { useRouter } from "next/navigation";
import { fetchHistory, fetchFollowingArtists } from "@/lib/api/user";


export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  const [historySongs, setHistorySongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [followingArtists, setFollowingArtists] = useState([]);


  useEffect(() => {
    const token = localStorage.getItem("token"); // ✅ Lấy token trong useEffect

    if (!token) {
      router.push("/signin");
      return;
    }

    async function loadData() {
      try {
        setLoading(true);

        const userResponse = await fetch("http://localhost:8000/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userResponse.json();

        const followingData = await fetchFollowingArtists();
        setFollowingArtists(followingData.following || []);

        const detail = Array.isArray(userData.detail)
          ? userData.detail.map((d) => d.msg).join(", ")
          : userData.detail || "Unauthorized";

        if (!userResponse.ok) throw new Error(detail);
        setUser(userData);

        const playlistData = await getAllPlaylists();
        setPlaylists(playlistData.slice(0, 8) || []);

        const songData = await getAllPlaylists();
        const songs = Array.isArray(songData) ? songData : songData?.songs || [];
        setLikedSongs(songs.slice(0, 10)); // ✅ vẫn dùng cho likedSongs

        // 🎯 Lấy lịch sử nghe từ API
        const historyRes = await fetchHistory(userData.id); 
        setHistorySongs(historyRes.history || []);

      } catch (err) {
        console.error("Failed to load profile data:", err);
        router.push("/signin");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  if (loading || !user) {
    return <div className="flex justify-center items-center h-[60vh]">Loading...</div>;
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center gap-6">
        <div className="relative w-32 h-32 rounded-full overflow-hidden">
          <Image
            src={user?.avatar || "/placeholder.svg?height=128&width=128&query=user+avatar"}
            alt="Profile"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{user?.name || "User Name"}</h1>
          <p className="text-gray-400">{user?.email || "user@example.com"}</p>
          <div className="flex gap-4 mt-2">
            <div>
              <span className="text-gray-400">Playlists</span>
              <p className="font-semibold">{playlists.length}</p>
            </div>
            <div>
              <span className="text-gray-400">Following</span>
              <p className="font-semibold">{followingArtists.length}</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="playlists">
        <TabsList className="bg-white/5">
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
          <TabsTrigger value="liked">Liked Songs</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>
        <TabsContent value="playlists" className="mt-6">
          <PlaylistGrid playlists={playlists} />
        </TabsContent>
        <TabsContent value="liked" className="mt-6">
          <SongList songs={likedSongs} />
        </TabsContent>
        <TabsContent value="history" className="mt-6">
  {historySongs.length === 0 ? (
    <p className="text-gray-400">Bạn chưa nghe bài hát nào gần đây.</p>
  ) : (
    <ul className="space-y-4">
      {historySongs.map((item) => (
        <li
          key={item._id}
          className="flex items-center gap-4 p-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition"
        >
          <div className="relative w-14 h-14 flex-shrink-0">
            <Image
              src={item.song_info?.coverArt || "/placeholder.svg"}
              alt={item.song_info?.title || "Bài hát"}
              fill
              className="object-cover rounded"
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="font-semibold truncate">{item.song_info?.title}</div>
            <div className="text-sm text-gray-400 truncate">{item.song_info?.artist}</div>
          </div>
          <div className="text-xs text-gray-500 whitespace-nowrap">
            {new Date(item.timestamp).toLocaleString("vi-VN")}
          </div>
        </li>
      ))}
    </ul>
  )}
</TabsContent>

        <TabsContent value="following" className="mt-6">
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {followingArtists.length === 0 ? (
      <p className="text-gray-400">You are not following any artists.</p>
    ) : (
      followingArtists.map((artist) => (
        <div key={artist.id} className="bg-gray-800 p-4 rounded-lg text-center">
          <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden">
            <Image
              src={artist.image || "/placeholder.svg"}
              alt={artist.name}
              fill
              className="object-cover"
            />
          </div>
          <h4 className="mt-2 text-white font-semibold">{artist.name}</h4>
          <p className="text-sm text-gray-400">{artist.genres?.join(", ")}</p>
        </div>
      ))
    )}
  </div>
</TabsContent>

      </Tabs>
    </div>
  );
}