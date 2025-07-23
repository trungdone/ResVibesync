// lib/api/songs.js
import { apiFetch } from "../utils";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

// 🔹 Hàm hỗ trợ xây query string
function buildQuery(params = {}) {
  return new URLSearchParams(params).toString();
}

// 🔹 Lấy tất cả bài hát (có thể thêm { region: "vietnamese", noCache: true })
export async function fetchSongs(params = {}) {
  const { noCache, ...restParams } = params;
  const query = buildQuery(restParams);
  const endpoint = `/api/songs${query ? `?${query}` : ""}`;
  return await apiFetch(endpoint, {
    fallbackOnError: { songs: [] },
    cache: noCache ? "no-store" : undefined,
  }).then(data => data.songs || []);
}

// 🔹 Lấy 1 bài hát theo ID
export async function fetchSongById(id, noCache = false) {
  const endpoint = `/api/songs/${id}`;
  return await apiFetch(endpoint, {
    cache: noCache ? "no-store" : undefined,
  });
}

// 🔹 Lấy nhiều bài hát theo danh sách ID
export async function fetchSongsByIds(songIds) {
  const promises = songIds.map((id) => apiFetch(`/api/songs/${id}`));
  return await Promise.all(promises);
}

// 🔹 Lấy 1 bài hát từ API gốc (FastAPI)
export async function getSongById(id) {
  const res = await fetch(`${API_BASE}/songs/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

// 🔹 Tạo mới bài hát
export async function createSong(data) {
  const endpoint = "/api/songs";
  return await apiFetch(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
}

// 🔹 Lấy tất cả bài hát theo artistId
export async function fetchSongsByArtist(artistId) {
  const endpoint = "/api/songs";
  return await apiFetch(endpoint, { fallbackOnError: [] })
    .then(data => {
      const songs = Array.isArray(data.songs) ? data.songs : (Array.isArray(data) ? data : []);
      return songs.filter(song => song.artistId === artistId);
    });
}

// 🔹 Lấy ngẫu nhiên top bài hát (để gợi ý)
export async function fetchTopSongs(limit = 10) {
  const endpoint = "/api/songs";
  return await apiFetch(endpoint, { fallbackOnError: [] })
    .then(data => {
      const songs = Array.isArray(data.songs) ? data.songs : (Array.isArray(data) ? data : []);
      return songs.sort(() => 0.5 - Math.random()).slice(0, limit); // Sắp xếp ngẫu nhiên
    });
}

// 🔹 Tìm bài hát theo từ khoá (search bar)
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

// 🔹 MỚI: Lọc bài hát theo vùng (Vietnamese / International / All)
// 🔹 Có hỗ trợ noCache = true để dùng khi bấm nút refresh
export async function fetchSongsByRegion(region, noCache = false) {
  const endpoint = `/api/songs?region=${encodeURIComponent(region)}`;
  const data = await apiFetch(endpoint, {
    fallbackOnError: { songs: [] },
    cache: noCache ? "no-store" : undefined,
  });
  return data.songs || [];
}
