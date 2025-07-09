# db.py - MongoDB connection
from pymongo import MongoClient
from passlib.context import CryptContext
from bson import ObjectId
import os

# Lấy URI từ biến môi trường hoặc dùng giá trị mặc định
MONGO_URI = os.getenv(
    "MONGO_URI",
    "mongodb+srv://trungdnbh00901:trudo42@vibesync.gaqe5kb.mongodb.net/?retryWrites=true&w=majority"
)

# Kết nối MongoDB
client = MongoClient(MONGO_URI)
db = client["Vibesync"]

# Các collection trong MongoDB
songs_collection = db["songs"]
users_collection = db["users"]
history_collection = db["history"]
song_history_collection = db["song_history"]  # alias
recommendations_collection = db["recommendations"]
playlists_collection = db["playlists"]
artists_collection = db["artists"]
albums_collection = db["albums"]
chat_history_collection = db["chat_history"]
follows_collection = db["follows"]
likes_collection = db["likes"]


# Password hash setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
