import { apiFetch } from "../utils";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

// 🔹 Hỗ trợ xây query string
function buildQuery(params = {}) {
  return new URLSearchParams(params).toString();
}

// 🔹 Lấy tất cả bài hát (có thể truyền params như { region, genre, limit, noCache })
export async function fetchSongs(params = {}) {
  const { noCache, ...restParams } = params;
  const query = buildQuery(restParams);
  const endpoint = `/api/songs${query ? `?${query}` : ""}`;
  const data = await apiFetch(endpoint, {
    fallbackOnError: { songs: [] },
    cache: noCache ? "no-store" : undefined,
  });
  return data.songs || [];
}

// 🔹 Lấy bài hát theo ID từ Next.js API
export async function fetchSongById(id, noCache = false) {
  const endpoint = `/api/songs/${id}`;
  return await apiFetch(endpoint, {
    cache: noCache ? "no-store" : undefined,
  });
}

// 🔹 Lấy bài hát theo ID từ FastAPI trực tiếp
export async function getSongById(id) {
  const res = await fetch(`${API_BASE}/songs/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

// 🔹 Lấy nhiều bài hát theo danh sách ID
export async function fetchSongsByIds(songIds) {
  const promises = songIds.map((id) => apiFetch(`/api/songs/${id}`));
  return await Promise.all(promises);
}

// 🔹 Tạo bài hát mới
export async function createSong(data) {
  const endpoint = "/api/songs";
  return await apiFetch(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
}

// 🔹 Lấy bài hát theo artistId
export async function fetchSongsByArtist(artistId) {
  const data = await apiFetch("/api/songs", { fallbackOnError: [] });
  const songs = Array.isArray(data.songs) ? data.songs : (Array.isArray(data) ? data : []);
  return songs.filter(song => song.artistId === artistId);
}

// 🔹 Lấy ngẫu nhiên top bài hát
export async function fetchTopSongs(limit = 10) {
  const data = await apiFetch("/api/songs", { fallbackOnError: [] });
  const songs = Array.isArray(data.songs) ? data.songs : (Array.isArray(data) ? data : []);
  return songs.sort(() => 0.5 - Math.random()).slice(0, limit);
}

// 🔹 Tìm bài hát theo keyword
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

// 🔹 Lọc bài hát theo vùng (region)
export async function fetchSongsByRegion(region, noCache = false) {
  const endpoint = `/api/songs?region=${encodeURIComponent(region)}`;
  const data = await apiFetch(endpoint, {
    fallbackOnError: { songs: [] },
    cache: noCache ? "no-store" : undefined,
  });
  return data.songs || [];
}

// 🔹 Lọc bài hát theo thể loại (genre)
export async function fetchSongsByGenre(genreName) {
  try {
    const query = genreName ? new URLSearchParams({ genre: genreName }).toString() : "";
    const endpoint = `/api/songs${query ? `?${query}` : ""}`;
    console.log(`Fetching songs for genre: ${genreName}`);
    const data = await apiFetch(endpoint, {
      fallbackOnError: { songs: [], total: 0 }
    });

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
