from fastapi import APIRouter, HTTPException, Depends
from models.song import SongCreate, SongUpdate, SongInDB
from services.song_service import SongService
from database.repositories.song_repository import SongRepository
from database.repositories.artist_repository import ArtistRepository
from auth import get_current_user
from pydantic import BaseModel
from typing import List
import random
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/songs", tags=["songs"])

class SongsResponse(BaseModel):
    songs: List[SongInDB]
    total: int

def get_song_service():
    return SongService(SongRepository(), ArtistRepository())

# ✅ GET all songs (hỗ trợ filter, sort, pagination)
@router.get("", response_model=SongsResponse)
async def get_songs(
    genre: str = None,
    sort: str = None,
    limit: int = 50,
    page: int = 1,
    service: SongService = Depends(get_song_service)
):
    try:
        logger.info(f"📥 Request received | genre: {genre}, page: {page}, limit: {limit}")

        if genre:
            songs = service.get_songs_by_genre(genre, page, limit)
            logger.info(f"🎯 Found {len(songs)} songs for genre '{genre}'")
            for idx, song in enumerate(songs, 1):
                logger.info(f"{idx:02d}. 🎵 {song.title} | Genres: {song.genre}")
        else:
            songs = service.get_all_songs(sort, limit)
            logger.info(f"📦 Found {len(songs)} songs (no genre filter)")

        return {"songs": songs, "total": len(songs)}
    except ValueError as e:
        logger.error(f"❌ ValueError: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"💥 Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

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
    songs = service.get_all_songs()
    if not songs:
        raise HTTPException(status_code=404, detail="No songs found")
    return random.choice(songs)
