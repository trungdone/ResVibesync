"use client";

import Link from "next/link";
import { Music, User, BarChart2, Home } from "lucide-react";

export default function ArtistSidebar() {
  return (
    <aside className="w-64 bg-gradient-to-b from-gray-800 to-gray-900 border-r border-green-500/30 p-4 shadow-xl">
      <h2 className="text-xl font-bold mb-6 text-green-400">🎤 Artist Panel</h2>
      <nav className="space-y-4">
        <Link
          href="/role_artist/dashboard"
          className="block p-2 rounded hover:bg-green-500/20 transition"
        >
          <Home size={18} className="inline mr-2 text-green-400" />
          Dashboard
        </Link>
        <Link
          href="/role_artist/songs"
          className="block p-2 rounded hover:bg-green-500/20 transition"
        >
          <Music size={18} className="inline mr-2 text-green-400" />
          My Songs
        </Link>
        <Link
          href="/role_artist/statistics"
          className="block p-2 rounded hover:bg-green-500/20 transition"
        >
          <BarChart2 size={18} className="inline mr-2 text-green-400" />
          Statistics
        </Link>
        <Link
          href="/role_artist/profile"
          className="block p-2 rounded hover:bg-green-500/20 transition"
        >
          <User size={18} className="inline mr-2 text-green-400" />
          Profile
        </Link>
      </nav>
    </aside>
  );
}
