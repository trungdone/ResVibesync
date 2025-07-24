<<<<<<< HEAD
=======
<<<<<<< HEAD
// app/admin/dashboard/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
=======
>>>>>>> main
"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Music, Disc, Mic, Heart, Users as UsersIcon, MessageCircle, Flag } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { fetchSongs } from "@/lib/api/songs";
import { fetchArtists } from "@/lib/api/artists";
import { fetchAlbums } from "@/lib/api/albums";
import Link from "next/link";
<<<<<<< HEAD
=======
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
>>>>>>> main

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    users: 0,
    songs: 0,
    playlists: 0,
    albums: 0,
    artists: 0,
    song_likes: 0,
    followers: 0,
    comments: 0,
    reports: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
<<<<<<< HEAD
=======
<<<<<<< HEAD
    if (!user || user.role !== "admin") return;

    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8000/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          throw new Error("Failed to fetch dashboard stats");
        }
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error",
          description: err.message,
=======
>>>>>>> main
    if (!user || user.role !== "admin") {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Only admins can access the dashboard",
      });
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");

        // Gọi API để lấy dữ liệu chi tiết
        const [songsResponse, albumsResponse, artistsResponse, usersResponse, dashboardResponse] = await Promise.all([
          fetchSongs(),
          fetchAlbums(),
          fetchArtists(),
          fetch("http://localhost:8000/user/users", {
            headers: { Authorization: `Bearer ${token}` },
          }).then(res => res.json()),
          fetch("http://localhost:8000/admin/dashboard", {
            headers: { Authorization: `Bearer ${token}` },
          }).then(res => res.json()),
        ]);

        console.log("Songs response:", songsResponse);
        console.log("Albums response:", albumsResponse);
        console.log("Artists response:", artistsResponse);
        console.log("Users response:", usersResponse);
        console.log("Dashboard stats:", dashboardResponse);

        setStats({
          users: Array.isArray(usersResponse) ? usersResponse.length : usersResponse?.users?.length || 0,
          songs: Array.isArray(songsResponse) ? songsResponse.length : songsResponse?.songs?.length || 0,
          playlists: dashboardResponse.playlists || 0,
          albums: Array.isArray(albumsResponse) ? albumsResponse.length : albumsResponse?.albums?.length || 0,
          artists: Array.isArray(artistsResponse) ? artistsResponse.length : artistsResponse?.artists?.length || 0,
          song_likes: dashboardResponse.song_likes || 0,
          followers: dashboardResponse.followers || 0,
          comments: dashboardResponse.comments || 0,
          reports: dashboardResponse.reports || 0,
        });
      } catch (err) {
        console.error("Fetch data error:", err.message);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load dashboard data",
<<<<<<< HEAD
=======
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
>>>>>>> main
        });
      } finally {
        setLoading(false);
      }
    };
<<<<<<< HEAD
=======
<<<<<<< HEAD
    fetchStats();
  }, [user, toast]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 bg-white/10 rounded-lg">
          <h2 className="text-xl font-semibold">Total Users</h2>
          <p className="text-2xl">{stats.users}</p>
        </div>
        <div className="p-4 bg-white/10 rounded-lg">
          <h2 className="text-xl font-semibold">Total Songs</h2>
          <p className="text-2xl">{stats.songs}</p>
        </div>
        <div className="p-4 bg-white/10 rounded-lg">
          <h2 className="text-xl font-semibold">Total Playlists</h2>
          <p className="text-2xl">{stats.playlists}</p>
        </div>
        <div className="p-4 bg-white/10 rounded-lg">
          <h2 className="text-xl font-semibold">Total Albums</h2>
          <p className="text-2xl">{stats.albums}</p>
        </div>
        <div className="p-4 bg-white/10 rounded-lg">
          <h2 className="text-xl font-semibold">Total Artists</h2>
          <p className="text-2xl">{stats.artists}</p>
        </div>
        <div className="p-4 bg-white/10 rounded-lg">
          <h2 className="text-xl font-semibold">Total Song Likes</h2>
          <p className="text-2xl">{stats.song_likes}</p>
        </div>
        <div className="p-4 bg-white/10 rounded-lg">
          <h2 className="text-xl font-semibold">Total Followers</h2>
          <p className="text-2xl">{stats.followers}</p>
        </div>
        <div className="p-4 bg-white/10 rounded-lg">
          <h2 className="text-xl font-semibold">Total Comments</h2>
          <p className="text-2xl">{stats.comments}</p>
        </div>
        <div className="p-4 bg-white/10 rounded-lg">
          <h2 className="text-xl font-semibold">Total Reports</h2>
          <p className="text-2xl">{stats.reports}</p>
        </div>
      </div>
    </div>
  );
}
=======
>>>>>>> main
    fetchData();
  }, [user, toast]);

  // Dữ liệu cho biểu đồ
  const chartData = [
    { name: "Users", value: stats.users, fill: "#10b981" },
    { name: "Songs", value: stats.songs, fill: "#34d399" },
    { name: "Albums", value: stats.albums, fill: "#6ee7b7" },
    { name: "Artists", value: stats.artists, fill: "#a7f3d0" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-300">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-t-green-500 border-gray-700 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-8 text-transparent bg-gradient-to-r from-green-400 to-green-600 bg-clip-text"
      >
        Admin Dashboard
      </motion.h1>

      {/* Cards Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {[
          { title: "Total Users", value: stats.users, icon: Users, link: "/admin/users" },
          { title: "Total Songs", value: stats.songs, icon: Music, link: "/admin/songs" },
          { title: "Total Albums", value: stats.albums, icon: Disc, link: "/admin/albums" },
          { title: "Total Artists", value: stats.artists, icon: Mic, link: "/admin/artists" },
        ].map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
          >
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border border-green-500/30 shadow-lg rounded-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="flex items-center justify-between">
                <div className="flex items-center">
                  <item.icon className="text-green-400 mr-3 h-6 w-6" />
                  <CardTitle className="text-lg font-semibold text-gray-200">{item.title}</CardTitle>
                </div>
                <Link href={item.link}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-green-400 hover:text-green-300 hover:bg-green-500/20"
                  >
                    View
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-white">{item.value.toLocaleString()}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Chart Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mb-8"
      >
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border border-green-500/30 shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-200">Overview Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Additional Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {[
          { title: "Total Song Likes", value: stats.song_likes, icon: Heart },
          { title: "Total Followers", value: stats.followers, icon: UsersIcon },
          { title: "Total Comments", value: stats.comments, icon: MessageCircle },
          { title: "Total Reports", value: stats.reports, icon: Flag },
          { title: "Total Playlists", value: stats.playlists, icon: Disc },
        ].map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
          >
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border border-green-500/30 shadow-lg rounded-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="flex items-center">
                <item.icon className="text-green-400 mr-3 h-6 w-6" />
                <CardTitle className="text-lg font-semibold text-gray-200">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-white">{item.value.toLocaleString()}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
>>>>>>> main
