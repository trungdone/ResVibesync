
import { fetchArtists } from "@/lib/api/artists";
import { fetchSongsByArtistWithQuery } from "@/lib/api/songs";
import ArtistFanSectionClient from "./ArtistFanSectionClient";

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

export default async function ArtistFanSection() {
  try {
    // Fetch danh sách nghệ sĩ
    const artistsData = await fetchArtists({ cache: "force-cache" });
    const artistsArray = Array.isArray(artistsData) ? artistsData : artistsData.artists || [];
    if (!artistsArray.length) {
      throw new Error("Không tìm thấy nghệ sĩ hoặc định dạng dữ liệu không hợp lệ");
    }

    // Ánh xạ dữ liệu nghệ sĩ
    const mappedArtists = artistsArray.map((artist) => ({
      id: artist._id || crypto.randomUUID(),
      name: artist.name || "Nghệ sĩ không xác định",
      avatar: artist.thumbnail || artist.image || "https://via.placeholder.com/80",
      followers: artist.followers ? `${(artist.followers / 1000000).toFixed(1)}M` : "0M",
    }));

    // Chọn nghệ sĩ ngẫu nhiên
    const currentArtistIndex = Math.floor(Math.random() * mappedArtists.length);
    const currentArtist = mappedArtists[currentArtistIndex];

    // Fetch bài hát, chỉ lấy các trường cần thiết
    const songsData = await fetchSongsByArtistWithQuery(currentArtist.id, {
      cache: "force-cache",
      fields: "_id,title,artist,coverArt,duration,artistId",
    });

    // Ánh xạ và lọc bài hát
    const mappedSongs = songsData
      .slice(0, 200) // Giảm giới hạn để tối ưu
      .filter((song) => {
        const hasValidId = song._id || song.id;
        const matchesArtistById = String(song.artistId) === String(currentArtist.id);
        const matchesArtistByName = song.artist === currentArtist.name;
        return hasValidId && (matchesArtistById || matchesArtistByName);
      })
      .map((song) => ({
        id: song._id || song.id || crypto.randomUUID(),
        title: song.title || "Bài hát không xác định",
        duration: song.duration ? formatDuration(song.duration) : "3:00",
        image: song.thumbnail || song.coverArt || song.image || "https://via.placeholder.com/180",
        audioUrl: song.audioUrl || "",
        coverArt: song.coverArt || "",
        artist_id: song.artistId || currentArtist.id,
        artist: song.artist || currentArtist.name,
      }));

    return (
      <ArtistFanSectionClient
        initialArtists={mappedArtists}
        initialArtistIndex={currentArtistIndex}
        initialSongs={mappedSongs}
      />
    );
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Server Component Error:", error);
    }
    return (
      <div className="text-center text-red-400 text-lg font-medium">
        Lỗi tải dữ liệu: {error.message}
      </div>
    );
  }
}
