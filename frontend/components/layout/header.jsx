"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Search, Bell, ChevronDown } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import Image from "next/image"
import { useMusic } from "@/context/music-context"
import NotificationPopover from "@/components/notifications/notification-popover"
import { useNotifications } from "@/context/notification-context"

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, signOut } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const { resetPlayer } = useMusic()
  const { notifications } = useNotifications()
  const unreadCount = Array.isArray(notifications)
  ? notifications.filter((n) => !n.read).length
  : 0;
    const handleSignOut = () => {
    signOut()
    resetPlayer() // ✅ Dừng và reset player khi đăng xuất
    router.push("/signin")
  }
const handleSearch = (e) => {
  if (pathname.startsWith("/admin")) {
    console.log("Admin search:", e.target.value);
    // TODO: Gọi API tìm kiếm admin (ví dụ: /admin/search?query=...)
  } else {
    console.log("User search:", e.target.value);
    // TODO: Gọi API tìm kiếm user
  }
};

  return (
    <header className="sticky top-0 z-10 bg-black/50 backdrop-blur-md px-4 py-3 flex items-center justify-between">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
  type="text"
  placeholder={
    pathname.startsWith("/admin")
      ? "Search for users, songs, or settings..."
      : "Search for songs, artists, or playlists..."
  }
  onChange={handleSearch}
  className="w-full bg-white/10 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
/>      
      </div>
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
       <button
       className="relative w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 animate-bounce"
       onClick={() => setShowNotifications(!showNotifications)}
          >
         <Bell size={18} />
       {unreadCount > 0 && (
     <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-1 animate-ping">
      {unreadCount}
    </span>
       )}
      </button>
      {showNotifications && (
  <NotificationPopover onClose={() => setShowNotifications(false)} />
)}
            <div className="relative">
              <button
                className="flex items-center gap-2 hover:bg-white/10 rounded-full pl-1 pr-3 py-1"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="relative w-7 h-7 rounded-full overflow-hidden">
                  <Image
                    src={user?.avatar || "/placeholder.svg?height=28&width=28&query=user+avatar"}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-sm font-medium">{user?.name || "User"}</span>
                <ChevronDown size={16} />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-1 z-20">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm hover:bg-white/10"
                    onClick={() => setShowDropdown(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm hover:bg-white/10"
                    onClick={() => setShowDropdown(false)}
                  >
                    Settings
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-white/10 text-red-400"
                    onClick={() => {
                      signOut()
                      resetPlayer()
                      setShowDropdown(false)
                      router.push("/signin") // ✅ Điều hướng về trang signin
                    }}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/signin"
              className={`text-sm font-medium px-4 py-2 rounded-full ${
                pathname === "/signin" ? "bg-white/10" : "hover:bg-white/10"
              }`}
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className={`text-sm font-medium px-4 py-2 rounded-full ${
                pathname === "/signup" ? "bg-purple-600" : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
