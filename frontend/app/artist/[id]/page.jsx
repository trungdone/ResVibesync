"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Play, Shuffle, MoreHorizontal, Share2, Plus, Eye, Heart
} from "lucide-react";

import { fetchArtistById, fetchSuggestedArtists, followArtist, unfollowArtist } from "@/lib/api/artists";
import { fetchSongsByArtist, fetchTopSongs } from "@/lib/api/songs";
import { fetchAlbumsByArtist } from "@/lib/api/albums";

import { useMusic } from "@/context/music-context";
import ArtistSongs from "@/components/artist/ArtistSongs";
import ArtistAlbums from "@/components/artist/ArtistAlbums";
import TopSongs from "@/components/artist/TopSongs";
import RelatedArtists from "@/components/artist/RelatedArtists";

export default function ArtistDetailPage() {
  const { id: artistId } = useParams();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const hasFetchedSuggestions = useRef(false);

  const [artist, setArtist] = useState(null);
  const [artistSongs, setArtistSongs] = useState([]);
  const [artistAlbums, setArtistAlbums] = useState([]);
  const [topSongs, setTopSongs] = useState([]);
  const [suggestedArtists, setSuggestedArtists] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  const {
    setSongs,
    setContext,
    setContextId,
    playSong,
    toggleShuffle,
    isShuffling
  } = useMusic();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!artistId || !token) return;

    const loadData = async () => {
      try {
        setLoading(true);

        const [artistData, songs, albums] = await Promise.all([
          fetchArtistById(artistId, token),
          fetchSongsByArtist(artistId),
          fetchAlbumsByArtist(artistId),
        ]);

        setArtist(artistData);
        setIsFollowing(artistData?.isFollowing || false);
        setArtistSongs(songs);
        setArtistAlbums(albums);

        setContext("artist");
        setContextId(artistId);

        if (from !== "youmaylike" && !hasFetchedSuggestions.current) {
          const suggested = await fetchSuggestedArtists(artistId);
          setSuggestedArtists(suggested.filter(a => a._id !== artistId));
          hasFetchedSuggestions.current = true;
        }

        const top = await fetchTopSongs();
        setTopSongs(top);
      } catch (err) {
        console.error("❌ Error loading artist data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [artistId, from]);

  const handlePlayAll = () => {
    if (artistSongs.length > 0) {
      setSongs(artistSongs);
      setContext("artist");
      setContextId(artistId);
      setTimeout(() => {
        playSong(artistSongs[0]);
      }, 0);
    }
  };

  const handleShuffle = () => {
    toggleShuffle();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => alert("Link copied!"))
      .catch(err => console.error("Clipboard error:", err));
  };

  const handleAddToPlaylist = () => {
    alert("⚙️ Add to playlist coming soon.");
  };

  const toggleFollow = async () => {
    const resolvedArtistId = artist?._id || artist?.id;
    if (!resolvedArtistId) {
      console.warn("⚠️ Artist ID is missing");
      return;
    }

    try {
      if (isFollowing) {
        await unfollowArtist(resolvedArtistId);
        setIsFollowing(false);
        setArtist((prev) => ({
          ...prev,
          followerCount: Math.max((prev.followerCount || 1) - 1, 0),
        }));
      } else {
        await followArtist(resolvedArtistId);
        setIsFollowing(true);
        setArtist((prev) => ({
          ...prev,
          followerCount: (prev.followerCount || 0) + 1,
        }));
      }
    } catch (err) {
      console.error("❌ Error in follow/unfollow:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Header ảnh lớn phong cách cũ */}
      <div className="relative h-[420px] w-full bg-gradient-to-br from-indigo-900 via-purple-800 to-black">
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end h-full px-8 pb-8 gap-8">
          <div className="relative w-44 h-44 md:w-64 md:h-64 rounded-lg overflow-hidden shadow-2xl border-4 border-white/20">
            <Image
              src={artist.image || "/placeholder.svg"}
              alt={artist.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold drop-shadow-md">
              {artist.name}
            </h1>
            <p className="mt-2 text-gray-300 max-w-2xl">
              {artist.bio || "No bio available."}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Followers:{" "}
              <span className="text-white font-semibold">
                {artist.followerCount?.toLocaleString() || 0}
              </span>
            </p>
            <div className="mt-4 flex flex-wrap gap-4">
              <button
                onClick={handlePlayAll}
                className="bg-green-500 text-black font-semibold px-6 py-3 rounded-full flex items-center gap-2 hover:bg-green-400"
              >
                <Play size={20} /> Play All
              </button>
              <button
                onClick={handleShuffle}
                className={`px-6 py-3 rounded-full flex items-center gap-2 transition duration-300 ease-in-out transform hover:scale-105 ${
                  isShuffling
                    ? "bg-green-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                <Shuffle size={20} />
                Shuffle
              </button>
              <button
                onClick={toggleFollow}
                className={`px-6 py-3 rounded-full flex items-center gap-2 transition-colors duration-300 ${
                  isFollowing
                    ? "bg-green-600 text-white hover:bg-green-400"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
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
                  onClick={() => setShowMenu(prev => !prev)}
                  className={`px-6 py-3 rounded-full flex items-center gap-2 ${
                    showMenu
                      ? "bg-green-600"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  <MoreHorizontal size={20} /> More
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
                    <button
                      className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                      onClick={handleShare}
                    >
                      <Share2 size={18} /> Share
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                      onClick={handleAddToPlaylist}
                    >
                      <Plus size={18} /> Add to Playlist
                    </button>
                    <Link
                      href={`/artist/${artist._id}`}
                      className="block px-4 py-2 hover:bg-gray-700 text-sm text-gray-300"
                      onClick={() => setShowMenu(false)}
                    >
                      <Eye size={18} className="inline-block mr-2" />
                      View Artist
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        <ArtistSongs songs={artistSongs} />
        <ArtistAlbums albums={artistAlbums} />
        {topSongs.length > 0 && <TopSongs topSongs={topSongs} />}
        {suggestedArtists.length > 0 && from !== "youmaylike" && (
          <RelatedArtists suggestedArtists={suggestedArtists} />
        )}
      </div>
    </div>
  );
}
