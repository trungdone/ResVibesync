from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
import os

# Load biến môi trường
load_dotenv()

# === Import all routes ===
from routes import (
    song_routes,
    user_routes,
    playlist_routes,
    albums_routes,
    artist_routes,
    recomment_routes,
    history_songs_routes,
    notifications_routes,
)

# Optional routes (tồn tại ở nhánh quoc2210)
# Nếu dự án bạn không có các file này, hãy comment các dòng import & include tương ứng.
try:
    from routes import chat_routes
except Exception:
    chat_routes = None

try:
    from routes import top100_routes
except Exception:
    top100_routes = None

# Admin routes
from routes.admin_routes.song_admin_routes import router as admin_song_router
from routes.admin_routes.admin_artist_routes import router as admin_artist_router
from routes.admin_routes.admin_album_routes import router as admin_album_router

# Artist request & management routes
from routes.artist_request_routes import router as artist_request_router
from routes.master_artist_routes.artist_profile_routes import router as artist_profile_router
from routes.master_artist_routes.artist_song_routes import router as artist_song_router
from routes.master_artist_routes.artist_album_routes import router as artist_album_router

# Search
from routes.search_routes import router as search_routes

# Giữ cả hai tính năng từ hai nhánh
try:
    from routes import recommended_routes  # HEAD
except Exception:
    recommended_routes = None

try:
    from routes.likes import router as likes_router  # quoc2210
except Exception:
    likes_router = None


# === Initialize FastAPI ===
app = FastAPI(title="VibeSync API")

# Serve static files (audio)
app.mount("/audio", StaticFiles(directory="audio"), name="audio")

# === CORS configuration ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Register routes ===

# Public APIs
app.include_router(song_routes.router, prefix="/api")
app.include_router(user_routes.router, prefix="/user")
app.include_router(playlist_routes.router, prefix="/api")
app.include_router(albums_routes.router, prefix="/api")
app.include_router(artist_routes.router, prefix="/api")
app.include_router(recomment_routes.router, prefix="/api")
app.include_router(history_songs_routes.router)
app.include_router(notifications_routes.router)
app.include_router(search_routes, prefix="/api")  # lưu ý: search_routes là router object, không .router

# Optional modules (chỉ include nếu import được)
if chat_routes:
    app.include_router(chat_routes.router)
if top100_routes:
    app.include_router(top100_routes.router, prefix="/api")
if recommended_routes:
    app.include_router(recommended_routes.router, prefix="/api")
if likes_router:
    app.include_router(likes_router, prefix="/api")

# Admin APIs
app.include_router(admin_song_router, prefix="/api")
app.include_router(admin_artist_router, prefix="/api")
app.include_router(admin_album_router, prefix="/api")

# Artist management APIs
app.include_router(artist_request_router)
app.include_router(artist_profile_router, prefix="/api")
app.include_router(artist_song_router, prefix="/api")
app.include_router(artist_album_router, prefix="/api")

# === Root endpoint ===
@app.get("/")
def root():
    return {"message": "🎵 VibeSync API is running on FastAPI!"}
