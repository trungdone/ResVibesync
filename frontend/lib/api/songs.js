import { apiFetch } from "../utils";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

// 🔹 Build query string từ params
function buildQuery(params = {}) {
  return new URLSearchParams(params).toString();
}

/**
 * Lấy tất cả bài hát (hỗ trợ params như { region, genre, limit, page, sort, refresh, noCache })
 * — Gọi qua Next API: /api/songs
 */
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

/** Lấy bài hát theo ID từ Next.js API */
export async function fetchSongById(id, noCache = false) {
  const endpoint = `/api/songs/${id}`;
  return await apiFetch(endpoint, {
    cache: noCache ? "no-store" : undefined,
  });
}

/** Lấy bài hát theo ID từ FastAPI trực tiếp */
export async function getSongById(id) {
  const res = await fetch(`${API_BASE}/songs/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

/** Lấy nhiều bài hát theo danh sách ID (qua Next API) */
export async function fetchSongsByIds(songIds) {
  const promises = songIds.map((id) => apiFetch(`/api/songs/${id}`));
  return await Promise.all(promises);
}

/** Tạo bài hát mới (qua Next API) */
export async function createSong(data) {
  const endpoint = "/api/songs";
  return await apiFetch(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
}

/** Lấy bài hát theo artistId (lọc client-side) */
export async function fetchSongsByArtist(artistId) {
  const data = await apiFetch("/api/songs", { fallbackOnError: [] });
  const songs = Array.isArray(data.songs)
    ? data.songs
    : Array.isArray(data)
    ? data
    : [];
  return songs.filter((song) => song.artistId === artistId);
}

/** Lấy bài hát theo artist bằng fetchSongs + vẫn lọc client-side (an toàn khi BE chưa hỗ trợ filter) */
export async function fetchSongsByArtistWithQuery(artistId) {
  try {
    const all = await fetchSongs({});
    const songs = (all || []).filter((s) => s.artistId === artistId);
    // Có thể random nếu muốn
    return songs.slice().sort(() => 0.5 - Math.random());
  } catch (error) {
    console.error(`Error fetching songs for artist ${artistId}:`, error);
    return [];
  }
}

/** Lấy ngẫu nhiên top bài hát (client-side) */
export async function fetchTopSongs(limit = 10) {
  const data = await apiFetch("/api/songs", { fallbackOnError: [] });
  const songs = Array.isArray(data.songs)
    ? data.songs
    : Array.isArray(data)
    ? data
    : [];
  return songs.sort(() => 0.5 - Math.random()).slice(0, limit);
}

/** Tìm bài hát theo keyword (Next API /api/search) */
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

/** Lọc bài hát theo vùng (region) — Next API /api/songs?region=... */
export async function fetchSongsByRegion(region, noCache = false) {
  const endpoint = `/api/songs?region=${encodeURIComponent(region)}`;
  const data = await apiFetch(endpoint, {
    fallbackOnError: { songs: [] },
    cache: noCache ? "no-store" : undefined,
  });
  return data.songs || [];
}

/**
 * Lọc bài hát theo thể loại (genre) — Next API /api/songs?genre=...
 * Trả về { songs, total }
 */
export async function fetchSongsByGenre(genreName) {
  try {
    const query = genreName
      ? new URLSearchParams({ genre: genreName }).toString()
      : "";
    const endpoint = `/api/songs${query ? `?${query}` : ""}`;
    const data = await apiFetch(endpoint, {
      fallbackOnError: { songs: [], total: 0 },
    });

    if (!data || !Array.isArray(data.songs)) {
      console.error("Invalid response from API:", data);
      return { songs: [], total: 0 };
    }

    return {
      songs: data.songs,
      total: typeof data.total === "number" ? data.total : data.songs.length,
    };
  } catch (error) {
    console.error(`Error fetching songs by genre (${genreName}):`, error);
    return { songs: [], total: 0 };
  }
}

/**
 * (Tuỳ chọn) Lấy Top100 theo thể loại từ FastAPI trực tiếp
 * - Yêu cầu backend có route: GET /api/top100/{genre}
 * - Trả về mảng bài hát (không bọc trong { songs, total })
 */
export async function fetchTop100ByGenre(genre) {
  const url = `${API_BASE}/top100/${encodeURIComponent(
    String(genre || "").toLowerCase()
  )}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      const txt = await res.text();
      console.error(`❌ fetchTop100ByGenre ${res.status}:`, txt);
      throw new Error("Failed to fetch Top100 by genre");
    }
    return await res.json();
  } catch (error) {
    console.error("💥 Error fetchTop100ByGenre:", error);
    throw error;
  }
}
