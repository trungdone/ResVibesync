"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {Disc, Play, Shuffle, Heart, MoreHorizontal, Share2, Plus, Eye, } from "lucide-react";
import { fetchAlbumById, fetchAlbums } from "@/lib/api/albums";
import { fetchSongsByIds } from "@/lib/api/songs";
import { fetchArtistById } from "@/lib/api/artists";
import { useMusic } from "@/context/music-context";
import SongList from "@/components/songs/song-list";

// Mock API function for following/unfollowing an artist
async function toggleFollowArtist(artistId, follow) {
  try {
    console.log(`${follow ? "Following" : "Unfollowing"} artist with ID: ${artistId}`);
    // Replace with actual API call here
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle follow:", error);
    return { success: false, error: error.message };
  }
}

export default function AlbumDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = String(params.id);

  const isFromOtherAlbums = searchParams.get("from") === "other";

  const [album, setAlbum] = useState(null);
  const [artist, setArtist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [artistAlbums, setArtistAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [queuedSongs, setQueuedSongs] = useState([]);
  const menuRef = useRef(null);

  const { playSong } = useMusic();

  // Close More menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    async function loadAlbumData() {
      try {
        setLoading(true);

        const albumData = await fetchAlbumById(id);
        if (!albumData) throw new Error("Album not found");
        setAlbum(albumData);

        const artistData = await fetchArtistById(albumData.artist_id);
        if (!artistData) throw new Error("Artist not found");
        setArtist(artistData);

        if (albumData.songs && albumData.songs.length > 0) {
          const songsData = await fetchSongsByIds(albumData.songs);
          setSongs(songsData);
        }

        if (!isFromOtherAlbums) {
          const albumsData = await fetchAlbums();
          setArtistAlbums(
            albumsData
              .filter((a) => a.artist_id !== albumData.artist_id)
              .slice(0, 4)
          );
        } else {
          setArtistAlbums([]);
        }
      } catch (err) {
        console.error("Error fetching album data:", err);
        setError(err?.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    loadAlbumData();
  }, [id, isFromOtherAlbums]);

  const handlePlayAll = () => {
    if (songs.length > 0) {
      setQueuedSongs(songs);
      playSong(songs[0]);
      setIsPlaying(true);
      setIsShuffling(false);
      setTimeout(() => setIsPlaying(false), 2000);
    }
  };

  const handleShuffle = () => {
    if (songs.length > 0) {
      const shuffledSongs = [...songs].sort(() => Math.random() - 0.5);
      setQueuedSongs(shuffledSongs);
      playSong(shuffledSongs[0]);
      setIsShuffling(true);
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 2000);
    }
  };

  const handleFollow = async () => {
    if (!artist) return;
    const result = await toggleFollowArtist(artist._id, !isFollowing);
    if (result.success) {
      setIsFollowing((prev) => !prev);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setShowMenu(false);
  };

  const handleAddToPlaylist = () => {
    console.log("Adding album songs to playlist:", songs);
    setShowMenu(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-[60vh]">Loading...</div>;
  }

  if (error || !album) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-red-500">
        {error || "Album not found"} (ID: {id})
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24 max-w-6xl mx-auto">
      {/* Album Details */}
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start p-4 bg-gray-900 rounded-lg shadow-lg">
        <div className="relative w-64 h-64 rounded-lg overflow-hidden">
          <Image
            src={album.cover_art || "/placeholder.svg"}
            alt={album.title}
            fill
            priority
            className="object-cover"
          />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl font-bold text-white mb-2">{album.title}</h1>
          <p className="text-gray-300">Release Year: {album.release_year || "Unknown"}</p>
          <p className="text-gray-300">Genre: {album.genres || "Unknown"}</p>
          <p className="text-gray-300">
            Artist: {artist ? artist.name : "Unknown Artist"}
          </p>

          <div className="flex flex-col md:flex-row gap-4 items-center mt-4">
            {/* Play All */}
            <button
              className={`bg-green-500 text-black font-semibold px-6 py-3 rounded-full flex items-center gap-2 transition-colors duration-300 ${
                isPlaying ? "bg-green-600" : "hover:bg-green-400"
              } disabled:opacity-50`}
              onClick={handlePlayAll}
              disabled={songs.length === 0}
              aria-label="Play all songs"
            >
              <Play size={20} /> Play All
            </button>

            {/* Shuffle */}
            <button
              className={`bg-gray-800 text-gray-300 px-6 py-3 rounded-full flex items-center gap-2 transition-colors duration-300 ${
                isShuffling ? "bg-green-600 hover:bg-green-400" : "hover:bg-gray-700"
              }`}
              onClick={handleShuffle}
              disabled={songs.length === 0}
              aria-label="Shuffle songs"
            >
              <Shuffle size={20} /> Shuffle
            </button>

            {/* Follow */}
            <button
              className={`bg-gray-800 text-gray-300 px-6 py-3 rounded-full flex items-center gap-2 transition-colors duration-300 ${
                isFollowing ? "bg-green-600 hover:bg-green-400" : "hover:bg-gray-700"
              }`}
              onClick={handleFollow}
              disabled={!artist}
              aria-label={isFollowing ? "Unfollow artist" : "Follow artist"}
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

            {/* More Menu */}
            <div className="relative" ref={menuRef}>
              <button
                className={`bg-gray-800 text-gray-300 px-6 py-3 rounded-full flex items-center gap-2 transition-colors duration-300 ${
                  showMenu ? "bg-green-600 hover:bg-green-400" : "hover:bg-gray-700"
                }`}
                onClick={() => setShowMenu(!showMenu)}
                aria-label="More options"
                aria-expanded={showMenu}
              >
                <MoreHorizontal size={20} /> More
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg py-2 z-10 border border-gray-700 origin-right">
                  <button
                    className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                    onClick={handleShare}
                    aria-label="Share album"
                  >
                    <Share2 size={18} /> Share
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                    onClick={handleAddToPlaylist}
                    aria-label="Add to playlist"
                  >
                    <Plus size={18} /> Add to Playlist
                  </button>
                  {artist && (
                    <Link
                      href={`/artist/${artist._id}`}
                      className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                      onClick={() => setShowMenu(false)}
                      aria-label="View artist details"
                    >
                      <Eye size={18} /> View Artist Details
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Songs List */}
      <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-white mb-4">Songs</h3>
        {songs.length > 0 ? (
          <SongList songs={songs} queuedSongs={queuedSongs} />
        ) : (
          <p className="text-gray-400">No songs available for this album.</p>
        )}
      </div>

      {/* Other Albums */}
      {!isFromOtherAlbums && artistAlbums.length > 0 && (
        <div className="mt-6 bg-gray-800/70 backdrop-blur-md p-4 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Disc size={20} className="text-green-500" /> Other Albums
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {artistAlbums.map((otherAlbum) => (
              <Link
                key={otherAlbum.id}
                href={`/album/${otherAlbum.id}?from=other`}
                className="bg-gray-700/50 p-3 rounded-lg hover:bg-gray-600/50 transition-all duration-300 block"
              >
                <div className="relative w-full h-32 rounded-lg overflow-hidden shadow-md">
                  <Image
                    src={otherAlbum.cover_art || "/placeholder.svg"}
                    alt={otherAlbum.title}
                    fill
                    loading="lazy"
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <h4 className="text-sm font-medium mt-2 truncate">{otherAlbum.title}</h4>
                <p className="text-xs text-gray-400">
                  Year: {otherAlbum.release_year || "Unknown"}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
