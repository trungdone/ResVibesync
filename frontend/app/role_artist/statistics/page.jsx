"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Bar } from "react-chartjs-2";

export default function ArtistStatistics() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "artist") {
      router.push("/signin");
      return;
    }
    async function loadStats() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8000/api/artist/statistics", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    }
    if (!authLoading) loadStats();
  }, [user, authLoading, router]);

  if (authLoading || !stats) {
    return <div>Loading statistics...</div>;
  }

  const chartData = {
    labels: stats.recentDays.map((d) => d.date),
    datasets: [
      {
        label: "Daily Streams",
        data: stats.recentDays.map((d) => d.streams),
        backgroundColor: "#6366f1",
      },
    ],
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Artist Statistics</h1>
      <div className="bg-white p-6 rounded shadow">
        <Bar data={chartData} />
      </div>
    </div>
  );
}
