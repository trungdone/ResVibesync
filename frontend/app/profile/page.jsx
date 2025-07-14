"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useNotifications } from "@/context/notification-context";
import { getAllPlaylists } from "@/lib/api/playlists";
import { fetchHistory, fetchFollowingArtists, fetchLikedSongs } from "@/lib/api/user";
import { fetchArtistSuggestions } from "@/lib/api/artists";
import { toast } from "@/components/ui/use-toast";
import RequestArtistPopup from "@/components/profile/RequestArtistPopup";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  const [historySongs, setHistorySongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotifications();
  const router = useRouter();
  const [followingArtists, setFollowingArtists] = useState([]);
  const [requestSent, setRequestSent] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestData, setRequestData] = useState({
    name: "",
    bio: "",
    social_links: [],
    genres: [],
    phone: "",
    image: "",
  });
  const [suggestions, setSuggestions] = useState([]);
  const [selectedArtistId, setSelectedArtistId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/signin");
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);

        const playlistData = await getAllPlaylists();
        setPlaylists(playlistData.slice(0, 8) || []);

        const likedRes = await fetchLikedSongs();
        setLikedSongs(likedRes.liked || []);

        const historyRes = await fetchHistory(user.id);
        setHistorySongs(historyRes.history || []);

        const followingData = await fetchFollowingArtists();
        setFollowingArtists(followingData.following || []);
      } catch (err) {
        console.error("❌ Lỗi khi load dữ liệu profile:", err);
        toast({
          title: "Lỗi",
          description: "Không thể tải dữ liệu hồ sơ.",
          variant: "destructive",
        });
        router.push("/signin");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, authLoading, router]);

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (requestData.name.length < 2) return;
      const results = await fetchArtistSuggestions(requestData.name);
      setSuggestions(results);
    }, 300);
    return () => clearTimeout(delay);
  }, [requestData.name]);

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/api/artist_requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...requestData,
          matched_artist_id: selectedArtistId || null,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit artist request");

      setSuccess("Artist request submitted successfully");
      addNotification({
        type: "info",
        title: "Artist Request Sent",
        message: "Your artist request has been sent and is pending review.",
        created_at: new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }),
      });

      setShowRequestForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (authLoading || loading || !user) {
    return <div className="flex justify-center items-center h-[60vh]">Loading...</div>;
  }

  return (
    <div className="space-y-6 pb-20">
      <ProfileHeader
        user={user}
        playlists={playlists}
        followingArtists={followingArtists}
        showNotice={showNotice}
        setShowNotice={setShowNotice}
        setShowRequestForm={setShowRequestForm}
        requestSent={requestSent}
      />

      {showRequestForm && (
        <RequestArtistPopup
          requestData={requestData}
          setRequestData={setRequestData}
          suggestions={suggestions}
          setSuggestions={setSuggestions}
          setShowRequestForm={setShowRequestForm}
          selectedArtistId={selectedArtistId}
          setSelectedArtistId={setSelectedArtistId}
          setRequestSent={setRequestSent}
          error={error}
          success={success}
          onSuccess={() => setRequestSent(true)}
          handleSubmit={handleRequestSubmit}
          closePopup={() => setShowRequestForm(false)}
        />
      )}

      <ProfileTabs
        playlists={playlists}
        likedSongs={likedSongs}
        historySongs={historySongs}
        followingArtists={followingArtists}
      />
    </div>
  );
}
