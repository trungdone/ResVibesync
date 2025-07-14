from fastapi import APIRouter, HTTPException, Depends
from services.album_service import AlbumService
from database.repositories.song_repository import SongRepository
from models.album import AlbumCreate, AlbumUpdate, AlbumInDB
from models.song import SongInDB 
from bson import ObjectId
from datetime import datetime
from auth import get_current_admin

router = APIRouter(prefix="/albums", tags=["albums"])

@router.get("", response_model=dict)
async def get_albums(limit: int = None, skip: int = 0):
    try:
        albums = AlbumService().get_all_albums(limit=limit, skip=skip)
        return {"albums": albums, "total": len(albums)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/{id}", response_model=AlbumInDB)
async def get_album(id: str):
    print(f"Received request for album ID: {id}")  
    album = AlbumService().get_album_by_id(id)
    if not album:
        raise HTTPException(status_code=404, detail=f"Album with ID {id} not found")
    return album

@router.get("/{id}/songs", response_model=dict)
async def get_album_songs(id: str):
    try:
        print(f"🎧 [API] Fetching songs for album ID: {id}")
        album = AlbumService().get_album_by_id(id)
        if not album:
            raise HTTPException(status_code=404, detail=f"Album with ID {id} not found")

        print(f"✅ [API] Found album: {album.title} with songs: {album.songs}")
        raw_songs = SongRepository().find_by_ids(album.songs)

        # ✅ Chuyển MongoDB doc -> Pydantic chuẩn
        songs = []
        for song in raw_songs:
            song_data = {
                "id": str(song["_id"]),
                "title": song["title"],
                "artist": song["artist"],
                "album": song.get("album"),
                "releaseYear": song["releaseYear"],
                "duration": song["duration"],
                "genre": song["genre"],
                "coverArt": song.get("coverArt"),
                "audioUrl": song.get("audioUrl"),
                "artistId": str(song["artistId"]),
                "created_at": song["created_at"],
                "updated_at": song.get("updated_at"),
            }
            songs.append(SongInDB(**song_data))

        print(f"✅ [API] Returning {len(songs)} songs")
        return {"songs": songs}

    except Exception as e:
        print(f"❌ [API] Error in get_album_songs: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch songs for album: {str(e)}")





