"use client";

import { useState,useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, Bell, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useMusic } from "@/context/music-context";
import NotificationPopover from "@/components/notifications/notification-popover";
import { useNotifications } from "@/context/notification-context";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, signOut } = useAuth();
  const { resetPlayer } = useMusic();
  const { notifications } = useNotifications();

  const [keyword, setKeyword] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = Array.isArray(notifications)
    ? notifications.filter((n) => !n.read).length
    : 0;

  // ✅ Debounce để chuyển hướng khi người dùng gõ
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (keyword.trim()) {
        if (!pathname.startsWith("/search")) {
          router.push(`/search?query=${encodeURIComponent(keyword.trim())}`);
        } else {
          router.replace(`/search?query=${encodeURIComponent(keyword.trim())}`);
        }
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [keyword]);
  
  useEffect(() => {
  if (pathname === "/") {
    setKeyword("");
  }
}, [pathname]);


  const handleSignOut = () => {
    signOut();
    resetPlayer();
    router.push("/signin");
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-black/50 backdrop-blur-md">
      {/* -------- Search Box -------- */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search for songs, artists, or playlists..."
          className="w-full bg-white/10 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
      </div>

      {/* -------- Right Controls -------- */}
      <div className="flex items-center gap-4 ml-4">
        {isAuthenticated ? (
          <>
            {/* --- Notifications --- */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-1">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <NotificationPopover onClose={() => setShowNotifications(false)} />
            )}

            {/* --- User Dropdown --- */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 hover:bg-white/10 rounded-full pl-1 pr-3 py-1"
              >
                <div className="relative w-7 h-7 rounded-full overflow-hidden">
                  <Image
                    src={user?.avatar || "/placeholder.svg"}
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
                    onClick={() => {
                      handleSignOut();
                      setShowDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
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
                pathname === "/signup"
                  ? "bg-purple-600"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
