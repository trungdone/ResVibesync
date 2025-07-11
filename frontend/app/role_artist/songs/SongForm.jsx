"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { createSong, updateSong, fetchAlbums, fetchArtistById } from "./ArtistsongApi";

export default function SongForm({ song, onSubmit, onCancel }) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    artistId: "",
    contributingArtistIds: [],
    albumId: "",
    releaseYear: "",
    duration: "",
    genre: [],
    coverArt: "",
  });
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]); // Mảng rỗng ban đầu
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (song) {
      setFormData({
        title: song.title || "",
        artistId: song.artistId || "",
        contributingArtistIds: song.contributingArtistIds || [],
        albumId: song.albumId || "",
        releaseYear: song.releaseYear || "",
        duration: song.duration || "",
        genre: song.genre || [],
        coverArt: song.coverArt || "",
      });
    }
  }, [song]);

  useEffect(() => {
    async function loadArtistsAndAlbums() {
      try {
        const albumData = await fetchAlbums();
        // Đảm bảo albumData là mảng
        setAlbums(Array.isArray(albumData) ? albumData : []);
        const artistData = await fetchArtistById(formData.artistId || "self");
        setArtists([artistData, ...(await Promise.all(
          formData.contributingArtistIds.map(id => fetchArtistById(id).catch(() => ({ name: "Unknown Artist" })))
        ))]);
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load artists or albums",
        });
        setAlbums([]); // Đặt albums về mảng rỗng nếu lỗi
      }
    }
    loadArtistsAndAlbums();
  }, [toast, formData.artistId, formData.contributingArtistIds]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "genre" ? value.split(",").map(g => g.trim()) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let result;
      if (song) {
        result = await updateSong(song.id, formData);
      } else {
        result = await createSong(formData);
      }
      onSubmit(formData, { type: "success", message: result.message });
    } catch (err) {
      onSubmit(formData, { type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-2 border-green-500/20 max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{song ? "Edit Song" : "Add New Song"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="bg-gray-800 border-gray-700 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          <div>
            <Label htmlFor="albumId">Album</Label>
            <select
              id="albumId"
              name="albumId"
              value={formData.albumId}
              onChange={handleChange}
              className="w-full bg-gray-800 border-gray-700 text-white rounded-md p-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select Album</option>
              {Array.isArray(albums) && albums.length > 0 ? (
                albums.map((album) => (
                  <option key={album.id} value={album.id}>
                    {album.title}
                  </option>
                ))
              ) : (
                <option value="" disabled>No albums available</option>
              )}
            </select>
          </div>
          <div>
            <Label htmlFor="releaseYear">Release Year</Label>
            <Input
              id="releaseYear"
              name="releaseYear"
              type="number"
              value={formData.releaseYear}
              onChange={handleChange}
              className="bg-gray-800 border-gray-700 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <Label htmlFor="duration">Duration (seconds)</Label>
            <Input
              id="duration"
              name="duration"
              type="number"
              value={formData.duration}
              onChange={handleChange}
              className="bg-gray-800 border-gray-700 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <Label htmlFor="genre">Genres (comma-separated)</Label>
            <Input
              id="genre"
              name="genre"
              value={formData.genre.join(", ")}
              onChange={handleChange}
              className="bg-gray-800 border-gray-700 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <Label htmlFor="coverArt">Cover Art URL</Label>
            <Input
              id="coverArt"
              name="coverArt"
              value={formData.coverArt}
              onChange={handleChange}
              className="bg-gray-800 border-gray-700 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-gray-700 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              {loading ? "Saving..." : song ? "Update Song" : "Create Song"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}