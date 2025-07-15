"use client";

// ======= Import các thành phần giao diện chính =======
import useAlbumDetail from "@/components/album/useAlbumDetail";                 // Hook tùy chỉnh: Lấy dữ liệu album, nghệ sĩ, bài hát
import AlbumHeader from "@/components/album/AlbumHeader";                      // Phần đầu trang hiển thị thông tin album
import SongSection from "@/components/album/SongSection";                      // Phần hiển thị danh sách các bài hát trong album
import OtherAlbumsSection from "@/components/album/OtherAlbumsSection";        // Hiển thị các album khác của cùng nghệ sĩ


export default function AlbumDetailPage() {
  // ======= Lấy dữ liệu thông qua hook tùy chỉnh =======
  const {
    album,
    artist,
    songs,
    artistAlbums,
    loading,
    error,
    isFromOtherAlbums,
  } = useAlbumDetail();

  // ======= Trạng thái đang tải dữ liệu =======
  if (loading) {
    return (
      <div className="text-white text-center py-24">
        Loading...
      </div>
    );
  }

  // ======= Xử lý lỗi hoặc album không tồn tại =======
  if (error || !album) {
    return (
      <div className="text-red-500 text-center py-24">
        {error || "Album not found"}
      </div>
    );
  }

  // ======= Hiển thị trang chi tiết album =======
  return (
    <div className="space-y-8 pb-24 max-w-6xl mx-auto">
      <AlbumHeader album={album} artist={artist} songs={songs} />
      <SongSection songs={songs} />
      
      {/* Chỉ hiển thị OtherAlbumsSection nếu không đến từ mục "Other Albums" */}
      {!isFromOtherAlbums && (
        <OtherAlbumsSection albums={artistAlbums} />
      )}
    </div>
  );
}
