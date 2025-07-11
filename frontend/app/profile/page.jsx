"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SongList from "@/components/songs/song-list";
import PlaylistGrid from "@/components/playlist/playlist-grid";
import { getAllPlaylists } from "@/lib/api/playlists";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/auth-context";
import { useNotifications } from "@/context/notification-context";
import { fetchArtistSuggestions } from "@/lib/api/artists";
import { fetchHistory, fetchFollowingArtists,fetchLikedSongs } from "@/lib/api/user";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  const [historySongs, setHistorySongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotifications();
  const router = useRouter();
  const [followingArtists, setFollowingArtists] = useState([]);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestData, setRequestData] = useState({
    name: "",
    bio: "",
    social_links: [],
    genres: [],
    phone: "",
    image: "",
  });
  const [suggestions, setSuggestions] = useState([]);
  const [selectedArtistId, setSelectedArtistId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    if (authLoading) return; 

    if (!user) {
      router.push("/signin");
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);

        // 1. Playlists
        const playlistData = await getAllPlaylists();
        setPlaylists(playlistData.slice(0, 8) || []);

        // 2. Liked songs (tạm thời từ getAllPlaylists)
        const songData = await getAllPlaylists();
        const songs = Array.isArray(songData) ? songData : songData?.songs || [];
        const likedRes = await fetchLikedSongs();
        console.log("🔥 likedRes:", likedRes);
console.log("✅ likedRes.liked:", likedRes.liked);
        setLikedSongs(likedRes.liked || []);

        // 3. History
        const historyRes = await fetchHistory(user.id);
        setHistorySongs(historyRes.history || []);

        // 4. Following artists
        const followingData = await fetchFollowingArtists();
        setFollowingArtists(followingData.following || []);
      } catch (err) {
        console.error("❌ Lỗi khi load dữ liệu profile:", err);
        toast({
          title: "Lỗi",
          description: "Không thể tải dữ liệu hồ sơ.",
          variant: "destructive",
        });
        router.push("/signin");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, authLoading, router]);
  
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (requestData.name.length < 2) return;
      const results = await fetchArtistSuggestions(requestData.name);
      setSuggestions(results);
    }, 300);
    return () => clearTimeout(delay);
  }, [requestData.name]);

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/api/artist_requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...requestData,
          matched_artist_id: selectedArtistId || null,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit artist request");

      setSuccess("Artist request submitted successfully");
      addNotification({
        type: "info",
        title: "Artist Request Sent",
        message: "Your artist request has been sent and is pending review.",
        created_at: new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }),
      });

      setShowRequestForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (authLoading || loading || !user) {
    return <div className="flex justify-center items-center h-[60vh]">Loading...</div>;
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-8">
        <div className="relative w-32 h-32 rounded-full overflow-hidden">
          <Image
            src={user?.avatar || "/placeholder.svg?height=128&width=128&query=user+avatar"}
            alt="Profile"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            {user?.name || "User Name"}
            {user.role === "artist" && (
              <Image
                src="/verified-badge-3d-icon.png"
                alt="Verified Artist"
                width={50}
                height={50}
                className="w-16 h-12"
              />
            )}
          </h1>
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
          {user.role !== "artist" && (
            !showNotice ? (
              <Button onClick={() => setShowNotice(true)} className="btn-primary mt-4">
                Become an Artist
              </Button>
            ) : (
              <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-200 p-3 rounded-lg mt-4 space-y-2">
                <p className="text-sm">
                  By requesting an artist role, your account will be reviewed.
                </p>
                <div className="flex gap-2 mt-2">
                  <Button onClick={() => setShowRequestForm(true)} className="btn-primary">
                    Continue
                  </Button>
                  <Button variant="secondary" onClick={() => setShowNotice(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {showRequestForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Request Artist Role</h2>
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-white p-3 rounded-lg mb-4">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-500/20 border border-green-500 text-white p-3 rounded-lg mb-4">
                {success}
              </div>
            )}
            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Artist Name
                </label>
                <Input
                  id="name"
                  placeholder="Enter artist name..."
                  value={requestData.name}
                  onChange={(e) => {
                    setRequestData({ ...requestData, name: e.target.value });
                    setSelectedArtistId(null);
                  }}
                  required
                />
                {suggestions.length > 0 && (
                  <ul className="bg-white shadow rounded mt-2 max-h-40 overflow-y-auto z-50">
                    {suggestions.map((artist) => (
                      <li
                        key={artist.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setRequestData({ ...requestData, name: artist.name });
                          setSelectedArtistId(artist.id);
                          setSuggestions([]);
                        }}
                      >
                        {artist.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">
                  Bio
                </label>
                <Textarea
                  id="bio"
                  value={requestData.bio}
                  onChange={(e) => setRequestData({ ...requestData, bio: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                  Phone
                </label>
                <Input
                  id="phone"
                  value={requestData.phone}
                  onChange={(e) => setRequestData({ ...requestData, phone: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-1">
                  Artist Image URL
                </label>
                <Input
                  id="image"
                  placeholder="Or paste artist image URL"
                  value={requestData.image}
                  onChange={(e) => setRequestData({ ...requestData, image: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="genres" className="block text-sm font-medium text-gray-300 mb-1">
                  Genres (comma-separated)
                </label>
                <Input
                  id="genres"
                  placeholder="Pop, Rock, EDM"
                  value={requestData.genres.join(", ")}
                  onChange={(e) =>
                    setRequestData({
                      ...requestData,
                      genres: e.target.value.split(",").map((g) => g.trim()),
                    })
                  }
                />
              </div>

              <div>
                <label htmlFor="social_links" className="block text-sm font-medium text-gray-300 mb-1">
                  Social Links (comma-separated)
                </label>
                <Input
                  id="social_links"
                  placeholder="https://facebook.com/you, https://instagram.com/you"
                  value={requestData.social_links.join(", ")}
                  onChange={(e) =>
                    setRequestData({
                      ...requestData,
                      social_links: e.target.value.split(",").map((link) => link.trim()),
                    })
                  }
                />
              </div>

              <div className="flex gap-4 mt-4">
                <Button type="submit" className="btn-primary w-full">
                  Submit Request
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowRequestForm(false)}
                  className="btn-secondary w-full"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Tabs defaultValue="playlists">
        <TabsList className="bg-white/5">
          <TabsTrigger value="playlists" className="text-sm">🎧 Playlists</TabsTrigger>
          <TabsTrigger value="liked" className="text-sm">❤️ Liked</TabsTrigger>
          <TabsTrigger value="history" className="text-sm">🕘 History</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>
        <TabsContent value="playlists" className="mt-6">
          <PlaylistGrid playlists={playlists} />
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
<TabsContent value="liked" className="mt-6">
  {likedSongs.length === 0 ? (
    <p className="text-gray-400">You have not liked any song yet.</p>
  ) : (
    <ul className="space-y-4">
      {likedSongs.map((song) => (
        <li
          key={song.id}
          className="flex items-center gap-4 p-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition"
        >
          <div className="relative w-14 h-14 flex-shrink-0">
            <Image
              src={song.coverArt || "/placeholder.svg"}
              alt={song.title || "Bài hát"}
              fill
              className="object-cover rounded"
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="font-semibold truncate">{song.title}</div>
            <div className="text-sm text-gray-400 truncate">{song.artist}</div>
          </div>
        </li>
      ))}
    </ul>
  )}
</TabsContent>

      </Tabs>
    </div>
  );
}
