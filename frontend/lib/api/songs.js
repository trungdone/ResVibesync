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
    const params = { artistId}; // Thêm giới hạn 10 bài
    const songs = await fetchSongs(params);
    if (process.env.NODE_ENV === "development") {
      console.log(`Received ${songs.length} songs for artist ${artistId}`);
    }
    return songs; // Không cần sort hay slice vì server đã lọc và giới hạn
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


export async function fetchSongsByGenre(genreName) {
  try {
    const query = genreName ? new URLSearchParams({ genre: genreName }).toString() : "";
    const endpoint = `/api/songs${query ? `?${query}` : ""}`;
    console.log(`Fetching songs for genre: ${genreName}`);
    const data = await apiFetch(endpoint, { fallbackOnError: { songs: [], total: 0 } });
    if (!data || !Array.isArray(data.songs)) {
      console.error("Invalid response from API:", data);
      return { songs: [], total: 0 };
    }
    console.log(`Received ${data.songs.length} songs`);
    return data;
  } catch (error) {
    console.error(`Error fetching songs by genre (${genreName}):`, error);
    return { songs: [], total: 0 };
  }
}
