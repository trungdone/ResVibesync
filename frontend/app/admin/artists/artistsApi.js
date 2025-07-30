<<<<<<< HEAD
// frontend/lib/artists.js
=======
<<<<<<< HEAD
>>>>>>> origin/main
=======
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
>>>>>>> main
import axios from "axios";
import axiosRetry from "axios-retry";

axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

const API_URL = "http://localhost:8000/api";

<<<<<<< HEAD
// 💡 ĐÚNG: danh sách nghệ sĩ
export async function fetchArtists(params = {}) {
  const token = localStorage.getItem("token");
  const query = new URLSearchParams(params).toString();
  try {
    const res = await axios.get(`${API_URL}/admin/artists?${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("✅ API response:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ API fetchArtists error", err.response?.data || err.message);
    throw err;
  }
}


// 💡 ĐÚNG: theo ID
export async function fetchArtistById(id) {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/admin/artists/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

// 💡 ĐÚNG: tạo mới
export async function createArtist(data) {
  const token = localStorage.getItem("token");
  const response = await axios.post(`${API_URL}/admin/artists`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

// 💡 ĐÚNG: cập nhật
export async function updateArtist(id, data) {
  const token = localStorage.getItem("token");
  const response = await axios.put(`${API_URL}/admin/artists/${id}`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

// 💡 ĐÚNG: xóa
export async function deleteArtist(id) {
  const token = localStorage.getItem("token");
  const response = await axios.delete(`${API_URL}/admin/artists/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}
=======
export async function fetchArtists(params = {}) {
  const token = localStorage.getItem("token");
  const query = new URLSearchParams(params).toString();
  const res = await axios.get(`${API_URL}/admin/artists?${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function fetchArtistById(id) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL}/admin/artists/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Fetch artist by ID response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Fetch artist by ID error:", error);
    throw new Error(`Artist not found: ${id}`);
  }
}

export async function createArtist(data) {
  const token = localStorage.getItem("token");
  const res = await axios.post(`${API_URL}/admin/artists`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return res.data;
}
<<<<<<< HEAD
>>>>>>> origin/main
=======
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
>>>>>>> main
