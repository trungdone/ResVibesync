import Image from "next/image";
import { notFound } from "next/navigation";

import { fetchArtistById, fetchSuggestedArtists } from "@/lib/api/artists";
import { fetchSongsByArtist, fetchTopSongs } from "@/lib/api/songs";
import { fetchAlbumsByArtist } from "@/lib/api/albums";

import ArtistSongs from "@/components/artist/ArtistSongs";
import ArtistAlbums from "@/components/artist/ArtistAlbums";
import TopSongs from "@/components/artist/TopSongs";
import RelatedArtists from "@/components/artist/RelatedArtists";
import ClientPlayerActions from "@/components/artist/ClientPlayerActions";
import ArtistBio from "@/components/artist/ArtistBio";

export default async function ArtistDetailPage({ params, searchParams }) {
  const artistId = params.id;
  const from = searchParams?.from;

  const [artist, songsRes, albumsRes, topSongsRes, suggestedRes] = await Promise.all([
    fetchArtistById(artistId),
    fetchSongsByArtist(artistId),
    fetchAlbumsByArtist(artistId),
    fetchTopSongs(),
    from !== "youmaylike" ? fetchSuggestedArtists(artistId) : Promise.resolve([]),
  ]);

  if (!artist || !artist.id) return notFound();

  const songs = songsRes?.songs || [];
  const albums = albumsRes?.albums || [];
  const topSongs = topSongsRes || [];
  const suggestedArtists = suggestedRes?.filter(a => a.id !== artistId) || [];

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* HEADER */}
      <div className="relative h-[420px] w-full bg-gradient-to-br from-indigo-900 via-purple-800 to-black">
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end h-full px-8 pb-8 gap-8">
          <div className="relative w-44 h-44 md:w-64 md:h-64 rounded-lg overflow-hidden shadow-2xl border-4 border-white/20">
            <Image
              src={artist.image || "/placeholder.svg"}
              alt={artist.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="text-center md:text-left max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold drop-shadow-md">
              {artist.name}
            </h1>

            {/* Bio popup trigger */}
            <ArtistBio bio={artist.bio} name={artist.name} image={artist.image} />

            {/* Follow / Actions */}
            <div className="mt-4">
              <ClientPlayerActions artist={artist} songs={songs} from={from} />
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        <ArtistSongs songs={songs} />
        <ArtistAlbums albums={albums} />
        {topSongs.length > 0 && <TopSongs topSongs={topSongs} />}
        {suggestedArtists.length > 0 && from !== "youmaylike" && (
          <RelatedArtists suggestedArtists={suggestedArtists} />
        )}
      </div>
    </div>
  );
}
