"use client";

// ======= Import các thành phần cần thiết =======
import { useEffect, useState } from "react";
import { Waves } from "lucide-react"; // Icon sóng âm nhạc
import AllAlbumSection from "@/components/viewAll/AllAlbumsSection";
import { fetchAlbums } from "@/lib/api/albums"; // Hàm gọi API lấy dữ liệu album

// ======= Component chính hiển thị toàn bộ album =======
export default function ViewAllAlbumsPage() {
  const [albums, setAlbums] = useState([]); // State lưu danh sách album

  // ======= Gọi API để lấy danh sách album sau khi component được mount =======
  useEffect(() => {
    const getAlbums = async () => {
      const data = await fetchAlbums(); // Gọi API
      setAlbums(data); // Cập nhật state
    };
    getAlbums(); // Thực hiện gọi
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Tiêu đề trang + Icon */}
      <div className="flex items-center gap-3 mb-6">
        <Waves size={28} className="text-[#00FFCC]" /> {/* Icon sóng âm nhạc */}
        <h1 className="text-3xl font-bold text-white">Explore All Albums</h1>
      </div>

      {/* Thành phần hiển thị danh sách tất cả các album */}
      <AllAlbumSection albums={albums} />
    </div>
  );
}
