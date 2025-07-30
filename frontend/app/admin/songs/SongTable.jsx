"use client";

<<<<<<< HEAD
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSongs, deleteSong } from "./songApi";
import { useToast } from "@/hooks/use-toast";
import SongForm from "./SongForm";

export default function SongTable() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("title");
  const [page, setPage] = useState(1);
  const limit = 10;
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["songs", search, sort, page],
    queryFn: () => fetchSongs({ search, sort, skip: (page - 1) * limit, limit }),
    keepPreviousData: true,
=======
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  fetchSongs,
  fetchArtistById,
  fetchAlbumById,
  deleteSong,
} from "./songApi";
import SongForm from "./SongForm";

export default function SongTable() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [artists, setArtists] = useState({});
  const [albums, setAlbums] = useState({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const itemsPerPage = 10;

  const { data, isLoading, error } = useQuery({
    queryKey: ["songs", search, currentPage],
    queryFn: () =>
      fetchSongs({
        search,
        skip: (currentPage - 1) * itemsPerPage,
        limit: itemsPerPage,
      }),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
  });

  const songs = data?.songs || [];
  const total = data?.total || 0;
<<<<<<< HEAD
  const totalPages = Math.ceil(total / limit);
=======
  const totalPages = Math.ceil(total / itemsPerPage);

  useEffect(() => {
    async function loadArtistsAndAlbums() {
      try {
        const artistIds = [
          ...new Set(
            songs
              .flatMap((song) => [
                song.artistId,
                ...(song.contributingArtistIds || []),
              ])
              .filter((id) => id && typeof id === "string")
          ),
        ];
        const albumIds = [
          ...new Set(
            songs
              .flatMap((song) => song.albumIds || [])
              .filter((id) => id && typeof id === "string")
          ),
        ];
        const artistPromises = artistIds.map((id) =>
          fetchArtistById(id)
            .then((artist) => ({ [id]: artist?.name || "Unknown Artist" }))
            .catch(() => ({ [id]: "Unknown Artist" }))
        );
        const albumPromises = albumIds.map((id) =>
          fetchAlbumById(id)
            .then((album) => ({ [id]: album?.title || "Unknown Album" }))
            .catch(() => ({ [id]: "Unknown Album" }))
        );
        const [artistData, albumData] = await Promise.all([
          Promise.all(artistPromises),
          Promise.all(albumPromises),
        ]);
        setArtists(Object.assign({}, ...artistData));
        setAlbums(Object.assign({}, ...albumData));
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load artists or albums",
        });
      }
    }
    if (songs.length > 0) {
      loadArtistsAndAlbums();
    }
  }, [songs, toast]);

  const filteredSongs = songs.filter((song) =>
    [
      song.title,
      artists[song.artistId] || "N/A",
      song.genre?.join(", ") || "",
      (song.albumIds || []).map((id) => albums[id] || "").join(", "),
    ].some(
      (field) =>
        typeof field === "string" &&
        field.toLowerCase().includes(search.toLowerCase())
    )
  );

  const paginatedSongs = filteredSongs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6

  const handleEdit = (song) => {
    setSelectedSong(song);
    setIsFormOpen(true);
  };

<<<<<<< HEAD
  const handleDeleteSong = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete ${title}?`)) return;
    try {
      await deleteSong(id);
      toast({ title: "Success", description: `${title} has been deleted.` });
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    }
  };

  if (isLoading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen">Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search by title, artist, or genre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        <button
=======
  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete ${title}?`)) return;
    try {
      await deleteSong(id);
      toast({
        title: "Success",
        description: `${title} has been deleted.`,
      });
      queryClient.invalidateQueries(["songs"]);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      });
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Error: {error.message}
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
            Songs
          </h1>
          <p className="text-muted-foreground text-lg">Manage your music songs</p>
        </div>
        <Button
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
          onClick={() => {
            setSelectedSong(null);
            setIsFormOpen(true);
          }}
<<<<<<< HEAD
          className="px-4 py-2 bg-green-600 rounded text-white"
        >
          Add New Song
        </button>
      </div>
      <div className="bg-white/10 rounded-lg overflow-hidden">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-gray-800">
              <th className="px-4 py-2 text-left cursor-pointer min-w-[150px]" onClick={() => setSort("title")}>
                Title {sort === "title" && "↓"}
              </th>
              <th className="px-4 py-2 text-left cursor-pointer min-w-[150px]" onClick={() => setSort("artist")}>
                Artist {sort === "artist" && "↓"}
              </th>
              <th className="px-4 py-2 text-left min-w-[150px]">Album</th>
              <th className="px-4 py-2 text-left cursor-pointer min-w-[100px]" onClick={() => setSort("releaseYear")}>
                Year {sort === "releaseYear" && "↓"}
              </th>
              <th className="px-4 py-2 text-left min-w-[100px]">Duration</th>
              <th className="px-4 py-2 text-left min-w-[100px]">Genre</th>
              <th className="px-4 py-2 text-left min-w-[150px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {songs.map((song) => (
              <tr key={song.id} className="border-t border-gray-700">
                <td className="px-4 py-2">{song.title}</td>
                <td className="px-4 py-2">{song.artist}</td>
                <td className="px-4 py-2">{song.album}</td>
                <td className="px-4 py-2">{song.releaseYear}</td>
                <td className="px-4 py-2">
                  {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, "0")}
                </td>
                <td className="px-4 py-2">{song.genre}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleEdit(song)}
                    className="px-3 py-1 bg-yellow-500 text-black rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSong(song.id, song.title)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
      {isFormOpen && <SongForm song={selectedSong} isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />}
    </div>
  );
}
=======
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg shadow-green-500/25"
        >
          <Plus className="h-4 w-4" />
          Add Song
        </Button>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-2 border-green-500/20">
        <CardHeader className="border-b border-border">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">
              All Songs ({filteredSongs.length})
            </CardTitle>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search songs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 text-foreground bg-gray-800 border-gray-700 focus:ring-green-500 focus:border-green-500 rounded-md"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Artists</TableHead>
                <TableHead>Albums</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Genres</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedSongs.length > 0 ? (
                paginatedSongs.map((song) => {
                  const mainArtist = artists[song.artistId] || "N/A";
                  const contributing = (song.contributingArtistIds || []).map(
                    (id) => artists[id] || "N/A"
                  );
                  const allArtists = [mainArtist, ...contributing];
                  const displayArtists = allArtists.slice(0, 2);
                  const remainArtist = allArtists.length - displayArtists.length;

                  const albumTitles = (song.albumIds || []).map(
                    (id) => albums[id] || "N/A"
                  );
                  const displayAlbums = albumTitles.slice(0, 2);
                  const remainAlbums = albumTitles.length - displayAlbums.length;

                  const genres = song.genre || [];
                  const displayGenres = genres.slice(0, 2);
                  const remainGenres = genres.length - displayGenres.length;

                  return (
                    <TableRow key={song.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {song.coverArt && (
                            <img
                              src={song.coverArt}
                              alt={song.title}
                              className="w-12 h-12 object-cover rounded border border-gray-700"
                            />
                          )}
                          {song.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="relative group cursor-pointer">
                          {displayArtists.join(", ")}
                          {remainArtist > 0 && ` +${remainArtist}`}
                          <div className="hidden group-hover:block absolute z-10 top-full left-0 bg-gray-800 text-white text-xs p-2 rounded shadow border mt-1 whitespace-nowrap">
                            {allArtists.join(", ")}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="relative group cursor-pointer">
                          {displayAlbums.join(", ")}
                          {remainAlbums > 0 && ` +${remainAlbums}`}
                          <div className="hidden group-hover:block absolute z-10 top-full left-0 bg-gray-800 text-white text-xs p-2 rounded shadow border mt-1 whitespace-nowrap">
                            {albumTitles.join(", ")}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{song.releaseYear}</TableCell>
                      <TableCell>
                        {song.duration
                          ? `${Math.floor(song.duration / 60)}:${String(
                              song.duration % 60
                            ).padStart(2, "0")}`
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="relative group cursor-pointer">
                          {displayGenres.join(", ")}
                          {remainGenres > 0 && ` +${remainGenres}`}
                          <div className="hidden group-hover:block absolute z-10 top-full left-0 bg-gray-800 text-white text-xs p-2 rounded shadow border mt-1 whitespace-nowrap">
                            {genres.join(", ")}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              (window.location.href = `/admin/songs/${song.id}`)
                            }
                            className="hover:bg-blue-500/20 hover:text-blue-400"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(song)}
                            className="hover:bg-green-500/20 hover:text-green-400"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDelete(song.id, song.title || "Song")
                            }
                            className="hover:bg-red-500/20 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No songs found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 p-4 border-t border-green-500/20">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="px-4 text-sm text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {isFormOpen && (
        <SongForm
          song={selectedSong}
          onSubmit={async (_, result) => {
            setIsFormOpen(false);
            setSelectedSong(null);
            await queryClient.invalidateQueries(["songs"]);
            if (result) toast(result);
          }}
          onCancel={() => {
            setIsFormOpen(false);
            setSelectedSong(null);
          }}
        />
      )}
    </div>
  );
}
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
