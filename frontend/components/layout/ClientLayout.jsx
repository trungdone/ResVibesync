"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/layout/sidebar";
import Player from "@/components/player";
import Header from "@/components/layout/header";
import { MusicProvider } from "@/context/music-context";
import { useAuth } from "@/context/auth-context";
import { NotificationProvider } from "@/context/notification-context";
import Footer from "@/components/layout/Footer";

export default function ClientLayout({ children }) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (loading) return;

    // ⛔ Redirect nếu chưa đăng nhập
    if (!isAuthenticated && !["/signin", "/signup"].includes(pathname)) {
      router.push("/signin");
      return;
    }

    // ✅ Xử lý role-based redirect (nếu cần)
    if (user) {
      const isAdminPage = pathname.startsWith("/admin");
      const isArtistPage = pathname.startsWith("/role_artist");
      const isAllowedArtistPage = isArtistPage || pathname.startsWith("/song/");

      if (user.role === "admin" && !isAdminPage) {
        router.push("/admin/dashboard");
        return;
      } else if (user.role === "artist" && !isAllowedArtistPage) {
       router.push("/role_artist/dashboard");
       return;
      } else if (user.role !== "admin" && isAdminPage) {
        router.push("/");
        return;
      }
    }

    // ✅ Nếu hợp lệ
    setReady(true);
  }, [user, isAuthenticated, loading, pathname, router]);

  if (loading || !ready) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <div className="text-center">
          <p className="text-xl font-semibold">Loading your dashboard...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait while we fetch your data.</p>
        </div>
      </div>
    );
  }

  // 🎵 ARTIST LAYOUT
  if (pathname.startsWith("/role_artist")) {
    return (
      <NotificationProvider>
        <MusicProvider>{children}</MusicProvider>
      </NotificationProvider>
    );
  }

  // 🛠️ ADMIN LAYOUT
  if (pathname.startsWith("/admin")) {
    return (
      <NotificationProvider>
        {children}
      </NotificationProvider>
    );
  }

  // 👤 DEFAULT USER LAYOUT
  return (
    <NotificationProvider>
      <MusicProvider>
        <div className="flex flex-col h-screen bg-gradient-to-b from-purple-900/10 to-black">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-4">{children}
            <Footer />
            </main>
          </div>
          <Player />
        </div>
      </MusicProvider>
    </NotificationProvider>
  );
}
