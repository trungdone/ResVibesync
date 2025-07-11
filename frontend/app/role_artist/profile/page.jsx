"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";

export default function ArtistProfile() {
  const { user } = useAuth();
  const [artist, setArtist] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    image: "",
    genres: [],
    phone: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "artist") {
      router.push("/signin");
      return;
    }

    async function loadProfile() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8000/api/artist/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch profile");
        const data = await response.json();
        setArtist(data);
        setFormData({
          name: data.name,
          bio: data.bio || "",
          image: data.image || "",
          genres: data.genres || [],
          phone: data.phone || "",
        });
      } catch (err) {
        setError(err.message);
      }
    }

    loadProfile();
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/api/artist/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to update profile");
      setSuccess("Profile updated successfully");
      window.alert("Profile updated successfully");
    } catch (err) {
      setError(err.message);
    }
  };

  if (!artist) {
    return <div className="flex justify-center items-center h-[60vh]">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Music size={32} className="text-purple-600" />
        <h1 className="text-3xl font-bold">Edit Artist Profile</h1>
      </div>
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
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
            Name
          </label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">
            Bio
          </label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          />
        </div>
        <div>
           <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
             Phone
          </label>
          <Input
           id="phone"
          value={formData.phone}
           onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
         </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-1">
            Image URL
          </label>
          <Input
            id="image"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="genres" className="block text-sm font-medium text-gray-300 mb-1">
            Genres (comma-separated)
          </label>
          <Input
            id="genres"
            value={formData.genres.join(", ")}
            onChange={(e) =>
              setFormData({ ...formData, genres: e.target.value.split(",").map((g) => g.trim()) })
            }
          />
        </div>
        <Button type="submit" className="btn-primary w-full">
          Save Changes
        </Button>
      </form>
    </div>
  );
}