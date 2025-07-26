"use client"
import { useEffect, useState } from "react"
import { Heart } from "lucide-react"
import axios from "axios"

export default function LikeButton({ songId }) {
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    const checkLiked = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/likes/is-liked/${songId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        setIsLiked(res.data.isLiked)
      } catch (e) {
        console.error("Failed to check like:", e)
      }
    }
    checkLiked()
  }, [songId])

  const toggleLike = async () => {
    try {
      if (isLiked) {
        await axios.post(`http://localhost:8000/likes/${songId}/unlike`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        setIsLiked(false)
      } else {
        await axios.post(`http://localhost:8000/likes/${songId}/like`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        setIsLiked(true)
      }
    } catch (e) {
      console.error("Toggle like failed:", e)
    }
  }

  return (
    <button
      onClick={toggleLike}
      className={`px-6 py-3 rounded-full flex items-center gap-2 transition-colors duration-300 ${
        isLiked ? "bg-green-600 text-white hover:bg-green-400" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
      }`}
    >
      <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
      {isLiked ? "Liked" : "Like"}
    </button>
  )
}
