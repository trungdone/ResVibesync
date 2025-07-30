import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchAlbumsIncludingSong } from "@/lib/api/albums";
import { fetchArtistById } from "@/lib/api/artists";
import { fetchSongsByArtist } from "@/lib/api/songs";

export default function SongView({ song, onClose }) {
  const { toast } = useToast();
  const [albums, setAlbums] = useState([]);
  const [artist, setArtist] = useState(null);
  const [allSongs, setAllSongs] = useState([]); 

  useEffect(() => {
    async function loadData() {
      try {
        if (song?.artistId) {
          const artistData = await fetchArtistById(song.artistId);
          setArtist(artistData);
        }

        if (song?.id) {
          const albumsData = await fetchAlbumsIncludingSong(song.id);

          // fetch thêm nghệ sĩ của từng album
          const artistIds = [...new Set(albumsData.map((a) => a.artist_id).filter(Boolean))];
          const artistMap = {};
          await Promise.all(
            artistIds.map(async (aid) => {
              const a = await fetchArtistById(aid);
              artistMap[aid] = a?.name || "Unknown Artist";
            })
          );

          // FIX: lọc album có cùng artist_id với bài hát
          const filteredAlbums = albumsData.filter(
            (album) => album.artist_id === song.artistId
          );

          const albumsWithArtist = filteredAlbums.map((album) => ({
            ...album,
            artistName: artistMap[album.artist_id] || "Unknown Artist",
          }));

          setAlbums(albumsWithArtist);
        }

        // Fetch all songs by artist
        if (song?.artistId) {
          const { songs: songsData } = await fetchSongsByArtist(song.artistId);
          console.log("All songs by artist response:", songsData);
          setAllSongs(songsData);
        }
      } catch (err) {
        console.error("Error loading data:", err);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load song details",
        });
      }
    }
    loadData();
  }, [song, toast]);

  if (!song) {
    return <div className="text-center text-muted-foreground">No song selected</div>;
  }

  return (
    <Card className="max-w-4xl mx-auto bg-card/50 backdrop-blur-sm border-2 border-green-500/20 shadow">
      <CardHeader className="border-b border-border">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
            Song Details: {song.title || "N/A"}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          {song.coverArt && (
            <img
              src={song.coverArt}
              alt={song.title}
              className="w-48 h-48 object-cover rounded-md border border-border"
              onError={(e) => (e.currentTarget.src = "/placeholder.png")}
            />
          )}
          <div className="space-y-2">
            <p className="text-lg font-medium text-foreground">Title: {song.title || "N/A"}</p>
            <p className="text-foreground">Artist: {artist?.name || "N/A"}</p>
            <p className="text-foreground">Release Year: {song.releaseYear || "N/A"}</p>
            <div className="text-foreground">
              Genre:{" "}
              {song.genre?.length ? (
                <Badge
                  variant="secondary"
                  className="bg-green-500/20 text-green-400 border-green-500/30"
                >
                  {song.genre.join(", ")}
                </Badge>
              ) : (
                "N/A"
              )}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-foreground mb-4">Albums containing this song</h3>
          {albums.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Artist</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Genre</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {albums.map((album) => (
                  <TableRow key={album.id}>
                    <TableCell className="flex items-center gap-2">
                      {album.cover_art ? (
                        <img
                          src={album.cover_art}
                          alt={album.title}
                          className="w-12 h-12 object-cover rounded border border-border shadow"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-muted rounded flex items-center justify-center text-xs text-foreground/50">
                          No Image
                        </div>
                      )}
                      <span>{album.title || "N/A"}</span>
                    </TableCell>
                    <TableCell>{album.artistName}</TableCell>
                    <TableCell>{album.release_year || "N/A"}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-green-500/20 text-green-400 border-green-500/30"
                      >
                        {album.genres?.join(", ") || "N/A"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">No albums found for this song</p>
          )}
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-foreground mb-4">All Songs by this Artist</h3>
          {allSongs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead>Title</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Genre</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allSongs.map((songItem) => (
                  <TableRow key={songItem.id} className="hover:bg-muted/50 border-border transition-colors">
                    <TableCell className="flex items-center gap-2">
                      {songItem.coverArt ? (
                        <img
                          src={songItem.coverArt}
                          alt={songItem.title}
                          className="w-12 h-12 object-cover rounded border border-border shadow"
                          onError={(e) => (e.currentTarget.src = '/placeholder.png')}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-muted rounded flex items-center justify-center text-xs text-foreground/50">
                          No Image
                        </div>
                      )}
                      <span>{songItem.title || "N/A"}</span>
                    </TableCell>
                    <TableCell>
                      {songItem.duration
                        ? `${Math.floor(songItem.duration / 60)}:${(songItem.duration % 60).toString().padStart(2, '0')}`
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-green-500/20 text-green-400 border-green-500/30"
                      >
                        {songItem.genre || "N/A"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">No songs available by this artist</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}