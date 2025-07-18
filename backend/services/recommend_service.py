from database.db import (
    song_history_collection, songs_collection,
    likes_collection, follows_collection, artists_collection
)
from bson import ObjectId
from datetime import datetime
from collections import Counter


def get_recommendations(user_id: str, limit: int = 10):
    user_oid = ObjectId(user_id)

    # Bước 1: Lấy lịch sử nghe gần nhất
    history = list(song_history_collection.find({"user_id": user_oid}))
    if not history:
        print("❌ No history found")
        return []

    latest = sorted(history, key=lambda x: x.get("timestamp", datetime.min), reverse=True)[0]
    recent_song = songs_collection.find_one({"_id": latest["song_id"]})
    if not recent_song:
        print("❌ Recent song not found in DB")
        return []

    # Bước 2: Trích thông tin từ bài vừa nghe
    recent_artist = recent_song.get("artist")
    recent_genres = recent_song.get("genre", [])
    recent_tags = recent_song.get("tags", [])

    print(f"🎧 Recent song: {recent_song['title']} by {recent_artist}")
    print(f"🎼 Genres: {recent_genres}")
    print(f"🏷️ Tags: {recent_tags}")

    # Bước 3: Xây query
    query = {
        "$or": [
            {"artist": recent_artist},
            {"genre": {"$in": recent_genres}},
            {"tags": {"$in": recent_tags}},
        ]
    }

    # Bước 4: Trừ các bài đã nghe nhiều
    song_id_counter = Counter([h["song_id"] for h in history])
    recommended_raw = list(songs_collection.find(query).limit(limit * 3))
    recommended = []

    for song in recommended_raw:
        count = song_id_counter.get(song["_id"], 0)
        if count < 3 and song["_id"] != recent_song["_id"]:
            recommended.append(song)
            if len(recommended) >= limit:
                break

    # Bước 5: Fallback nếu thiếu
    if len(recommended) < limit:
        remaining = limit - len(recommended)
        print(f"➕ Not enough recommendations, adding {remaining} latest songs")

        # Fallback 1: Bài hát mới nhất theo releaseYear
        latest_songs = list(songs_collection.find()
                            .sort("releaseYear", -1)
                            .limit(remaining))
        recommended += latest_songs

        # Fallback 2: Random nếu vẫn thiếu
        if len(recommended) < limit:
            more_random = list(songs_collection.aggregate([
                {"$sample": {"size": limit - len(recommended)}}
            ]))
            recommended += more_random

    # Log kết quả
    print(f"✅ Final recommendations ({len(recommended)}):")
    for i, s in enumerate(recommended):
        print(f"  #{i+1}: {s['title']} by {s['artist']}")

    return recommended
