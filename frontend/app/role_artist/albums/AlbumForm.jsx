"use client";

import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { createAlbum, updateAlbum } from "./ArtistAlbumApi";
import { uploadMedia } from "../songs/ArtistsongApi"; // cần import uploadMedia
import { useToast } from "@/hooks/use-toast";

export default function AlbumForm({ album, onSubmit, onCancel }) {
  const { toast } = useToast();

  const [form, setForm] = useState({
    title: "",
    description: "",
    coverArt: "",
    releaseYear: "",
    genres: "",
  });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (album) {
      setForm({
        title: album.title || "",
        description: album.description || "",
        coverArt: album.cover_art || album.coverArt || "",
        releaseYear: album.release_year || "",
        genres: (album.genres || []).join(", "),
      });

      const cover = album.cover_art || album.coverArt || "";
      if (cover) {
        setPreview(cover.startsWith("http") ? cover : `http://localhost:8000/${cover}`);
      }
    }
  }, [album]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "coverArt") {
      setPreview(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      title: form.title,
      description: form.description,
      cover_art: form.coverArt,
      release_year: parseInt(form.releaseYear) || undefined,
      genres: form.genres.split(",").map((g) => g.trim()).filter(Boolean),
    };
    try {
      const result = album
        ? await updateAlbum(album.id, payload)
        : await createAlbum(payload);

      onSubmit(payload, {
        type: "success",
        message: result.message || (album ? "Album updated successfully!" : "Album created successfully!"),
      });
    } catch (err) {
      onSubmit(payload, {
        type: "error",
        message: err.message || "An error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  // 📦 Dropzone để upload ảnh
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      try {
        const formData = new FormData();
        formData.append("cover_art", file);
        const result = await uploadMedia(formData);
        const uploaded = result.coverArt || result.image;

        if (uploaded) {
          const url = uploaded.startsWith("http")
            ? uploaded
            : `http://localhost:8000/${uploaded}`;
          setForm((prev) => ({ ...prev, coverArt: uploaded }));
          setPreview(url);
        } else {
          throw new Error("No image returned");
        }
      } catch (err) {
        console.error("Upload failed:", err);
        toast({
          variant: "destructive",
          title: "Upload Failed",
          description: "Could not upload album image.",
        });
      }
    },
  });

  return (
    <Card className="max-w-2xl mx-auto border-2 border-green-500/20 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>{album ? "Edit Album" : "Add New Album"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="bg-gray-800 border-gray-700 focus:ring-green-500"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              className="bg-gray-800 border-gray-700 focus:ring-green-500"
            />
          </div>
          <div>
            <Label htmlFor="coverArt">Cover Art URL</Label>
            <Input
              id="coverArt"
              name="coverArt"
              value={form.coverArt}
              onChange={handleChange}
              className="bg-gray-800 border-gray-700 focus:ring-green-500"
            />
          </div>

          {/* ✅ Khu vực preview + upload */}
          <div className="space-y-2">
            <Label>Upload Cover Art</Label>
            <div
              {...getRootProps()}
              className="border border-dashed border-gray-500 p-4 rounded-md text-center cursor-pointer"
            >
              <input {...getInputProps()} />
              <p className="text-sm text-muted-foreground">Drag & drop or click to upload image</p>
            </div>

            {preview && (
              <img
                src={preview}
                alt="Preview"
                onError={(e) => (e.target.src = "/placeholder.png")}
                className="w-32 h-32 object-cover rounded-md border border-border mt-2"
              />
            )}
          </div>

          <div>
            <Label htmlFor="releaseYear">Release Year</Label>
            <Input
              id="releaseYear"
              name="releaseYear"
              type="number"
              value={form.releaseYear}
              onChange={handleChange}
              className="bg-gray-800 border-gray-700 focus:ring-green-500"
            />
          </div>
          <div>
            <Label htmlFor="genres">Genres (comma-separated)</Label>
            <Input
              id="genres"
              name="genres"
              value={form.genres}
              onChange={handleChange}
              placeholder="e.g. Pop, Rock, EDM"
              className="bg-gray-800 border-gray-700 focus:ring-green-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
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
              {loading ? "Saving..." : album ? "Update Album" : "Create Album"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
