"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Settings, UserPlus } from "lucide-react"
import { useAuth } from "@/context/auth-context"
const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/<your_cloud_name>/"
import Footer from "@/components/layout/footer"

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:8000/user/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        setUser(res.data)
      } catch (err) {
        router.push("/signin")
      }
    }
    fetchUser()
  }, [])

  if (!user) return <div className="text-white p-10">Loading...</div>

  const avatarUrl = user.avatar?.startsWith("http")
    ? user.avatar
    : `${CLOUDINARY_BASE_URL}${user.avatar || "images/default.jpg"}`

  return (
    <div className="min-h-screen bg-black text-white">
      {/* === HEADER SECTION === */}
      <div className="relative bg-gradient-to-b from-[#1f1f1f] to-black">
        {/* Blurred Background */}
        <div
          className="absolute inset-0 bg-cover bg-center blur-2xl opacity-20"
          style={{ backgroundImage: `url('${avatarUrl}')` }}
        />
        
        {/* Foreground Content */}
        <div className="relative z-10 px-6 py-10 sm:py-16 flex items-end gap-6">
          {/* Avatar */}
          <img
            src={avatarUrl}
            alt="User Avatar"
            className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover shadow-lg border-4 border-white"
          />

          {/* Name + Email */}
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold">{user.name}</h1>
            <p className="text-gray-300 mt-2 text-sm sm:text-base">{user.email}</p>
          </div>
        </div>
      </div>

      {/* === ACTION BUTTONS === */}
      <div className="px-6 py-8 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.push("/artist/become")}
            className="bg-purple-500 hover:bg-purple-400 text-black font-semibold px-6 py-3 rounded-full transition flex items-center gap-2 justify-center"
          >
            <UserPlus size={20} />
            Become an Artist
          </button>

          <button
            onClick={() => router.push("/profile/settings")}
            className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white font-semibold px-6 py-3 rounded-full transition flex items-center gap-2 justify-center"
          >
            <Settings size={20} />
            Account Settings
          </button>
        </div>
      </div>
    
      <Footer />

    </div>

  )
}