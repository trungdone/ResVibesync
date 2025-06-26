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