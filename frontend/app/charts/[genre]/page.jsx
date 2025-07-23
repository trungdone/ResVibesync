"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import TopSong from "../../../components/top100/TopSongs"; // VPOP
import GenreSongList from "../../../components/top100/GenreSongList"; // USUK, KPOP,...
import TopUsuk from "../../../components/top100/TopUsuk"; 
import Edm from "../../../components/top100/Edm"; 

// ==== DỮ LIỆU BÀI HÁT ====
const songs = [
  // --- VPOP ---
  {
    _id: "687a5f036677419512e939c3",
    title: "Bật Tình Yêu Lên",
    artist: "Hòa Minzy",
    album: "Album Hòa Minzy",
    releaseYear: 2025,
    duration: 419,
    genre: ["Pop", "Fun Music", "Love", "Vietnamese"],
    coverArt: "https://res.cloudinary.com/dhh7gy4vx/image/upload/v1750343584/image/auto-cover1.jpg",
    audioUrl: "https://res.cloudinary.com/dhh7gy4vx/video/upload/v1750343290/audio/bat-tinh-yeu-len.mp3"
  },
  {
    _id: "687a5fe36677419512e939c4",
    title: "Kém Cá Chọn Canh",
    artist: "Hòa Minzy",
    album: "Album Hòa Minzy",
    releaseYear: 2024,
    duration: 335,
    genre: ["Pop", "Fun Music", "Love", "Vietnamese"],
    coverArt: "https://res.cloudinary.com/dhh7gy4vx/image/upload/v1750343586/image/auto-cover2.jpg",
    audioUrl: "https://res.cloudinary.com/dhh7gy4vx/video/upload/v1750343204/audio/kem-ca-chon-canh.mp3"
  },

  // --- US-UK ---
  {
    _id: "687a61111177419512e939c7",
    title: "Shape of You",
    artist: "Ed Sheeran",
    album: "Divide",
    releaseYear: 2017,
    duration: 263,
    genre: ["Pop", "English"],
    coverArt: "https://upload.wikimedia.org/wikipedia/en/4/45/Divide_cover.png",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    _id: "687a61111177419512e939c8",
    title: "Blank Space",
    artist: "Taylor Swift",
    album: "1989",
    releaseYear: 2014,
    duration: 240,
    genre: ["Pop", "English"],
    coverArt: "https://upload.wikimedia.org/wikipedia/en/f/f6/Taylor_Swift_-_1989.png",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  }
];

// ==== Mapping đường dẫn => genre trong dữ liệu ====
const genreMapping = {
  vpop: "Vietnamese",
  usuk: "UK-US",
  kpop: "Korean",
  edm: "EDM",
  bolero: "Bolero",
  young: "Pop"
};

export default function GenrePage() {
  const { genre } = useParams();
  const [filteredSongs, setFilteredSongs] = useState([]);

  useEffect(() => {
    if (genre) {
      const mappedGenre = genreMapping[genre.toLowerCase()];
      if (mappedGenre) {
        const result = songs.filter((song) =>
          song.genre.some((g) => g.toLowerCase() === mappedGenre.toLowerCase())
        );
        setFilteredSongs(result);
      } else {
        setFilteredSongs([]);
      }
    }
  }, [genre]);

  // ==== Xử lý component hiển thị ====
  let content;
  const genreLower = genre?.toLowerCase();

  if (genreLower === "vpop") {
    content = <TopSong songs={filteredSongs} />;
  } else if (
    genreLower === "usuk" ||
    genreLower === "kpop" ||
    genreLower === "bolero" ||
    genreLower === "young"
  ) {
    content = <GenreSongList songs={filteredSongs} />;
  } else if (
    genreLower === "topusuk" 
  ) {
    content = <TopUsuk songs={filteredSongs} />;
  }else if (
    genreLower === "edm" 
  ) {
    content = <Edm songs={filteredSongs} />;
  }
   else {
    content = <p>Không tìm thấy thể loại "{genre}"</p>;
  }

  return (
    <section className="p-4">
      <h1 className="text-3xl font-bold capitalize mb-6">Top 100 {genre}</h1>
      {content}
    </section>
  );
}
