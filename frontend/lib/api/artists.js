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

// ✅ Gợi ý nghệ sĩ (loại bỏ chính artist hiện tại)
export async function fetchSuggestedArtists(artistId, token = null) {
  const data = await fetchArtists(token); // gọi lại hàm fetchArtists phía trên
  const artists = Array.isArray(data?.artists)
    ? data.artists
    : Array.isArray(data)
    ? data
    : [];
  return artists.filter((a) => a.id !== artistId && a._id !== artistId).slice(0, 5);
}

// ✅ Gợi ý nghệ sĩ theo tên gần giống
export async function fetchArtistSuggestions(query) {
  const token = localStorage.getItem("token");
  const res = await fetch(
    `http://localhost:8000/api/artists/similar?query=${encodeURIComponent(query)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await res.json();
  return data;
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
