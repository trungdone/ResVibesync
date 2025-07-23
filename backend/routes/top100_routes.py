from fastapi import APIRouter, HTTPException, Depends
from typing import List
from datetime import datetime
from bson import ObjectId
from models.song import SongInDB
from database.db import songs_collection
from database.repositories.song_repository import SongRepository

router = APIRouter(
    prefix="/api/top100",
    tags=["Top 100 Charts"],
    responses={404: {"description": "Not found"}}
)

@router.get("/{genre}", response_model=List[SongInDB])
async def get_top100_by_genre(genre: str):
    """
    Lấy danh sách Top 100 bài hát theo thể loại
    
    Parameters:
    - genre: Thể loại nhạc (vpop, nhac-tre, us-uk, edm, bolero)
    
    Returns:
    - Danh sách bài hát sắp xếp theo lượt nghe giảm dần
    """
    try:
        # Validate genre
        valid_genres = ["vpop", "nhac-tre", "us-uk", "edm", "bolero"]
        if genre not in valid_genres:
            raise HTTPException(status_code=400, detail="Thể loại không hợp lệ")
        
        # Query database
        songs = SongRepository.find_all(
            query={"genre": genre},
            sort="playCount",
            limit=100
        )
        
        if not songs:
            raise HTTPException(
                status_code=404,
                detail=f"Không tìm thấy bài hát cho thể loại {genre}"
            )
            
        # Format response
        formatted_songs = []
        for song in songs:
            song["id"] = str(song["_id"])
            formatted_songs.append(SongInDB(**song))
            
        return formatted_songs
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Lỗi server khi lấy danh sách bài hát: {str(e)}"
        )

@router.get("/featured/latest", response_model=List[SongInDB])
async def get_latest_featured_songs(limit: int = 10):
    """
    Lấy danh sách bài hát nổi bật mới nhất
    """
    try:
        songs = SongRepository.find_all(
            sort="created_at",
            limit=limit
        )
        return [SongInDB(**{**song, "id": str(song["_id"])}) for song in songs]
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Lỗi server: {str(e)}"
        )