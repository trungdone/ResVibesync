"use client";

import Link from "next/link";
import { Music, User, BarChart2, Home } from "lucide-react";

export default function ArtistSidebar() {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-extrabold mb-8 text-green-400 tracking-tight">🎤 Artist Panel</h2>
      <nav className="space-y-4">
        <Link href="/role_artist/dashboard" className="block p-2 rounded hover:bg-green-500/20 transition">
          <Home size={18} className="inline mr-2 text-green-400" />
          Dashboard
        </Link>
        <Link href="/role_artist/songs" className="block p-2 rounded hover:bg-green-500/20 transition">
          <Music size={18} className="inline mr-2 text-green-400" />
          My Songs
        </Link>
        <Link href="/role_artist/statistics" className="block p-2 rounded hover:bg-green-500/20 transition">
          <BarChart2 size={18} className="inline mr-2 text-green-400" />
          Statistics
        </Link>
        <Link href="/role_artist/profile/view" className="block p-2 rounded hover:bg-green-500/20 transition">
          <User size={18} className="inline mr-2 text-green-400" />
          Profile
        </Link>
      </nav>
    </div>
  );
}
