import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const fetchSongs = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get(`${API_URL}/artist/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.songs || [];
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch songs');
  }
};

export const createSong = async (songData) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.post(`${API_URL}/songs`, songData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { data: response.data, message: 'Song created successfully!' };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create song');
  }
};

export const updateSong = async (id, songData) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.put(`${API_URL}/songs/${id}`, songData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { data: response.data, message: 'Song updated successfully!' };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update song');
  }
};

export const deleteSong = async (id) => {
  const token = localStorage.getItem('token');
  try {
    await axios.delete(`${API_URL}/songs/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { message: 'Song deleted successfully!' };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete song');
  }
};

export const fetchArtistById = async (id) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get(`${API_URL}/artists/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch artist');
  }
};

export async function fetchAlbums() {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:8000/api/artist/albums", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const msg = await res.text();
    console.error("❌ fetchAlbums failed:", res.status, msg);
    return [];
  }
  const data = await res.json();
  console.log("✅ fetchAlbums response:", data);
  return data.albums || [];
}


export async function uploadMedia(formData) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(`${API_URL}/artist/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Upload media error:", error);
    throw new Error("Failed to upload media");
  }
}