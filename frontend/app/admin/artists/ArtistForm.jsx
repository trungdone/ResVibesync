<<<<<<< HEAD
=======
<<<<<<< HEAD
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { useAuth } from '@/context/auth-context';



export function ArtistForm({ artist, onSubmit, onCancel }) {
  const { user } = useAuth();
  const [genres, setGenres] = useState(artist?.genres || []);
  const [newGenre, setNewGenre] = useState('');
=======
>>>>>>> main
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { X, Plus, RefreshCw } from "lucide-react";
import { FaImage } from "react-icons/fa";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { uploadMedia } from "../songs/songApi";

export function ArtistForm({ artist, onSubmit, onCancel }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [genres, setGenres] = useState(artist?.genres || []);
  const [newGenre, setNewGenre] = useState("");
  const [preview, setPreview] = useState(artist?.image || null);
<<<<<<< HEAD
=======
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
>>>>>>> main

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
<<<<<<< HEAD
=======
<<<<<<< HEAD
  } = useForm({
    defaultValues: {
      name: artist?.name || '',
      bio: artist?.bio || '',
      image: artist?.image || '',
=======
>>>>>>> main
    reset,
    watch,
  } = useForm({
    defaultValues: {
      name: artist?.name || "",
      bio: artist?.bio || "",
      image: artist?.image || "",
<<<<<<< HEAD
=======
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
>>>>>>> main
      genres: artist?.genres || [],
      followers: artist?.followers || 0,
    },
  });

<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
>>>>>>> main
  const imageValue = watch("image");
  useEffect(() => {
    if (artist) {
      reset({
        name: artist.name || "",
        bio: artist.bio || "",
        image: artist.image || "",
        genres: artist.genres || [],
        followers: artist.followers || 0,
      });
      setGenres(artist.genres || []);
      setPreview(artist.image || null);
    }
  }, [artist, reset]);

    // restore draft if exists
  useEffect(() => {
    const draft = localStorage.getItem("artistFormDraft");
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft);
        reset(parsedDraft);
        setGenres(parsedDraft.genres || []);
        setPreview(parsedDraft.image || null);
      } catch (err) {
        console.error("Failed to parse artist draft", err);
      }
    }
  }, [reset]);

  // auto-save draft on form changes
  useEffect(() => {
    const subscription = watch((value) => {
      localStorage.setItem(
        "artistFormDraft",
        JSON.stringify({
          ...value,
          genres,
        })
      );
    });
    return () => subscription.unsubscribe();
  }, [watch, genres]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;
      try {
        const formData = new FormData();
        formData.append("image", file);
        const result = await uploadMedia(formData);
        setValue("image", result.image || result.coverArt);
        setPreview(URL.createObjectURL(file));
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to upload image",
        });
      }
    },
  });

<<<<<<< HEAD
=======
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
>>>>>>> main
  const addGenre = () => {
    if (newGenre.trim() && !genres.includes(newGenre.trim())) {
      const updatedGenres = [...genres, newGenre.trim()];
      setGenres(updatedGenres);
<<<<<<< HEAD
      setValue("genres", updatedGenres);
      setNewGenre("");
=======
<<<<<<< HEAD
      setValue('genres', updatedGenres);
      setNewGenre('');
=======
      setValue("genres", updatedGenres);
      setNewGenre("");
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
>>>>>>> main
    }
  };

  const removeGenre = (genreToRemove) => {
<<<<<<< HEAD
=======
<<<<<<< HEAD
    const updatedGenres = genres.filter(g => g !== genreToRemove);
    setGenres(updatedGenres);
    setValue('genres', updatedGenres);
  };

  const onFormSubmit = (data) => {
    if (user?.role !== 'admin') {
      alert('Only admins can submit artist data');
      return;
    }
    onSubmit({ ...data, genres });
=======
>>>>>>> main
    const updatedGenres = genres.filter((g) => g !== genreToRemove);
    setGenres(updatedGenres);
    setValue("genres", updatedGenres);
    toast({
      title: "Genre Removed",
      description: "Click to refresh.",
      action: <RefreshCw className="h-4 w-4 cursor-pointer" onClick={() => window.location.reload()} />,
    });
  };

  const onFormSubmit = (data) => {
    if (user?.role !== "admin") {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Only admins can submit artist data",
      });
      return;
    }
    onSubmit({ ...data, genres }).then(() => {
      localStorage.removeItem("artistFormDraft");
    reset({name: "", bio: "", image: "",genres: [], followers: 0,
    }); setGenres([]); setPreview(null);
      toast({
        title: "Success",
        description: "Artist created successfully!",
      });
    });
<<<<<<< HEAD
=======
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
>>>>>>> main
  };

  return (
    <Card className="max-w-4xl mx-auto bg-card/50 backdrop-blur-sm border-2">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-2xl bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
<<<<<<< HEAD
          {artist ? "Edit Artist" : "Add New Artist"}
=======
<<<<<<< HEAD
          {artist ? 'Edit Artist' : 'Add New Artist'}
=======
          {artist ? "Edit Artist" : "Add New Artist"}
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
>>>>>>> main
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-muted/50">
              <TabsTrigger value="basic" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="details" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
                Details
              </TabsTrigger>
              <TabsTrigger value="media" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
                Media
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-6">
              <div>
<<<<<<< HEAD
=======
<<<<<<< HEAD
                <Label htmlFor="name" className="text-sm font-medium">Artist Name</Label>
                <Input
                  id="name"
                  {...register('name', { required: 'Name is required' })}
                  placeholder="Enter artist name"
                  className="mt-1"
=======
>>>>>>> main
                <Label htmlFor="name" className="text-sm font-medium text-foreground">Artist Name</Label>
                <Input
                  id="name"
                  {...register("name", { required: "Name is required" })}
                  placeholder="Enter artist name"
                  className="mt-1 text-foreground bg-background border-border focus:ring-green-500 focus:border-green-500"
<<<<<<< HEAD
=======
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
>>>>>>> main
                />
                {errors.name && (
                  <p className="text-sm text-red-400 mt-1">{errors.name.message}</p>
                )}
              </div>
<<<<<<< HEAD
=======
<<<<<<< HEAD

              <div>
                <Label htmlFor="bio" className="text-sm font-medium">Biography</Label>
                <Textarea
                  id="bio"
                  {...register('bio', { required: 'Bio is required' })}
                  placeholder="Enter artist biography"
                  rows={4}
                  className="mt-1"
=======
>>>>>>> main
              <div>
                <Label htmlFor="bio" className="text-sm font-medium text-foreground">Biography</Label>
                <Textarea
                  id="bio"
                  {...register("bio", { required: "Bio is required" })}
                  placeholder="Enter artist biography"
                  rows={4}
                  className="mt-1 text-foreground bg-background border-border focus:ring-green-500 focus:border-green-500"
<<<<<<< HEAD
=======
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
>>>>>>> main
                />
                {errors.bio && (
                  <p className="text-sm text-red-400 mt-1">{errors.bio.message}</p>
                )}
              </div>
<<<<<<< HEAD
=======
<<<<<<< HEAD

              <div>
                <Label htmlFor="followers" className="text-sm font-medium">Followers</Label>
                <Input
                  id="followers"
                  type="number"
                  {...register('followers', { 
                    required: 'Followers is required',
                    min: { value: 0, message: 'Followers must be non-negative' }
                  })}
                  placeholder="Enter number of followers"
                  className="mt-1"
=======
>>>>>>> main
              <div>
                <Label htmlFor="followers" className="text-sm font-medium text-foreground">Followers</Label>
                <Input
                  id="followers"
                  type="number"
                  {...register("followers", {
                    required: "Followers is required",
                    min: { value: 0, message: "Followers must be non-negative" },
                  })}
                  placeholder="Enter number of followers"
                  className="mt-1 text-foreground bg-background border-border focus:ring-green-500 focus:border-green-500"
<<<<<<< HEAD
=======
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
>>>>>>> main
                />
                {errors.followers && (
                  <p className="text-sm text-red-400 mt-1">{errors.followers.message}</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4 mt-6">
              <div>
<<<<<<< HEAD
                <Label className="text-sm font-medium text-foreground">Genres</Label>
=======
<<<<<<< HEAD
                <Label className="text-sm font-medium">Genres</Label>
=======
                <Label className="text-sm font-medium text-foreground">Genres</Label>
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
>>>>>>> main
                <div className="flex gap-2 mb-2 mt-1">
                  <Input
                    value={newGenre}
                    onChange={(e) => setNewGenre(e.target.value)}
<<<<<<< HEAD
                    placeholder="Add a genre (e.g., Pop, R&B, Dance-Pop)"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addGenre())}
                    className="text-foreground bg-background border-border focus:ring-green-500 focus:border-green-500"
=======
<<<<<<< HEAD
                    placeholder="Add a genre"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGenre())}
=======
                    placeholder="Add a genre (e.g., Pop, R&B, Dance-Pop)"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addGenre())}
                    className="text-foreground bg-background border-border focus:ring-green-500 focus:border-green-500"
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
>>>>>>> main
                  />
                  <Button type="button" onClick={addGenre} size="sm" variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre, index) => (
<<<<<<< HEAD
=======
<<<<<<< HEAD
                    <Badge key={index} variant="secondary" className="flex items-center gap-1 bg-green-500/20 text-green-400 border-green-500/30">
                      {genre}
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-red-400" 
=======
>>>>>>> main
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1 bg-green-500/20 text-green-400 border-green-500/30"
                    >
                      {genre}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-red-400"
<<<<<<< HEAD
=======
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
>>>>>>> main
                        onClick={() => removeGenre(genre)}
                      />
                    </Badge>
                  ))}
                </div>
                {genres.length === 0 && (
                  <p className="text-sm text-red-400 mt-1">At least one genre is required</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="media" className="space-y-4 mt-6">
<<<<<<< HEAD
=======
<<<<<<< HEAD
              <div>
                <Label htmlFor="image" className="text-sm font-medium">Profile Image URL</Label>
                <Input
                  id="image"
                  {...register('image', { 
                    required: 'Image URL is required',
                    pattern: {
                      value: /^https?:\/\/.+/,
                      message: 'Must be a valid URL'
                    }
                  })}
                  placeholder="Enter image URL"
                  className="mt-1"
                />
                {errors.image && (
                  <p className="text-sm text-red-400 mt-1">{errors.image.message}</p>
                )}
              </div>
=======
>>>>>>> main
              <Label className="flex items-center gap-2">
                <FaImage /> Profile Image
              </Label>
              <div {...getRootProps()} className="border-2 border-dashed p-3 rounded bg-muted/20 cursor-pointer">
                <input {...getInputProps()} />
                <p className="text-center text-xs text-gray-500">Drag & drop or click to upload</p>
              </div>
              <div>
                <Label htmlFor="image">Or paste image URL</Label>
                <Input
                  id="image"
                  placeholder="https://..."
                  {...register("image")}
                  onChange={(e) => {
                    const url = e.target.value;
                    setValue("image", url);
                    setPreview(url);
                  }}
                />
                {/* Nút mở folder coverArt artist */}
                  <button
                  type="button"
                  onClick={() =>
                  window.open(
                  "https://console.cloudinary.com/app/c-3094a5af80706cd2033ae8d905de57/assets/media_library/folders/cbce1759a78951d1adefa4890bbb72c791?view_mode=list",
                  "_blank"
                   )
                  }
                  className="mt-2 inline-flex items-center text-sm text-blue-400 hover:text-blue-300"
                  >
                 🖼️ Browse Cloudinary CoverArt Artist Folder
                </button>
              </div>
              {(preview || imageValue) && (
                <div className="relative mt-2 w-fit">
                  <img
                    src={preview || imageValue}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-lg border"
                    onError={(e) => (e.target.src = "/placeholder.png")}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setValue("image", "");
                      setPreview(null);
                    }}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
<<<<<<< HEAD
=======
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
>>>>>>> main
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 pt-6 border-t border-border">
<<<<<<< HEAD
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
<<<<<<< HEAD
=======
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              disabled={user?.role !== 'admin'}
            >
              {artist ? 'Update Artist' : 'Create Artist'}
=======
            <Button type="button" variant="outline" onClick={() => {
            
            onCancel();
           }}>
              Cancel
            </Button>
>>>>>>> main
            <Button
              type="submit"
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              disabled={user?.role !== "admin"}
            >
              {artist ? "Update Artist" : "Create Artist"}
<<<<<<< HEAD
=======
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
>>>>>>> main
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}