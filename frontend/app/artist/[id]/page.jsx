"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMusic } from "@/context/music-context";
import { Play, Shuffle, MoreHorizontal, Disc, Heart, Share2, Plus, Eye, User } from "lucide-react";
import { fetchArtistById, fetchSuggestedArtists, followArtist, unfollowArtist } from "@/lib/api/artists";
import { fetchSongsByArtist, fetchTopSongs } from "@/lib/api/songs";
import { fetchAlbumsByArtist } from "@/lib/api/albums";
import SongList from "@/components/songs/song-list";
import { useParams } from "next/navigation";


const RelatedArtistCard = ({ artist }) => (
  <Link href={`/artist/${artist._id || artist.id || "default"}?from=youmaylike`}>
    <div className="bg-gray-800/50 p-4 rounded-lg text-center hover:bg-gray-700/50 transition-transform duration-300 transform hover:scale-105">
      <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden shadow-md">
        <Image
          src={artist.image || "/placeholder.svg"}
          alt={artist.name || "Artist image"}
          fill
          className="object-cover"
        />
      </div>
      <h4 className="text-base font-semibold mt-3 text-white">{artist.name || "Unknown Artist"}</h4>
      <p className="text-xs text-gray-400">{artist.genres?.join(", ") || "No genres available"}</p>
    </div>
  </Link>
);

const AchievementList = ({ achievements }) => (
  <ul className="list-disc list-inside text-gray-300 space-y-3 text-sm">
    {achievements.map((achievement, index) => (
      <li key={index}>{achievement}</li>
    ))}
  </ul>
);

export default function ArtistDetailPage() {
  const { id: artistId } = useParams();

  const [artist, setArtist] = useState(null);
  const [suggestedArtists, setSuggestedArtists] = useState([]);
  const [artistSongs, setArtistSongs] = useState([]);
  const [artistAlbums, setArtistAlbums] = useState([]);
  const [topSongs, setTopSongs] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { playSong } = useMusic();
  const [isShuffling, setIsShuffling] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [previousId, setPreviousId] = useState(null);
  const [navigationLevel, setNavigationLevel] = useState(1);
  const [showAllSongs, setShowAllSongs] = useState(false);
  const [showAllTopSongs, setShowAllTopSongs] = useState(false);
  

 useEffect(() => {
  const token = localStorage.getItem("token");
  if (!artistId || !token) {
    console.warn("⏳ Chưa sẵn sàng để fetch: artistId hoặc token chưa có");
    return;
  }

  async function loadData() {
    try {
      setLoading(true);

      console.log(`🔍 Fetching artist with ID: ${artistId}`);
      const artistData = await fetchArtistById(artistId, token);
      if (!artistData) throw new Error("Artist not found");

      const suggested = await fetchSuggestedArtists(artistId);
      const songs = await fetchSongsByArtist(artistId);
      const albums = await fetchAlbumsByArtist(artistId);
      const top = await fetchTopSongs();

      setArtist(artistData);
      setIsFollowing(artistData.isFollowing || false);

      setSuggestedArtists(suggested.filter(a => a._id !== artistId && a.id !== artistId));
      setArtistSongs(songs);
      setArtistAlbums(albums);
      setTopSongs(top);
      setAchievements(artistData.achievements || []);
      setIsFollowing(artistData?.isFollowing || false);
    } catch (err) {
      console.error("❌ Error loading data:", err);
      setError(err.message || "Failed to load artist data");
    } finally {
      setLoading(false);
    }
  }

  loadData();
}, [artistId]);


  useEffect(() => {
    if (artistId) {
      const searchParams = new URLSearchParams(window.location.search);
      if (!previousId || searchParams.get("from") !== "youmaylike") {
        setNavigationLevel(1);
      } else {
        setNavigationLevel(2);
      }
      setPreviousId(artistId);
    }
  }, [artistId, previousId]);


  // ✅ Toggle follow / unfollow nghệ sĩ
 const toggleFollow = async () => {
  const artistId = artist?.id;
  console.log("👤 artist object:", artist);
  console.log("🆔 artistId resolved:", artistId);

  if (!artistId) {
    console.warn("⚠️ Artist ID is missing");
    return;
  }

  try {
    console.log("🔁 toggleFollow called for:", artistId);
    console.log("📌 Trạng thái trước: isFollowing =", isFollowing);

    if (isFollowing) {
      console.log("🗑️ Gửi yêu cầu UNFOLLOW...");
      await unfollowArtist(artistId);
      setIsFollowing(false);
      setArtist((prev) => {
        const updated = { ...prev, followerCount: Math.max((prev.followerCount || 1) - 1, 0) }; // 🔧 sửa ở đây
        console.log("🔽 followerCount sau unfollow:", updated.followerCount);
        return updated;
      });
    } else {
      console.log("➕ Gửi yêu cầu FOLLOW...");
      await followArtist(artistId);
      setIsFollowing(true);
      setArtist((prev) => {
        const updated = { ...prev, followerCount: (prev.followerCount || 0) + 1 }; // 🔧 sửa ở đây
        console.log("🔼 followerCount sau follow:", updated.followerCount);
        return updated;
      });
    }

    console.log("📌 Trạng thái sau: isFollowing =", !isFollowing);
  } catch (err) {
    console.error("❌ Lỗi khi follow/unfollow:", err);
  }
};




  const handlePlayAll = () => {
    if (artistSongs.length > 0) {
      try {
        playSong(artistSongs[0]);
        setIsPlaying(true);
        setTimeout(() => setIsPlaying(false), 2000);
      } catch (err) {
        console.error("❌ Play song error:", err);
      }
    }
  };

  const toggleShuffle = () => setIsShuffling(prev => !prev);
  const toggleMenu = () => setShowMenu(prev => !prev);
  const toggleShowSongs = () => setShowAllSongs(prev => !prev);
  const toggleShowTopSongs = () => setShowAllTopSongs(prev => !prev);

  const visibleSongs = showAllSongs ? artistSongs : artistSongs.slice(0, 5);
  const visibleTopSongs = showAllTopSongs ? topSongs : topSongs.slice(0, 5);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="flex justify-center items-center h-[60vh] bg-gray-900 text-gray-300">
        {error || "Artist not found"}
      </div>
    );
  }

   return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div
        className="relative h-96 bg-gradient-to-b from-purple-800/50 to-gray-900 flex flex-col justify-end p-6"
        style={{
          backgroundImage: `url(${artist.image || "/placeholder.svg"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
        }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        <div className="relative z-10 flex flex-col md:flex-row gap-4 items-center md:items-end">
          <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-lg overflow-hidden shadow-2xl">
            <Image
              src={artist.image || "/placeholder.svg"}
              alt={artist.name}
              fill
              priority
              className="object-cover"
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">{artist.name}</h1>
            <p className="text-gray-300 text-base mb-4 max-w-2xl">{artist.bio || "No bio available"}</p>
            <p className="text-gray-400 text-sm mb-4">
               Followers: <span className="font-semibold text-white">{artist.followerCount?.toLocaleString() || 0}</span>
            </p>

            <div className="flex flex-col md:flex-row gap-4 items-center">
              <button
                className={`bg-green-500 text-black font-semibold px-6 py-3 rounded-full flex items-center gap-2 transition-colors duration-300 ${
                  isPlaying ? "bg-green-600" : "hover:bg-green-400"
                } disabled:opacity-50`}
                onClick={handlePlayAll}
                disabled={artistSongs.length === 0}
              >
                <Play size={20} /> Play All
              </button>
              <button
                className={`bg-gray-800 text-gray-300 px-6 py-3 rounded-full flex items-center gap-2 transition-colors duration-300 ${
                  isShuffling ? "bg-green-600 hover:bg-green-400" : "hover:bg-gray-700"
                }`}
                onClick={toggleShuffle}
              >
                <Shuffle size={20} /> Shuffle
              </button>
              {/* follow */}
              <button
                className={`bg-gray-800 text-gray-300 px-6 py-3 rounded-full flex items-center gap-2 transition-colors duration-300 ${
                  isFollowing ? "bg-green-600 hover:bg-green-400" : "hover:bg-gray-700"
                }`}
                onClick={toggleFollow}
              >
                {isFollowing ? (
                  <>
                    <Heart size={20} fill="currentColor" /> Following
                  </>
                ) : (
                  <>
                    <Heart size={20} /> Follow
                  </>
                )}
              </button>
              <div className="relative">
                <button
                  className={`bg-gray-800 text-gray-300 px-6 py-3 rounded-full flex items-center gap-2 transition-colors duration-300 ${
                    showMenu ? "bg-green-600 hover:bg-green-400" : "hover:bg-gray-700"
                  }`}
                  onClick={toggleMenu}
                >
                  <MoreHorizontal size={20} /> More
                </button>
                {showMenu && (
                  <div className="absolute left-auto right-0 mt-2 w-56 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg py-2 z-10 border border-gray-700 origin-right">
                    <button className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 flex items-center gap-2">
                      <Share2 size={18} /> Share
                    </button>
                    <button className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 flex items-center gap-2">
                      <Plus size={18} /> Add to Playlist
                    </button>
                    <button className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 flex items-center gap-2">
                      <Eye size={18} /> View Artist Details
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-12">
        <div>
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Play size={24} className="text-green-500" /> Songs
          </h3>
          {artistSongs.length > 0 ? (
            <>
              <SongList songs={visibleSongs} />
              {artistSongs.length > 5 && (
                <button
                  onClick={toggleShowSongs}
                  className="mt-4 text-purple-400 hover:underline text-sm"
                >
                  {showAllSongs ? "Ẩn bớt" : "Xem thêm"}
                </button>
              )}
            </>
          ) : (
            <p className="text-gray-400">No songs available for this artist.</p>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Disc size={24} className="text-green-500" /> Albums
            </h3>
            <Link href="/artists" className="text-sm text-purple-400 hover:underline">
              View All
            </Link>
          </div>
          {artistAlbums.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {artistAlbums.map((album, index) => (
                <div
                  key={album._id || `album-${index}`}
                  className="bg-gray-800/50 p-4 rounded-lg hover:bg-gray-700/50 transition-transform duration-300 transform hover:scale-105"
                >
                  <div className="relative w-full h-40 rounded-lg overflow-hidden shadow-md">
                    <Image
                      src={album.cover_art || "/placeholder.svg"}
                      alt={album.title}
                      fill
                      className="object-cover"
                      onError={(e) => console.error(`Image load error for ${album.title}:`, e)}
                    />
                  </div>
                  <h4 className="text-base font-semibold mt-3">{album.title}</h4>
                  <p className="text-xs text-gray-400">{album.releaseYear}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No albums available for this artist.</p>
          )}
        </div>

        {navigationLevel === 1 && suggestedArtists.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <Heart size={24} className="text-green-500" /> You May Like
              </h3>
              <Link href="/artists" className="text-sm text-purple-400 hover:underline">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {suggestedArtists.map((artist, index) => (
                <RelatedArtistCard
                  key={artist._id || `suggested-${index}`}
                  artist={artist}
                />
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <User size={24} className="text-green-500" /> About {artist.name}
          </h3>
          <div className="flex flex-col md:flex-row gap-8 bg-gray-800/50 p-6 rounded-lg">
            <div className="md:w-1/3">
              <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={artist.image || "/placeholder.svg"}
                  alt={`${artist.name} profile`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="md:w-2/3">
              <p className="text-gray-300 mb-6 text-base">{artist.bio || "No bio available"}</p>
              <h4 className="text-xl font-semibold mb-3">Achievements</h4>
              <AchievementList achievements={achievements} />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Play size={24} className="text-green-500" /> Top Songs of the Month
          </h3>
          {topSongs.length > 0 ? (
            <>
              <SongList songs={visibleTopSongs} />
              {topSongs.length > 5 && (
                <button
                  onClick={toggleShowTopSongs}
                  className="mt-4 text-purple-400 hover:underline text-sm"
                >
                  {showAllTopSongs ? "Ẩn bớt" : "Xem thêm"}
                </button>
              )}
            </>
          ) : (
            <p className="text-gray-400">No top songs available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
