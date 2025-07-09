import { apiFetch } from "../utils";

// ✅ Lấy danh sách tất cả nghệ sĩ (truyền token nếu có)
export async function fetchArtists(token = null) {
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  return await apiFetch("/api/artists", {
    headers,
    fallbackOnError: [],
  });
}

// ✅ Lấy nghệ sĩ theo ID
export async function fetchArtistById(id, token = null) {
  const endpoint = `/api/artists/${id}`;
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  return await apiFetch(endpoint, { headers });
}

// ✅ Tạo mới nghệ sĩ
export async function createArtist(data) {
  return await apiFetch("/api/artists", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

// ✅ Gợi ý nghệ sĩ (trừ artistId hiện tại)
export async function fetchSuggestedArtists(artistId, token = null) {
  const data = await fetchArtists(token); // <-- Sử dụng phiên bản có token
  const artists = Array.isArray(data.artists) ? data.artists : [];
  return artists.filter((a) => a.id !== artistId && a._id !== artistId).slice(0, 5);
}

// ✅ Follow nghệ sĩ
export async function followArtist(artistId) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Missing access token");
  return await apiFetch(`/api/artists/${artistId}/follow`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// ✅ Unfollow nghệ sĩ
export async function unfollowArtist(artistId) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Missing access token");
  return await apiFetch(`/api/artists/${artistId}/unfollow`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
