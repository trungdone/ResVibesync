"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { fetchAlbumById } from "@/lib/api/albums";
import SongList from "@/components/songs/song-list";
import { fetchSongsByIds } from "@/lib/api/songs";
import { fetchArtistById } from "@/lib/api/artists";

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
  const id = params.id;
  const [isFollowing, setIsFollowing] = useState(false);
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [songs, setSongs] = useState([]);
  const [artist, setArtist] = useState(null); 

useEffect(() => {
  async function loadAlbum() {
    try {
      setLoading(true);

      const albumData = await fetchAlbumById(id);
      if (!albumData) throw new Error("Album not found");

      setAlbum(albumData);

      // ✅ Fetch chi tiết các bài hát
      if (albumData.songs && albumData.songs.length > 0) {
        const songsData = await fetchSongsByIds(albumData.songs);
        setSongs(songsData);
        const artistData = await fetchArtistById(albumData.artist_id);
setArtist(artistData);
      }
    } catch (err) {
      console.error("Error fetching album:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  loadAlbum();
}, [id]);

  const handleFollow = async () => {
    if (!artist) return;
    const result = await toggleFollowArtist(artist._id, !isFollowing);
    if (result.success) {
      setIsFollowing((prev) => !prev);
    }
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
          <p className="text-gray-300">Release Year: {album.release_year}</p>
          <p className="text-gray-300">Genre: {album.genres}</p>
          <p className="text-gray-300">
          Artist: {artist ? artist.name : "Loading..."}
         </p>

        </div>
      </div>
      <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-white mb-4">Songs</h3>
        {album.songs && album.songs.length > 0 ? (
       <SongList songs={songs} />

        ) : (
          <p className="text-gray-400">No songs available for this album.</p>
        )}
      </div>
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
  );
}


