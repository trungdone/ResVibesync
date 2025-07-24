"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { fetchMoodAndActivityData } from "./dataGenres.jsx";

// Component hiển thị section Mood & Activity
export default function MoodAndActivitySection() {
  // State để lưu dữ liệu, trạng thái tải, và lỗi
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tải dữ liệu khi component được mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchMoodAndActivityData(); // Gọi hàm lấy dữ liệu
        setData(result);
      } catch (err) {
        setError("Không tải được danh sách Mood & Activity");
      } finally {
        setLoading(false); // Kết thúc trạng thái tải
      }
    };
    loadData();
  }, []);

  // Hiển thị spinner khi đang tải dữ liệu
  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
        <p className="text-gray-400 mt-2">Loading Mood & Activity ...</p>
      </div>
    );
  }

  // Hiển thị thông báo lỗi nếu có
  if (error) {
    return <div className="text-center text-red-400 py-10">{error}</div>;
  }

  // Giao diện chính của section
  return (
    <div className="space-y-10">
      {/* Tiêu đề section */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold mb-3">🌀 Mood & Activity</h1>
        <p className="text-gray-400">Choose a playlist that suits your mood</p>
      </div>
      {/* Hiển thị danh sách các card playlist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.map((topic, index) => (
          <div
            key={index}
            className="relative rounded-2xl overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300 bg-white/5 hover:bg-white/10"
          >
            {/* Hình ảnh của playlist */}
            <Image
              src={topic.image}
              alt={`Hình ảnh bìa cho ${topic.title}`}
              width={600}
              height={300}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Nội dung text và link */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-4 flex flex-col justify-end">
              <h2 className="text-xl font-bold mb-2">{topic.title}</h2>
              <p className="text-sm text-gray-400 mb-2">{topic.subtitle}</p>
              <div className="flex flex-wrap gap-2">
                {topic.playlists.map((pl, i) => (
                  <Link
                    key={i}
                    href={{
                      pathname: pl.href,
                      query: {
                        title: pl.title,
                        image: topic.image,
                        genre: pl.genre,
                        subtitle: topic.subtitle,
                        time: topic.time,
                        followers: topic.followers,
                      },
                    }}
                    className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full transition"
                  >
                    {pl.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}