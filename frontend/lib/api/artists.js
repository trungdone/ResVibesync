// lib/api/artists.js
import { apiFetch } from "../utils";

export async function fetchArtists() {
  const endpoint = "/api/artists";
  return await apiFetch(endpoint, { fallbackOnError: [] });
}

export async function fetchArtistById(id) {
  const endpoint = `/api/artists/${id}`;
  return await apiFetch(endpoint);
}


export async function createArtist(data) {
  const endpoint = "/api/artists";
  return await apiFetch(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
}

export async function fetchSuggestedArtists(artistId) {
  const endpoint = "/api/artists";
  return await apiFetch(endpoint, { fallbackOnError: [] })
    .then(data => {
      console.log("Raw API response for suggested artists:", data); // Debug raw data
      const artists = Array.isArray(data.artists) ? data.artists : (Array.isArray(data) ? data : []);
      return artists.filter(a => a.id !== artistId).slice(0, 5);
    });
}

export async function fetchSuggestedArtists(artistId) {
  const data = await apiFetch("/api/artists", { fallbackOnError: [] });

  const artists = Array.isArray(data?.artists)
    ? data.artists
    : Array.isArray(data)
    ? data
    : [];

  return artists
    .filter((a) => a.id !== artistId && a._id !== artistId)
    .slice(0, 5);
}

export async function fetchArtistSuggestions(query) {
  const token = localStorage.getItem("token");
  const res = await fetch(
    `http://localhost:8000/api/artists/similar?query=${encodeURIComponent(query)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
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


