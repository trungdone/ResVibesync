<<<<<<< HEAD
import { useState } from 'react';
=======
import { useState,useEffect } from 'react';
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
<<<<<<< HEAD

=======
<<<<<<< HEAD
import { createArtist, updateArtist, deleteArtist, fetchArtists } from "./artistsApi";
>>>>>>> main

export function ArtistList({ artists, onAdd, onEdit, onDelete, onView }) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredArtists = artists.filter(artist =>
    artist.name.toLowerCase().includes(search.toLowerCase()) ||
    artist.genres.some(genre => genre.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredArtists.length / itemsPerPage);
=======


export function ArtistList({ artists, onAdd, onEdit, onDelete, onView }) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredArtists = artists.filter((artist) =>
    [
      artist.name,
      ...(artist.genres || []),
      artist.bio || "",
    ].some((field) => typeof field === "string" && field.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages = Math.max(1, Math.ceil(filteredArtists.length / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [filteredArtists, totalPages, currentPage]);

>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedArtists = filteredArtists.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
            Artists
          </h1>
          <p className="text-muted-foreground text-lg">Manage your music artists</p>
        </div>
        <Button 
          onClick={onAdd} 
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg shadow-green-500/25"
        >
          <Plus className="h-4 w-4" />
          Add Artist
        </Button>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-2">
        <CardHeader className="border-b border-border">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">All Artists ({filteredArtists.length})</CardTitle>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search artists..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Artist</TableHead>
                <TableHead>Genres</TableHead>
                <TableHead>Followers</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedArtists.map((artist) => (
                <TableRow key={artist.id} className="hover:bg-muted/50 border-border transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12 border-2 border-green-500/30">
                        <AvatarImage src={artist.image} alt={artist.name} />
                        <AvatarFallback className="bg-green-500/20 text-green-400">
                          {artist.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{artist.name}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {artist.bio}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {artist.genres.slice(0, 2).map((genre, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                          {genre}
                        </Badge>
                      ))}
                      {artist.genres.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{artist.genres.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{artist.followers.toLocaleString()}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDistanceToNow(new Date(artist.created_at), { addSuffix: true })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(artist)}
                        className="hover:bg-blue-500/20 hover:text-blue-400"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(artist)}
                        className="hover:bg-green-500/20 hover:text-green-400"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(artist.id)}
                        className="hover:bg-red-500/20 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 p-4 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4 text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}