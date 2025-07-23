from fastapi import APIRouter, HTTPException, Depends
from services.song_service import SongService
from database.repositories.song_repository import SongRepository
from database.repositories.artist_repository import ArtistRepository
from typing import List, Dict

router = APIRouter(prefix="/recommendeds", tags=["recommended"])

def get_song_service():
    return SongService(SongRepository(), ArtistRepository())

@router.get("")
async def get_recommended_songs(service: SongService = Depends(get_song_service)) -> List[Dict]:
    """
    Trả về danh sách bài hát gợi ý (ở đây lấy ngẫu nhiên 10 bài)
    Dữ liệu trả về gồm title, artist, image (coverArt)
    """
    try:
        songs = service.get_random_songs(limit=10)
        result = []
        for song in songs:
            result.append({
                "title": song.title,
                "artist": song.artist,
                "image": song.coverArt or "/default-song.jpg"  # ảnh mặc định nếu trống
            })
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
