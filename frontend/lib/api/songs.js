// lib/api/songs.js
import { apiFetch } from "../utils";

export async function fetchSongs(params = {}) {
  const query = new URLSearchParams(params).toString();
  const endpoint = `/api/songs${query ? `?${query}` : ""}`;
  const data = await apiFetch(endpoint, { fallbackOnError: { songs: [] } });
  return data.songs || []; // Trả về mảng songs từ object, hoặc mảng rỗng nếu không có
}

export async function fetchSongById(id) {
  const endpoint = `/api/songs/${id}`;
  return await apiFetch(endpoint);
}

export async function fetchSongsByIds(songIds) {
  const promises = songIds.map((id) => apiFetch(`/api/songs/${id}`));
  return await Promise.all(promises);
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export async function getSongById(id) {
  const res = await fetch(`${API_BASE}/songs/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}


export async function createSong(data) {
  const endpoint = "/api/songs";
  return await apiFetch(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
}

// Thêm các phương thức update, delete nếu cần

export async function fetchSongsByArtist(artistId) {
  const endpoint = "/api/songs";
  return await apiFetch(endpoint, { fallbackOnError: [] })
    .then(data => {
      const songs = Array.isArray(data.songs) ? data.songs : (Array.isArray(data) ? data : []);
      return songs.filter(song => song.artistId === artistId);
    });
}

export async function fetchSongsByArtistWithQuery(artistId) {
  try {
    const params = { artistId };
    const songs = await fetchSongs(params);
    console.log(`Songs for artist ${artistId}:`, songs);
    // Sắp xếp ngẫu nhiên và lấy 4 bài hát
    const shuffledSongs = songs.sort(() => 0.5 - Math.random()).slice();
    return shuffledSongs;
  } catch (error) {
    console.error(`Error fetching songs for artist ${artistId}:`, error);
    return [];
  }
}

export async function fetchTopSongs(limit = 10) {
  const endpoint = "/api/songs";
  return await apiFetch(endpoint, { fallbackOnError: [] })
    .then(data => {
      const songs = Array.isArray(data.songs) ? data.songs : (Array.isArray(data) ? data : []);
      return songs.sort(() => 0.5 - Math.random()).slice(0, limit); // Sắp xếp ngẫu nhiên
    });
}

export async function fetchSongsByKeyword(keyword) {
  try {
    const query = encodeURIComponent(keyword);
    const data = await apiFetch(`/api/search?query=${query}`);
    return data?.songs || [];
  } catch (error) {
    console.error(`fetchSongsByKeyword error (${keyword}):`, error);
    return [];
  }
}




// export async function fetchSongsByGenre(genreName, limit = 500) {
//   try {
//     const params = new URLSearchParams({ genre: genreName, limit });
//     const endpoint = `/api/songs?${params.toString()}`;
//     console.log(`Fetching songs for genre: ${genreName}, limit: ${limit}`);
    
//     const data = await apiFetch(endpoint, { fallbackOnError: { songs: [], total: 0 } });
    
//     if (!data || !Array.isArray(data.songs)) {
//       console.error("Invalid response from API:", data);
//       return { songs: [], total: 0 };
//     }

//     console.log(`✅ Received ${data.songs.length} songs for genre ${genreName}`);
//     return data;
//   } catch (error) {
//     console.error(`❌ Error fetching songs by genre (${genreName}):`, error);
//     return { songs: [], total: 0 };
//   }
// }



// 📁 lib/api/songs.js
export const fetchSongsByGenre = async (genre) => {
  const url = `http://localhost:8000/api/top100/${genre.toLowerCase()}`; // ✅ Đúng route
  console.log("🎯 Fetching genre:", url);

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error("❌ Failed to fetch songs by genre", res.status);
      throw new Error("Failed to fetch songs by genre");
    }
    return await res.json();
  } catch (error) {
    console.error("💥 Error fetching songs:", error);
    throw error;
  }
};




