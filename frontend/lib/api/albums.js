// lib/api/albums.js
import { apiFetch } from "../utils";

export async function fetchAlbums(params = {}) {
  const query = new URLSearchParams(params).toString();
  const endpoint = `/api/albums${query ? `?${query}` : ""}`;
  const data = await apiFetch(endpoint, { fallbackOnError: { albums: [] } });
  return data.albums || [];
}

export async function fetchAlbumById(id) {
  const endpoint = `/api/albums/${id}`;
  const data = await apiFetch(endpoint, { fallbackOnError: null });
  if (!data) throw new Error("Album not found");
  return data;
}

export async function fetchAlbumsByArtist(artist_id) {
  const endpoint = "/api/albums";
  return await apiFetch(endpoint, { fallbackOnError: [] })
    .then(data => {
      const albums = Array.isArray(data.albums) ? data.albums : (Array.isArray(data) ? data : []);
      return albums.filter(album => album.artist_id === artist_id);
    });
}
