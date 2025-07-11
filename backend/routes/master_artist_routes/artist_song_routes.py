# backend/routes/master_artist_routes/artist_song_routes.py

from fastapi import APIRouter, Depends, HTTPException
from models.song import SongCreate, SongUpdate, SongInDB
from services.master_artist_service.artist_song_service import ArtistSongService
from auth import get_current_artist
from typing import List
from pydantic import BaseModel

class SongsResponse(BaseModel):
    songs: List[SongInDB]
    total: int

router = APIRouter(prefix="/artist/songs", tags=["artist_songs"])

@router.get("", response_model=SongsResponse)
async def get_artist_songs(current_artist: dict = Depends(get_current_artist)):
    songs, total = ArtistSongService().get_artist_songs(current_artist["artist_id"])
    return {"songs": songs, "total": total}

@router.post("", response_model=dict)
async def create_song(song_data: SongCreate, current_artist: dict = Depends(get_current_artist)):
    song_id = ArtistSongService().create_song(current_artist["artist_id"], song_data.dict())
    return {"id": song_id, "message": "Song created successfully"}

@router.put("/{song_id}", response_model=dict)
async def update_song(song_id: str, song_data: SongUpdate, current_artist: dict = Depends(get_current_artist)):
    updated = ArtistSongService().update_song(song_id, song_data.dict(), current_artist["artist_id"])
    if not updated:
        raise HTTPException(status_code=404, detail="Song not found or permission denied")
    return {"message": "Song updated successfully"}
