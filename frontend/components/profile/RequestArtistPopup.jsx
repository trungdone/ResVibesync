"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { fetchArtistSuggestions } from "@/lib/api/artists";
import { useNotifications } from "@/context/notification-context";

export default function RequestArtistPopup({
  requestData,
  setRequestData,
  setShowRequestForm,
  selectedArtistId,
  setSelectedArtistId,
  setRequestSent,
}) {
  const { addNotification } = useNotifications();
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

      if (response.status === 409) {
        setError("You have already submitted a request. Please wait for admin approval.");
        return;
      }

      if (!response.ok) throw new Error("Failed to submit artist request.");

      setSuccess("Artist request submitted successfully.");
      setRequestSent(true);
      setShowRequestForm(false);

      addNotification({
        type: "info",
        title: "Request Sent",
        message: "Your artist request has been submitted and is pending admin review.",
        created_at: new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }),
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Request Artist Role</h2>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-white p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/20 border border-green-500 text-white p-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleRequestSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
              Artist Name
            </label>
            <Input
              id="name"
              placeholder="Enter artist name..."
              value={requestData.name}
              onChange={(e) => {
                setRequestData({ ...requestData, name: e.target.value });
                setSelectedArtistId(null);
              }}
              required
            />
            {suggestions.length > 0 && (
              <ul className="bg-white shadow rounded mt-2 max-h-40 overflow-y-auto z-50">
                {suggestions.map((artist) => (
                  <li
                    key={artist.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setRequestData({ ...requestData, name: artist.name });
                      setSelectedArtistId(artist.id);
                      setSuggestions([]);
                    }}
                  >
                    {artist.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">
              Bio
            </label>
            <Textarea
              id="bio"
              value={requestData.bio}
              onChange={(e) => setRequestData({ ...requestData, bio: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
              Phone
            </label>
            <Input
              id="phone"
              value={requestData.phone}
              onChange={(e) => setRequestData({ ...requestData, phone: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-1">
              Artist Image URL
            </label>
            <Input
              id="image"
              placeholder="Paste image URL here"
              value={requestData.image}
              onChange={(e) => setRequestData({ ...requestData, image: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="genres" className="block text-sm font-medium text-gray-300 mb-1">
              Genres (comma-separated)
            </label>
            <Input
              id="genres"
              placeholder="Pop, Rock, EDM"
              value={requestData.genres.join(", ")}
              onChange={(e) =>
                setRequestData({
                  ...requestData,
                  genres: e.target.value.split(",").map((g) => g.trim()),
                })
              }
            />
          </div>

          <div>
            <label htmlFor="social_links" className="block text-sm font-medium text-gray-300 mb-1">
              Social Links (comma-separated)
            </label>
            <Input
              id="social_links"
              placeholder="https://facebook.com/you, https://instagram.com/you"
              value={requestData.social_links.join(", ")}
              onChange={(e) =>
                setRequestData({
                  ...requestData,
                  social_links: e.target.value.split(",").map((link) => link.trim()),
                })
              }
            />
          </div>

          <div className="flex gap-4 mt-4">
            <Button type="submit" className="btn-primary w-full">
              Submit Request
            </Button>
            <Button
              type="button"
              onClick={() => setShowRequestForm(false)}
              className="btn-secondary w-full"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
