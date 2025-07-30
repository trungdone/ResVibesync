from fastapi import APIRouter, HTTPException, Depends, Query
from models.song import SongCreate, SongUpdate, SongInDB
from services.song_service import SongService
from services.genre_service import get_region_query
from database.repositories.song_repository import SongRepository
from database.repositories.artist_repository import ArtistRepository
from auth import get_current_user
from pydantic import BaseModel
from typing import List, Optional
import random
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/songs", tags=["songs"])

class SongsResponse(BaseModel):
    songs: List[SongInDB]
    total: int

def get_song_service():
    return SongService(SongRepository(), ArtistRepository())

GENRE_MAP = {
    "love": "Love",
    "sad": "Sad",
    "happy": "Happy",
    "rap": "Rap",
    "korean": "Korean",
    "edm": "EDM",
    "pop": "Pop",
    "rock": "Rock",
    "instrumental": "Instrumental",
    "lofi": "Lo-fi",
    "usuk": "UK-US",
}

# ✅ GET all songs (hỗ trợ filter, sort, pagination)
@router.get("", response_model=SongsResponse)
async def get_songs(
    genre: Optional[str] = Query(None),
    region: Optional[str] = Query(None),
    sort: Optional[str] = Query(None),
    limit: Optional[int] = Query(None, gt=0),
    page: int = Query(1, gt=0),
    refresh: bool = Query(False),
    service: SongService = Depends(get_song_service)
):
    """
    - genre: lọc theo thể loại (hỗ trợ "A and B")
    - region: lọc theo khu vực (get_region_query)
    - sort: tuỳ chọn sắp xếp (service xử lý)
    - page/limit: phân trang (cho genre)
    - refresh: True => trả random (ưu tiên theo region nếu có)
    """
    try:
        logger.info(f"[GET /songs] genre={genre}, region={region}, sort={sort}, page={page}, limit={limit}, refresh={refresh}")

        if refresh:
            songs = service.get_random_songs(limit=limit or 12, region=region)
            return {"songs": songs[: (limit or len(songs))], "total": len(songs)}

        if genre:
            songs = service.get_songs_by_genre(genre=genre, page=page, limit=limit or 12)
            return {"songs": songs, "total": len(songs)}

        if region:
            query = get_region_query(region)
            songs = service.get_all_songs(sort=sort, limit=limit, query=query)
            return {"songs": songs[: (limit or len(songs))], "total": len(songs)}

        songs = service.get_all_songs(sort=sort, limit=limit)
        return {"songs": songs[: (limit or len(songs))], "total": len(songs)}

    except ValueError as e:
        logger.error(f"[GET /songs] ValueError: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"[GET /songs] Unexpected: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


# ✅ Lấy top 100 bài hát theo thể loại
# 🔥 Đặt TRƯỚC route động /{id}
@router.get("/top100/{genre}", response_model=List[SongInDB])
async def get_top100_by_genre(genre: str, service: SongService = Depends(get_song_service)):
    try:
        # Dùng luôn service hiện có, không cần thêm method mới
        songs = service.get_songs_by_genre(genre=genre, page=1, limit=100)
        return songs
    except Exception as e:
        logger.error(f"[GET /songs/top100/{genre}] Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Không thể lấy top 100 bài hát: {str(e)}")


# ✅ GET one song by ID
@router.get("/{id}", response_model=SongInDB)
async def get_song(id: str, service: SongService = Depends(get_song_service)):
    song = service.get_song_by_id(id)
    if not song:
        raise HTTPException(status_code=404, detail="Song not found")
    return song


# ✅ CREATE song
@router.post("", dependencies=[Depends(get_current_user)])
async def create_song(song_data: SongCreate, service: SongService = Depends(get_song_service)):
    try:
        song_id = service.create_song(song_data)
        return {"id": song_id, "message": "Song created successfully"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


# ✅ UPDATE song
@router.put("/{id}", dependencies=[Depends(get_current_user)])
async def update_song(id: str, song_data: SongUpdate, service: SongService = Depends(get_song_service)):
    try:
        if not service.update_song(id, song_data):
            raise HTTPException(status_code=404, detail="Song not found")
        return {"message": "Song updated successfully"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# ✅ DELETE song
@router.delete("/{id}", dependencies=[Depends(get_current_user)])
async def delete_song(id: str, service: SongService = Depends(get_song_service)):
    if not service.delete_song(id):
        raise HTTPException(status_code=404, detail="Song not found")
    return {"message": "Song deleted successfully"}


# ✅ GET random song
@router.get("/random", response_model=SongInDB)
async def get_random_song(service: SongService = Depends(get_song_service)):
    songs = service.get_all_songs(limit=50)
    if not songs:
        raise HTTPException(status_code=404, detail="No songs found")
    return random.choice(songs)


# ✅ Random-list theo region (nếu có)
@router.get("/random-list", response_model=SongsResponse)
async def get_random_songs(
    limit: int = 10,
    region: Optional[str] = None,
    service: SongService = Depends(get_song_service)
):
    songs = service.get_random_songs(limit=limit, region=region)
    return {"songs": songs, "total": len(songs)}


# ✅ Reset: trả list mới nhất (sort="newest")
@router.get("/reset", response_model=SongsResponse)
async def get_reset_songs(
    limit: int = 12,
    service: SongService = Depends(get_song_service)
):
    try:
        new_songs = service.get_all_songs(sort="newest", limit=limit)
        return {"songs": new_songs, "total": len(new_songs)}
    except Exception as e:
        logger.error(f"[GET /songs/reset] Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
