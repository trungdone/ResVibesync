
"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ArtistHeader from "./ArtistHeader";
import SongList from "./SongList";
import { useMusic } from "@/context/music-context";
import PropTypes from "prop-types";
import { fetchSongsByArtistWithQuery } from "@/lib/api/songs";

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function ArtistFanSectionClient({ initialArtists, initialArtistIndex, initialSongs }) {
  const [artists, setArtists] = useState(initialArtists || []);
  const [currentArtistIndex, setCurrentArtistIndex] = useState(initialArtistIndex || -1);
  const [topSongs, setTopSongs] = useState(initialSongs || []);
  const [songPageIndex, setSongPageIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);
  const [isLoading, setIsLoading] = useState(false);
  const songsPerPage = 5;
  const { setSongs, setContext, setContextId, playSong, togglePlayPause, isPlaying, currentSong } = useMusic();

  useEffect(() => {
    let timer;
    if (artists.length > 0 && currentArtistIndex >= 0) {
      timer = setInterval(async () => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            let newIndex;
            do {
              newIndex = Math.floor(Math.random() * artists.length);
            } while (newIndex === currentArtistIndex && artists.length > 1);
            setIsLoading(true);
            setCurrentArtistIndex(newIndex);
            setSongPageIndex(0);

            const fetchNewSongs = async () => {
              const currentArtist = artists[newIndex];
              const songsData = await fetchSongsByArtistWithQuery(currentArtist.id, {
                cache: "force-cache",
                fields: "_id,title,artist,coverArt,duration,artistId",
              });
              const mappedSongs = songsData
                .slice(0, 200)
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
              setTopSongs(mappedSongs);
              setIsLoading(false);
            };
            fetchNewSongs();
            return 300;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [artists, currentArtistIndex]);

  const handlePlay = useCallback((song) => {
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
  }, [topSongs, setSongs, setContext, setContextId, playSong, togglePlayPause, isPlaying, currentSong]);

  const handlePlayAll = useCallback(() => {
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

  const handlePrevPage = useCallback(() => {
    setSongPageIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleNextPage = useCallback(() => {
    setSongPageIndex((prev) => Math.min(prev + 1, Math.ceil(topSongs.length / songsPerPage) - 1));
  }, []);

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
            transition={{ duration: 0.5, ease: "easeInOut" }}
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

                const fetchNewSongs = async () => {
                  const currentArtist = artists[newIndex];
                  const songsData = await fetchSongsByArtistWithQuery(currentArtist.id, {
                    cache: "force-cache",
                    fields: "_id,title,artist,coverArt,duration,artistId",
                  });
                  const mappedSongs = songsData
                    .slice(0, 200)
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
