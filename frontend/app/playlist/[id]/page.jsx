"use client";

import { useEffect, useState, useRef, use } from "react";
import { notFound } from "next/navigation";
import SongList from "@/components/songs/song-list";
import { getPlaylistById } from "@/lib/api/playlists";
import { getSongById } from "@/lib/api/songs";
import { Heart, MoreHorizontal, Play } from "lucide-react";
import Footer from "@/components/layout/footer"
import PlaylistModal from "@/components/playlist/PlaylistModal";
import { useRouter } from "next/navigation";
import { deletePlaylist } from "@/lib/api/playlists";
import { triggerPlaylistRefresh } from "@/lib/api/playlist-refresh";


export default function PlaylistPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const id = Array.isArray(params?.id) ? params.id[0] : params.id;

  const [playlist, setPlaylist] = useState(null);
  const [validSongs, setValidSongs] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();


  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);


  const handleEditPlaylist = (playlist) => {
  setShowMenu(false);              // Hide the dropdown
  setEditingPlaylist(playlist);   // Set the playlist to edit
  setShowEditModal(true);         // Show the modal
  };

  const handleDeletePlaylist = async () => {
    const confirmed = confirm("Are you sure you want to delete this playlist?");
    if (!confirmed) return;

    try {
      await deletePlaylist(playlist.id);
      triggerPlaylistRefresh(); // ✅ Refresh the sidebar
      router.push("/library");
    } catch (err) {
      console.error("Failed to delete playlist:", err);
      alert("Failed to delete playlist.");
    }
  };




  const fetchPlaylist = async () => {
  if (!id || typeof id !== "string") return notFound();

  const playlistData = await getPlaylistById(id);
  if (!playlistData) return notFound();

  setPlaylist(playlistData);

  if (Array.isArray(playlistData.songIds)) {
    try {
      const songs = await Promise.all(
        playlistData.songIds.map((songId) => getSongById(songId))
      );
      setValidSongs(songs.filter(Boolean));
    } catch (err) {
      console.error("Failed to fetch songs:", err);
    }
  }
};

useEffect(() => {
  fetchPlaylist();
}, [id]);


  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  if (!playlist) return null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-6">
        <img
          src={validSongs?.[0]?.coverArt || playlist.coverArt}
          alt="cover"
          className="w-40 h-40 object-cover rounded shadow"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{playlist.title}</h1>
          <p className="text-gray-400">{playlist.description}</p>
          <p className="text-sm text-muted-foreground">
            {validSongs.length} {validSongs.length === 1 ? "song" : "songs"}
          </p>

          {/* 🎛 Playlist Action Buttons */}
          <div className="flex items-center gap-4 mt-4 relative">
            {/* ▶️ Play */}
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow transition duration-200"
              aria-label="Play"
            >
              <Play className="w-5 h-5" />
            </button>

            {/* ❤️ Like */}
            <button
              className="bg-black border border-purple-600 text-purple-400 hover:text-white p-3 rounded-full transition duration-200"
              aria-label="Like"
            >
              <Heart className="w-5 h-5" />
            </button>

            {/* ... Menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu((prev) => !prev)}
                className="bg-black border border-purple-600 text-purple-400 hover:text-white p-3 rounded-full transition duration-200"
                aria-label="More"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-44 bg-black border border-purple-700 text-white rounded shadow-lg z-50">
                  <ul className="text-sm">
                    <li
                      className="px-4 py-2 hover:bg-purple-700 cursor-pointer"
                      onClick={() => handleEditPlaylist(playlist)}
                    >
                      Edit Playlist
                    </li>



                    <li className="px-4 py-2 hover:bg-purple-700 cursor-pointer">
                      Share
                    </li>
                    <li className="px-4 py-2 hover:bg-purple-700 cursor-pointer"
                      onClick={handleDeletePlaylist} >
                      Delete
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {showEditModal && (
            <PlaylistModal
              open={showEditModal}
              onClose={() => {
                setShowEditModal(false);
                setEditingPlaylist(null);
              }}
              editingPlaylist={editingPlaylist}
              onSuccess={async () => {
                await fetchPlaylist(); // ✅ refresh UI
                setShowEditModal(false);
                setEditingPlaylist(null);
              }}
            />
          )}

        </div>
      </div>

      <SongList songs={validSongs} />
      <Footer />
      
    </div>
  );
}
