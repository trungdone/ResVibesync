from pymongo import MongoClient
from passlib.context import CryptContext
from bson import ObjectId
import os
import datetime

# Lấy URI từ biến môi trường hoặc dùng giá trị mặc định
MONGO_URI = os.getenv(
    "MONGO_URI",
    "mongodb+srv://trungdnbh00901:trudo42@vibesync.gaqe5kb.mongodb.net/?retryWrites=true&w=majority"
)

# Kết nối MongoDB
client = MongoClient(MONGO_URI)
db = client["Vibesync"]

# Các collection trong MongoDB
songs_collection = db.get_collection("songs")
users_collection = db.get_collection("users")
history_collection = db.get_collection("history")
song_history_collection = db.get_collection("song_history")  # alias
recommendations_collection = db.get_collection("recommendations")
playlists_collection = db.get_collection("playlists")
artists_collection = db.get_collection("artists")
albums_collection = db.get_collection("albums")
chat_history_collection = db.get_collection("chat_history")
follows_collection = db.get_collection("follows")
likes_collection = db.get_collection("likes")
artist_requests_collection = db.get_collection("artist_requests")
notifications_collection = db.get_collection("notifications")

# Password hash setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Optional: Cập nhật dữ liệu albums (chỉ nên chạy một lần)
result1 = albums_collection.update_many(
    {"cover_art": ""},
    {"$set": {"cover_art": None}}
)
print(f"✅ Updated {result1.modified_count} documents for empty cover_art")

result2 = albums_collection.update_many(
    {"release_year": {"$lt": 1900}},
    {"$set": {"release_year": 2025}}
)
print(f"✅ Updated {result2.modified_count} documents for invalid release_year")

print("📊 Remaining with empty cover_art:", albums_collection.count_documents({"cover_art": ""}))
print("📊 Remaining with invalid release_year:", albums_collection.count_documents({"release_year": {"$lt": 1900}}))
