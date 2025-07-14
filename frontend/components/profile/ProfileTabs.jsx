"use client";

import Image from "next/image";
import PlaylistGrid from "@/components/playlist/playlist-grid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProfileTabs({ playlists, likedSongs, historySongs, followingArtists }) {
  return (
    <Tabs defaultValue="playlists">
      <TabsList className="bg-white/5">
        <TabsTrigger value="playlists" className="text-sm">🎧 Playlists</TabsTrigger>
        <TabsTrigger value="liked" className="text-sm">❤️ Liked</TabsTrigger>
        <TabsTrigger value="history" className="text-sm">🕘 History</TabsTrigger>
        <TabsTrigger value="following">Following</TabsTrigger>
      </TabsList>

      <TabsContent value="playlists" className="mt-6">
        <PlaylistGrid playlists={playlists} />
      </TabsContent>

      <TabsContent value="liked" className="mt-6">
        {likedSongs.length === 0 ? (
          <p className="text-gray-400">You have not liked any song yet.</p>
        ) : (
          <ul className="space-y-4">
            {likedSongs.map((song) => (
              <li
                key={song.id}
                className="flex items-center gap-4 p-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition"
              >
                <div className="relative w-14 h-14 flex-shrink-0">
                  <Image
                    src={song.coverArt || "/placeholder.svg"}
                    alt={song.title || "Bài hát"}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="font-semibold truncate">{song.title}</div>
                  <div className="text-sm text-gray-400 truncate">{song.artist}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </TabsContent>

      <TabsContent value="history" className="mt-6">
        {historySongs.length === 0 ? (
          <p className="text-gray-400">Bạn chưa nghe bài hát nào gần đây.</p>
        ) : (
          <ul className="space-y-4">
            {historySongs.map((item) => (
              <li
                key={item._id}
                className="flex items-center gap-4 p-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition"
              >
                <div className="relative w-14 h-14 flex-shrink-0">
                  <Image
                    src={item.song_info?.coverArt || "/placeholder.svg"}
                    alt={item.song_info?.title || "Bài hát"}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="font-semibold truncate">{item.song_info?.title}</div>
                  <div className="text-sm text-gray-400 truncate">{item.song_info?.artist}</div>
                </div>
                <div className="text-xs text-gray-500 whitespace-nowrap">
                  {new Date(item.timestamp).toLocaleString("vi-VN")}
                </div>
              </li>
            ))}
          </ul>
        )}
      </TabsContent>

      <TabsContent value="following" className="mt-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {followingArtists.length === 0 ? (
            <p className="text-gray-400">You are not following any artists.</p>
          ) : (
            followingArtists.map((artist) => (
              <div key={artist.id} className="bg-gray-800 p-4 rounded-lg text-center">
                <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden">
                  <Image
                    src={artist.image || "/placeholder.svg"}
                    alt={artist.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="mt-2 text-white font-semibold">{artist.name}</h4>
                <p className="text-sm text-gray-400">{artist.genres?.join(", ")}</p>
              </div>
            ))
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
