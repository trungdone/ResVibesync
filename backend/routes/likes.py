from fastapi import APIRouter, Depends, HTTPException
from services.like_service import LikeService
from auth import get_current_user

router = APIRouter(prefix="/likes", tags=["likes"])

like_service = LikeService()

@router.get("/is-liked/{song_id}")
async def is_liked(song_id: str, user: dict = Depends(get_current_user)):
    return {"isLiked": like_service.is_liked(user["id"], song_id)}

@router.post("/{song_id}/like")
async def like_song(song_id: str, user: dict = Depends(get_current_user)):
    if like_service.is_liked(user["id"], song_id):
        raise HTTPException(status_code=400, detail="Already liked")
    like_service.like(user["id"], song_id)
    return {"message": "Liked"}

@router.post("/{song_id}/unlike")
async def unlike_song(song_id: str, user: dict = Depends(get_current_user)):
    if not like_service.is_liked(user["id"], song_id):
        raise HTTPException(status_code=400, detail="Not liked")
    like_service.unlike(user["id"], song_id)
    return {"message": "Unliked"}
