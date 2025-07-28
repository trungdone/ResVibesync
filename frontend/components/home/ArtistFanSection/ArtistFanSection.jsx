import { fetchArtists } from "@/lib/api/artists"; // Nhập API lấy danh sách nghệ sĩ
import { fetchSongsByArtistWithQuery } from "@/lib/api/songs"; // Nhập API lấy bài hát theo nghệ sĩ
import ArtistFanSectionClient from "./ArtistFanSectionClient"; // Nhập component client-side

const formatDuration = (seconds) => {
  // Định dạng thời gian từ giây sang phút:giây
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

export default async function ArtistFanSection() {
  const startTime = performance.now(); // Đo thời gian thực thi
  try {
    // Gọi API trên server với cache
    const artistsData = await fetchArtists({ cache: 'force-cache' }); // Lấy danh sách nghệ sĩ
    console.log("fetchArtists API took:", performance.now() - startTime, "ms");
    console.log("Raw artists from API:", JSON.stringify(artistsData, null, 2));

    const artistsArray = Array.isArray(artistsData) ? artistsData : artistsData.artists || []; // Chuẩn hóa dữ liệu nghệ sĩ
    if (!artistsArray.length) {
      throw new Error("Không tìm thấy nghệ sĩ hoặc định dạng dữ liệu không hợp lệ");
    }

    const mappedArtists = artistsArray.map((artist) => ({ // Ánh xạ dữ liệu nghệ sĩ
      id: artist._id || crypto.randomUUID(),
      name: artist.name || "Nghệ sĩ không xác định",
      avatar: artist.thumbnail || artist.image || "https://via.placeholder.com/80",
      followers: artist.followers ? `${(artist.followers / 1000000).toFixed(1)}M` : "0M",
    }));
    console.log("Mapped artists:", JSON.stringify(mappedArtists, null, 2));

    // Chọn nghệ sĩ ngẫu nhiên
    const currentArtistIndex = Math.floor(Math.random() * mappedArtists.length);
    const currentArtist = mappedArtists[currentArtistIndex]; // Nghệ sĩ hiện tại
    console.log("Current artist:", { id: currentArtist.id, name: currentArtist.name, idType: typeof currentArtist.id });

    // Gọi API bài hát cho nghệ sĩ hiện tại
    const songsData = await fetchSongsByArtistWithQuery(currentArtist.id, { cache: 'force-cache' }); // Lấy bài hát
    console.log("fetchSongsByArtistWithQuery API took:", performance.now() - startTime, "ms");
    console.log("Raw songs from API:", JSON.stringify(songsData, null, 2));
    console.log("Current artist ID:", currentArtist.id, "Name:", currentArtist.name);

    const mappedSongs = songsData
      .slice(0, 500) // Giới hạn 500 bài
      .filter((song) => { // Lọc bài hát hợp lệ
        const hasValidId = song._id || song.id;
        const matchesArtistById = String(song.artistId) === String(currentArtist.id);
        const matchesArtistByName = song.artist === currentArtist.name;
        const matchesArtist = matchesArtistById || matchesArtistByName;
        if (!hasValidId) console.warn(`Song missing ID:`, JSON.stringify(song, null, 2));
        if (!matchesArtist) {
          console.warn(
            `Song does not match artist:`,
            JSON.stringify(song, null, 2),
            `Current artist ID: ${currentArtist.id} (type: ${typeof currentArtist.id})`,
            `Song artistId: ${song.artistId} (type: ${typeof song.artistId})`,
            `Current artist name: ${currentArtist.name} (type: ${typeof currentArtist.name})`,
            `Song artist: ${song.artist} (type: ${typeof song.artist})`,
            `Matches by ID: ${matchesArtistById}`,
            `Matches by name: ${matchesArtistByName}`
          );
        }
        return hasValidId && matchesArtist;
      })
      .map((song) => ({ // Ánh xạ dữ liệu bài hát
        id: song._id || song.id || crypto.randomUUID(),
        title: song.title || "Bài hát không xác định",
        duration: song.duration ? formatDuration(song.duration) : "3:00",
        image: song.thumbnail || song.coverArt || song.image || "https://via.placeholder.com/180",
        audioUrl: song.audioUrl || "",
        coverArt: song.coverArt || "",
        artist_id: song.artistId || currentArtist.id,
        artist: song.artist || currentArtist.name,
      }));
    console.log("Mapped songs:", JSON.stringify(mappedSongs, null, 2));

    return (
      <ArtistFanSectionClient
        initialArtists={mappedArtists}
        initialArtistIndex={currentArtistIndex}
        initialSongs={mappedSongs}
      /> // Render component client-side
    );
  } catch (error) {
    console.error("Server Component Error:", error);
    return (
      <div className="text-center text-red-400 text-lg font-medium">
        Lỗi tải dữ liệu: {error.message} // Hiển thị lỗi nếu có
      </div>
    );
  }
}