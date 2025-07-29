"use client"; // Đánh dấu component client-side

import { useState, useEffect, useCallback, Suspense } from "react"; // Nhập React hooks
import { motion, AnimatePresence } from "framer-motion"; // Nhập motion cho animation
import ArtistHeader from "./ArtistHeader"; // Nhập component ArtistHeader
import SongList from "./SongList"; // Nhập component SongList
import { useMusic } from "@/context/music-context"; // Nhập context quản lý nhạc
import PropTypes from "prop-types"; // Nhập PropTypes để kiểm tra kiểu props
import { fetchSongsByArtistWithQuery } from "@/lib/api/songs"; // Nhập API lấy bài hát theo nghệ sĩ

const formatDuration = (seconds) => {
  // Định dạng thời gian sang phút:giây
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

// Animation variants
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function ArtistFanSectionClient({ initialArtists, initialArtistIndex, initialSongs }) {
  const [artists, setArtists] = useState(initialArtists || []); // State danh sách nghệ sĩ
  const [currentArtistIndex, setCurrentArtistIndex] = useState(initialArtistIndex || -1); // State chỉ số nghệ sĩ
  const [topSongs, setTopSongs] = useState(initialSongs || []); // State danh sách bài hát
  const [songPageIndex, setSongPageIndex] = useState(0); // State trang bài hát
  const [timeLeft, setTimeLeft] = useState(60); // State đếm ngược
  const [isLoading, setIsLoading] = useState(false); // State trạng thái tải
  const songsPerPage = 5;
  const { setSongs, setContext, setContextId, playSong, togglePlayPause, isPlaying, currentSong } = useMusic();

  useEffect(() => {
    // Cập nhật nghệ sĩ và bài hát mỗi 60 giây
    let timer;
    if (artists.length > 0 && currentArtistIndex >= 0) {
      timer = setInterval(async () => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            let newIndex;
            do {
              newIndex = Math.floor(Math.random() * artists.length);
            } while (newIndex === currentArtistIndex && artists.length > 1);
            setIsLoading(true); // Bắt đầu loading
            setCurrentArtistIndex(newIndex);
            setSongPageIndex(0);

            // Hàm async để fetch songs
            const fetchNewSongs = async () => {
              const currentArtist = artists[newIndex];
              console.log("Fetching songs for artist:", { id: currentArtist.id, name: currentArtist.name });
              const songsData = await fetchSongsByArtistWithQuery(currentArtist.id, { cache: 'force-cache' }); // Lấy bài hát
              console.log("Raw songs from API:", JSON.stringify(songsData, null, 2));

              const mappedSongs = songsData
                .slice(0, 500)
                .filter((song) => {
                  const hasValidId = song._id || song.id;
                  const matchesArtistById = String(song.artistId) === String(currentArtist.id);
                  const matchesArtistByName = song.artist === currentArtist.name;
                  const matchesArtist = hasValidId && (matchesArtistById || matchesArtistByName);
                  if (!matchesArtist) {
                    console.warn(
                      `Song does not match artist:`,
                      JSON.stringify(song, null, 2),
                      `Current artist ID: ${currentArtist.id} (type: ${typeof currentArtist.id})`,
                      `Song artistId: ${song.artistId} (type: ${typeof song.artistId})`,
                      `Current artist name: ${currentArtist.name}`,
                      `Song artist: ${song.artist}`,
                      `Matches by ID: ${matchesArtistById}`,
                      `Matches by name: ${matchesArtistByName}`
                    );
                  }
                  return matchesArtist;
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
              console.log("Mapped songs:", JSON.stringify(mappedSongs, null, 2));
              setTopSongs(mappedSongs);
              setIsLoading(false); // Kết thúc loading
            };
            fetchNewSongs();

            return 60; // Reset timer
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [artists, currentArtistIndex]);

  const handlePlay = useCallback(
    // Xử lý phát/tạm dừng bài hát
    (song) => {
      console.log("Handle play, song ID:", song.id, "isPlaying:", isPlaying, "currentSong:", currentSong?.id);
      if (currentSong && currentSong.id === song.id && isPlaying) {
        togglePlayPause();
      } else {
        setSongs(topSongs);
        setContext("artist");
        setContextId(song.artist_id);
        playSong({
          ...song,
          image: song.image || "https://via.placeholder.com/180",
        });
      }
    },
    [topSongs, setSongs, setContext, setContextId, playSong, togglePlayPause, isPlaying, currentSong]
  );

  const handlePlayAll = useCallback(() => {
    // Phát tất cả bài hát từ bài đầu
    if (topSongs.length > 0) {
      const firstSong = {
        ...topSongs[0],
        image: topSongs[0].image || "https://via.placeholder.com/180",
      };
      setSongs(topSongs);
      setContext("artist");
      setContextId(firstSong.artist_id);
      playSong(firstSong);
    }
  }, [topSongs, setSongs, setContext, setContextId, playSong]);

  const handlePrevPage = () => {
    setSongPageIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNextPage = () => {
    setSongPageIndex((prev) => Math.min(prev + 1, Math.ceil(topSongs.length / songsPerPage) - 1));
  };

  const currentArtist = artists[currentArtistIndex] || {};

  return (
    <Suspense fallback={<div className="text-center text-white text-lg font-medium">Đang tải...</div>}>
      <AnimatePresence>
        {isLoading ? (
          <motion.div
            key="loading"
            className="text-center text-white text-lg font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            Loading ...
          </motion.div>
        ) : (
          <motion.div
            key={currentArtist.id}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.5, ease: "easeInOut" }} // Tăng thời gian và thêm ease
          >
            <ArtistHeader
              artist={currentArtist}
              timeLeft={timeLeft}
              onNextArtist={() => {
                let newIndex;
                do {
                  newIndex = Math.floor(Math.random() * artists.length);
                } while (newIndex === currentArtistIndex && artists.length > 1);
                setIsLoading(true);
                setCurrentArtistIndex(newIndex);
                setSongPageIndex(0);

                // Fetch songs ngay khi nhấn Next Artist
                const fetchNewSongs = async () => {
                  const currentArtist = artists[newIndex];
                  const songsData = await fetchSongsByArtistWithQuery(currentArtist.id, { cache: 'force-cache' });
                  const mappedSongs = songsData
                    .slice(0, 500)
                    .filter((song) => {
                      const hasValidId = song._id || song.id;
                      const matchesArtistById = String(song.artistId) === String(currentArtist.id);
                      const matchesArtistByName = song.artist === currentArtist.name;
                      const matchesArtist = hasValidId && (matchesArtistById || matchesArtistByName);
                      return matchesArtist;
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
                  setTopSongs(mappedSongs);
                  setIsLoading(false);
                };
                fetchNewSongs();
              }}
            /> 
            <SongList
              songs={topSongs}
              songPageIndex={songPageIndex}
              songsPerPage={songsPerPage}
              artistName={currentArtist.name || "Nghệ sĩ không xác định"}
              onPlay={handlePlay}
              isPlaying={isPlaying}
              currentSong={currentSong}
              onPrevPage={handlePrevPage}
              onNextPage={handleNextPage}
            /> 
          </motion.div>
        )}
      </AnimatePresence>
    </Suspense>
  );
}

ArtistFanSectionClient.propTypes = {
  initialArtists: PropTypes.array.isRequired,
  initialArtistIndex: PropTypes.number.isRequired,
  initialSongs: PropTypes.array.isRequired,
};