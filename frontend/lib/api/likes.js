export async function likeSong(songId) {
  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:8000/api/likes/${songId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.json();
}

export async function unlikeSong(songId) {
  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:8000/api/likes/${songId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.json();
}

export async function checkLiked(songId) {
  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:8000/api/likes/check/${songId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const data = await res.json();
  return data.isLiked;
}

export async function fetchLikeCount(songId) {
  const res = await fetch(`http://localhost:8000/api/likes/count/${songId}`);
  const data = await res.json();
  return data.like_count || 0;
}
