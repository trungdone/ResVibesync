"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Music, UploadCloud } from "lucide-react"
import axios from "axios"
import { useAuth } from "@/context/auth-context";


const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/<your_cloud_name>/"

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()
  const [newName, setNewName] = useState("")
  const { refreshUser } = useAuth();

  

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
        if (err.response?.status === 401) {
          router.push("/signin")
        } else {
          setError("Failed to fetch user data")
        }
      }
    }

    fetchUser()
  }, [])

  const handleAvatarChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const ext = file.name.toLowerCase().split(".").pop();
  if (!["jpg", "jpeg"].includes(ext)) {
    setError("Only JPG files are allowed.");
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    setError("File size must be less than 5MB.");
    return;
  }

  setError("");
  setSuccess("");

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await axios.post("http://localhost:8000/user/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    // ✅ Refresh global user context (this updates the header avatar)
    await refreshUser();

    // ✅ Update local state to reflect new avatar immediately
    setUser({ ...user, avatar: res.data.avatar });
    setSuccess("Avatar updated!");
  } catch (err) {
    setError("Failed to upload avatar");
  }
};


  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      await axios.post(
        "http://localhost:8000/user/change-password",
        { old_password: oldPassword, new_password: newPassword },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      setSuccess("Password updated successfully")
      setOldPassword("")
      setNewPassword("")
    } catch (err) {
      setError("Incorrect old password or error occurred")
    }
  }

  if (!user) return <div className="text-white p-10">Loading profile...</div>

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md p-8 space-y-8 bg-white/5 backdrop-blur-sm rounded-2xl">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-600 mb-4">
            <Music size={32} />
          </div>
          <h2 className="text-3xl font-bold">Your Profile</h2>
          <p className="text-gray-400 mt-2">Manage your info and security</p>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500 text-white p-3 rounded-lg">{error}</div>}
        {success && <div className="bg-green-500/20 border border-green-500 text-white p-3 rounded-lg">{success}</div>}

        {/* 🖼 Avatar Section */}
        <div className="space-y-4 text-center">
          <img
            src={
              user.avatar?.startsWith("http")
                ? user.avatar
                : `${CLOUDINARY_BASE_URL}${user.avatar || "images/default.jpg"}`
            }
            alt="Avatar"
            className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-purple-500"
            onError={(e) => (e.target.src = "/placeholder.svg")}
          />
          <label
            htmlFor="avatar"
            className="inline-flex items-center gap-2 cursor-pointer bg-purple-700 hover:bg-purple-600 text-white text-sm px-4 py-2 rounded-full transition"
          >
            <UploadCloud className="w-4 h-4" />
            Upload New Avatar
            <input
              type="file"
              id="avatar"
              accept="image/jpeg"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </label>
        </div>

        {/* 📝 Edit Display Name */}
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            setError("")
            setSuccess("")

            try {
              await axios.patch(
                "http://localhost:8000/user/user/update-name", // <-- add /user

                { name: newName },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              )
              await refreshUser();
              setUser({ ...user, name: newName })
              setSuccess("Name updated successfully")
            } catch (err) {
              setError("Failed to update name")
            }
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Display Name</label>
            <input
              type="text"
              className="input-field w-full px-3 py-2 bg-background border border-border rounded-md"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn-primary w-full bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-md transition"
          >
            Update Name
          </button>
        </form>



        {/* 🔑 Change Password */}
        <form onSubmit={handlePasswordChange} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Current Password</label>
            <input
              type="password"
              className="input-field w-full px-3 py-2 bg-background border border-border rounded-md"
              placeholder="Enter current password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
            <input
              type="password"
              className="input-field w-full px-3 py-2 bg-background border border-border rounded-md"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-md transition"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  )
}
