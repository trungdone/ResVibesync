// components/SearchInput.jsx
"use client";

import { useState, useEffect } from "react";
import { searchAll } from "@/lib/api/search";

export default function SearchInput({ onResults }) {
  const [keyword, setKeyword] = useState("");
  const [debounced, setDebounced] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(keyword);
    }, 300); // debounce 300ms
    return () => clearTimeout(timer);
  }, [keyword]);

  useEffect(() => {
    if (!debounced.trim()) {
      onResults({ songs: [], artists: [], albums: [] });
      return;
    }

    (async () => {
      setLoading(true);
      try {
        const data = await searchAll(debounced.trim());
        onResults(data);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [debounced, onResults]);

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Tìm bài hát, nghệ sĩ, album..."
        className="w-full p-2 rounded bg-gray-800 text-white"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      {loading && <p className="text-gray-400 text-sm mt-2">Đang tìm kiếm…</p>}
    </div>
  );
}
