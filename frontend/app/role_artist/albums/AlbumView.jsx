"use client";

import { X } from "lucide-react";
import { motion } from "framer-motion";

export default function AlbumView({ album, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-800 rounded-lg shadow border-2 border-green-500/20 p-6 max-w-lg mx-auto relative"
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
      >
        <X size={24} />
      </button>
      <h2 className="text-2xl font-bold text-white mb-4">
        {album.title || "Untitled"}
      </h2>
      <div className="space-y-2 text-gray-300">
        <p>
          <strong>Artist ID:</strong> {album.artist_id || "N/A"}
        </p>
        <p>
          <strong>Description:</strong> {album.description || "No description"}
        </p>
        <p>
          <strong>Cover Art:</strong>{" "}
          {album.coverArt ? (
            <a
              href={album.coverArt}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              View Cover
            </a>
          ) : (
            "N/A"
          )}
        </p>
        <p>
          <strong>Release Year:</strong> {album.release_year || "N/A"}
        </p>
        <p>
          <strong>Genres:</strong>{" "}
          {album.genres?.length > 0 ? album.genres.join(", ") : "None"}
        </p>
        <p>
          <strong>Songs:</strong>{" "}
          {album.songs?.length > 0 ? album.songs.join(", ") : "None"}
        </p>
        <p>
          <strong>Created At:</strong>{" "}
          {new Date(album.created_at).toLocaleDateString()}
        </p>
      </div>
    </motion.div>
  );
}
