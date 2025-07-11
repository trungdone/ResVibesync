// app/role_artist/layout.jsx
"use client";

import ArtistSidebar from "@/components/layout/artist-sidebar";
import Header from "@/components/layout/header";
import { NotificationProvider } from "@/context/notification-context";
import { MusicProvider } from "@/context/music-context";
import Player from "@/components/player";
import RoleGuard from "@/components/guards/RoleGuard";

export default function ArtistRootLayout({ children }) {
  return (
    <RoleGuard role="artist">
      <NotificationProvider>
        <MusicProvider>
          <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
            <Header />
            <div className="flex flex-1">
              <ArtistSidebar />
              <main className="flex-1 p-6 overflow-y-auto bg-gray-900/90 rounded-lg shadow-inner">
                {children}
              </main>
            </div>
            <Player />
          </div>
        </MusicProvider>
      </NotificationProvider>
    </RoleGuard>
  );
}
