import { memo } from "react"; // Dùng memo để tối ưu re-render
import Image from "next/image"; // Component Image để hiển thị ảnh
import Link from "next/link"; // Điều hướng liên kết
import { motion } from "framer-motion"; // Thêm hiệu ứng animation
import { PlayIcon, Pause } from "lucide-react"; // Icon Play và Pause
import PropTypes from "prop-types"; // Kiểm tra kiểu props

const SongCard = memo(({ song, index, artistName, onPlay, isPlaying }) => (
  <motion.div
    key={song.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2, delay: index * 0.05 }}
    whileHover={{ scale: 1.05 }}
    className="relative w-full max-w-[180px] h-[220px] bg-gray-800/40 rounded-xl overflow-hidden"
  > {/* Container bài hát với animation xuất hiện, phóng to khi hover */}
    <div className="relative w-full h-[160px]">
      <Image
        src={song.image || "https://via.placeholder.com/180"}
        alt={song.title || "Bài hát không xác định"}
        width={180}
        height={160}
        className="w-full h-full object-cover"
        loading="lazy"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/180";
        }}
      /> {/* Ảnh bìa bài hát, dùng ảnh mặc định nếu không có */}
      <motion.div
        className="absolute bottom-2 right-2 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center cursor-pointer"
        onClick={() => onPlay(song)}
        whileHover={{ scale: 1.1, backgroundColor: "#5ac94bff" }}
      > {/* Nút play/pause với icon tương ứng */}
        {isPlaying ? <Pause className="w-6 h-6 text-white" /> : <PlayIcon className="w-6 h-6 text-white" />}
      </motion.div>
    </div>
    <div className="p-2 text-white text-center">
      {song.id ? (
        <Link href={`/song/${song.id}`}>
          <span className="text-white hover:underline font-semibold truncate">
            {song.title || "Bài hát không xác định"}
          </span>
        </Link> // Liên kết đến trang chi tiết bài hát
      ) : (
        <span className="text-gray-400 font-semibold truncate">
          {song.title || "Bài hát không xác định"} (ID không hợp lệ)
        </span>
      )}
      <p className="text-xs text-gray-400 truncate">{song.artist || artistName}</p> {/* Tên nghệ sĩ */}
    </div>
  </motion.div>
));

SongCard.propTypes = {
  song: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  artistName: PropTypes.string.isRequired,
  onPlay: PropTypes.func.isRequired,
  isPlaying: PropTypes.bool,
};

export default SongCard; // Xuất component