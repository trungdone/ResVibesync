"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchArtists } from "@/lib/api";
<<<<<<< HEAD
import { ArtistList } from "./ArtistList"; // ✅ import đúng thư mục hiện tại
import { ArtistForm } from "./ArtistForm";
=======
import { ArtistList } from "./ArtistList";
import { ArtistForm } from "./ArtistForm";
import { ArtistView } from "./ArtistView";
import { motion, AnimatePresence } from "framer-motion";

const Alert = ({ type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000); // Auto-dismiss after 5 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  const variants = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-[1000] flex items-center justify-between p-4 rounded-lg shadow-lg ${variants[type]} max-w-md w-full`}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-4 text-white hover:text-gray-200 focus:outline-none"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </motion.div>
  );
};
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6

export default function AdminArtistsPage() {
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [showForm, setShowForm] = useState(false);
<<<<<<< HEAD
=======
  const [showView, setShowView] = useState(false);
  const [alert, setAlert] = useState(null);
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
  const router = useRouter();

  useEffect(() => {
    loadArtists();
  }, []);

  const loadArtists = async () => {
<<<<<<< HEAD
    const data = await fetchArtists();
    setArtists(data?.artists || []);
=======
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_API_URL}/admin/artists`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setArtists(data?.artists || []);
    } catch (err) {
      console.error("Failed to load artists", err);
      setAlert({ type: "error", message: "Failed to load artists" });
    }
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
  };

  const handleAdd = () => {
    setSelectedArtist(null);
    setShowForm(true);
  };

  const handleEdit = (artist) => {
    setSelectedArtist(artist);
    setShowForm(true);
  };

  const handleView = (artist) => {
<<<<<<< HEAD
    alert(`Viewing artist: ${artist.name}`);
    // Hoặc điều hướng đến trang chi tiết: router.push(`/admin/artists/${artist.id}`);
=======
    setSelectedArtist(artist);
    setShowView(true);
    setShowForm(false);
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
  };

  const handleDelete = async (id) => {
    const confirmed = confirm("Are you sure you want to delete this artist?");
    if (!confirmed) return;

<<<<<<< HEAD
    const res = await fetch(`/api/artists/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer admin-token", // thay bằng token thật
      },
    });
    if (res.ok) {
      loadArtists();
    } else {
      console.error("Failed to delete artist:", await res.text());
=======
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_API_URL}/admin/artists/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        loadArtists();
        setAlert({
          type: "success",
          message: data.message || "Artist deleted successfully!",
        });
      } else {
        console.error("Failed to delete artist:", data.detail || res.statusText);
        setAlert({
          type: "error",
          message: data.detail || "Failed to delete artist",
        });
      }
    } catch (err) {
      console.error("Delete error", err);
      setAlert({
        type: "error",
        message: "An error occurred while deleting",
      });
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
    }
  };

  const handleFormSubmit = async (artistData) => {
<<<<<<< HEAD
    const method = selectedArtist ? "PUT" : "POST";
    const url = selectedArtist ? `/api/artists/${selectedArtist.id}` : `/api/artists`;

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer admin-token",
      },
      body: JSON.stringify(artistData),
    });

    if (res.ok) {
      setShowForm(false);
      setSelectedArtist(null);
      await loadArtists();
    } else {
      console.error("Failed to save artist:", await res.text());
    }
  };

  return (
    <div className="space-y-6">
=======
    const token = localStorage.getItem("token");
    const method = selectedArtist ? "PUT" : "POST";
    const url = selectedArtist
      ? `${BASE_API_URL}/admin/artists/${selectedArtist.id}`
      : `${BASE_API_URL}/admin/artists`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(artistData),
      });
      const data = await res.json();
      console.log("Response data:", data);
      if (res.status === 200 || res.status === 201 || res.status === 204) {
        setShowForm(false);
        setSelectedArtist(null);
        await loadArtists();
        const successMessage = data.message || (selectedArtist ? "Artist updated successfully!" : "Artist created successfully!");
        setAlert({
          type: "success",
          message: successMessage,
        });
      } else {
        console.error("Failed to save artist:", data.detail || res.statusText);
        setAlert({
          type: "error",
          message: data.detail || "Failed to save artist",
        });
      }
    } catch (err) {
      console.error("Save error", err);
      setAlert({
        type: "error",
        message: "An error occurred while saving",
      });
    }
  };

  const BASE_API_URL = "http://localhost:8000/api";

  return (
    <div className="space-y-6 relative">
      <AnimatePresence>
        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}
      </AnimatePresence>
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
      {showForm ? (
        <ArtistForm
          artist={selectedArtist}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setSelectedArtist(null);
          }}
        />
<<<<<<< HEAD
=======
      ) : showView ? (
        <ArtistView
          artist={selectedArtist}
          onClose={() => {
            setShowView(false);
            setSelectedArtist(null);
          }}
        />
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
      ) : (
        <ArtistList
          artists={artists}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      )}
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
