"use client";

import Link from "next/link";
<<<<<<< HEAD
=======
import { motion } from "framer-motion";
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
import { Music, Users, FileText, Settings, List, BarChart, MessageSquare } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { MusicProvider } from "@/context/music-context";
import Header from "@/components/layout/header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
<<<<<<< HEAD
=======
import { NotificationProvider } from "@/context/notification-context";
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6

const queryClient = new QueryClient();

export default function AdminLayout({ children }) {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user || user.role !== "admin") {
    return <div className="flex items-center justify-center min-h-screen">Access Denied</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <MusicProvider>
<<<<<<< HEAD
        <div className="flex flex-col min-h-screen bg-gray-900">
          <Header />
          <div className="flex flex-1">
            <aside className="w-64 bg-gray-800 text-white p-4">
              <div className="flex items-center gap-2 mb-8">
                <Music size={32} />
                <h1 className="text-2xl font-bold">Admin Panel</h1>
=======
        <NotificationProvider>
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
          <Header />
          <div className="flex flex-1">
            <aside className="fixed w-64 bg-gray-800 p-6 shadow-xl border-r border-green-500/20 top-16 h-[calc(100%-64px)] overflow-y-auto">
              <div className="flex items-center gap-3 mb-8">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Music size={32} className="text-green-400" />
                </motion.div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                  Admin Panel
                </h1>
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
              </div>
              <nav className="space-y-2">
                <Link
                  href="/admin/dashboard"
<<<<<<< HEAD
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-700"
                >
                  <BarChart size={20} /> Dashboard
                </Link>
                <Link
                  href="/admin/songs"
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-700"
                >
                  <Music size={20} /> Songs
                </Link>
                <Link
                  href="/admin/users"
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-700"
                >
                  <Users size={20} /> Users
                </Link>
                <Link
                  href="/admin/artists"
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-700"
                >
                  <Users size={20} /> Artists
                </Link>
                <Link
                  href="/admin/playlists"
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-700"
                >
                  <List size={20} /> Playlists
                </Link>
                <Link
                  href="/admin/ai-config"
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-700"
                >
                  <Settings size={20} /> AI Config
                </Link>
                <Link
                  href="/admin/comments"
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-700"
                >
                  <MessageSquare size={20} /> Comments
                </Link>
                <Link
                  href="/admin/logs"
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-700"
                >
                  <FileText size={20} /> Logs
                </Link>
                <button
                  onClick={signOut}
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-700 w-full text-left"
                >
=======
                  className="flex items-center gap-3 p-3 rounded-lg text-gray-200 hover:bg-gradient-to-r hover:from-green-500/20 hover:to-green-600/20 hover:text-green-400 transition-all duration-200 group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <BarChart size={20} className="group-hover:text-green-400 transition-colors duration-200" />
                  </motion.div>
                  Dashboard
                </Link>
                <Link
                  href="/admin/songs"
                  className="flex items-center gap-3 p-3 rounded-lg text-gray-200 hover:bg-gradient-to-r hover:from-green-500/20 hover:to-green-600/20 hover:text-green-400 transition-all duration-200 group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Music size={20} className="group-hover:text-green-400 transition-colors duration-200" />
                  </motion.div>
                  Songs
                </Link>
                <Link
                  href="/admin/users"
                  className="flex items-center gap-3 p-3 rounded-lg text-gray-200 hover:bg-gradient-to-r hover:from-green-500/20 hover:to-green-600/20 hover:text-green-400 transition-all duration-200 group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Users size={20} className="group-hover:text-green-400 transition-colors duration-200" />
                  </motion.div>
                  Users
                </Link>
                <Link
                  href="/admin/artists"
                  className="flex items-center gap-3 p-3 rounded-lg text-gray-200 hover:bg-gradient-to-r hover:from-green-500/20 hover:to-green-600/20 hover:text-green-400 transition-all duration-200 group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Users size={20} className="group-hover:text-green-400 transition-colors duration-200" />
                  </motion.div>
                  Artists
                </Link>
                <Link href="/admin/artist-requests" className="flex items-center gap-2 p-2 hover:bg-purple-600/20 rounded">
  <Users size={20} />
  Artist Requests
</Link>
                <Link
                  href="/admin/albums"
                  className="flex items-center gap-3 p-3 rounded-lg text-gray-200 hover:bg-gradient-to-r hover:from-green-500/20 hover:to-green-600/20 hover:text-green-400 transition-all duration-200 group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FileText size={20} className="group-hover:text-green-400 transition-colors duration-200" />
                  </motion.div>
                  Albums
                </Link>
                <Link
                  href="/admin/playlists"
                  className="flex items-center gap-3 p-3 rounded-lg text-gray-200 hover:bg-gradient-to-r hover:from-green-500/20 hover:to-green-600/20 hover:text-green-400 transition-all duration-200 group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <List size={20} className="group-hover:text-green-400 transition-colors duration-200" />
                  </motion.div>
                  Playlists
                </Link>
                <Link
                  href="/admin/ai-config"
                  className="flex items-center gap-3 p-3 rounded-lg text-gray-200 hover:bg-gradient-to-r hover:from-green-500/20 hover:to-green-600/20 hover:text-green-400 transition-all duration-200 group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Settings size={20} className="group-hover:text-green-400 transition-colors duration-200" />
                  </motion.div>
                  AI Config
                </Link>
                <Link
                  href="/admin/comments"
                  className="flex items-center gap-3 p-3 rounded-lg text-gray-200 hover:bg-gradient-to-r hover:from-green-500/20 hover:to-green-600/20 hover:text-green-400 transition-all duration-200 group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MessageSquare size={20} className="group-hover:text-green-400 transition-colors duration-200" />
                  </motion.div>
                  Comments
                </Link>

                <button
                  onClick={signOut}
                  className="flex items-center gap-3 p-3 w-full rounded-lg text-gray-200 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200"
                >
                  <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                    </svg>
                  </motion.div>
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
                  Sign Out
                </button>
              </nav>
            </aside>
<<<<<<< HEAD
            <main className="flex-1 p-8">{children}</main>
          </div>
        </div>
=======
            <main className="flex-1 p-8 bg-gray-900/90 rounded-lg shadow-inner ml-64">{children}</main>
          </div>
        </div>
        </NotificationProvider>
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
      </MusicProvider>
    </QueryClientProvider>
  );
}