from fastapi import APIRouter, HTTPException, Depends
from fastapi.encoders import jsonable_encoder
from services.artist_service import ArtistService
from services.follow_service import FollowService
from models.artist import ArtistCreate, ArtistUpdate
from auth import get_current_user, get_optional_user

router = APIRouter(prefix="/artists", tags=["artists"])

artist_service = ArtistService()
follow_service = FollowService()

# ✅ GET all artists (kèm isFollowing và followerCount)
@router.get("", response_model=dict)
async def get_artists(limit: int = None, user: dict = Depends(get_optional_user)):
    try:
        artists = artist_service.get_all_artists(limit=limit)
        artist_list = []

        for artist in artists:
            artist_dict = jsonable_encoder(artist)

            # ✅ Bắt lỗi thiếu _id
            artist_id = str(getattr(artist, "_id", None) or artist_dict.get("_id") or artist_dict.get("id"))
            if not artist_id:
                print("⚠️ Artist missing _id:", artist_dict)
                continue  # bỏ qua nếu không có ID

            print("✅ Artist:", artist_dict.get("name", "Unknown"), "| ID:", artist_id)

            artist_dict["id"] = artist_id  # thêm id cho frontend
            artist_dict["isFollowing"] = follow_service.is_following(user["id"], artist_id) if user else False
            artist_dict["followerCount"] = follow_service.count_followers(artist_id)
            artist_list.append(artist_dict)

        return {"artists": artist_list, "total": len(artist_list)}
    except Exception as e:
        print("❌ Error in get_artists:", str(e))
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

# ✅ GET single artist
@router.get("/{id}", response_model=dict)
async def get_artist(id: str, user: dict = Depends(get_optional_user)):
    artist = artist_service.get_artist_by_id(id)
    if not artist:
        raise HTTPException(status_code=404, detail="Artist not found")

    artist_dict = jsonable_encoder(artist)
    artist_dict["id"] = str(getattr(artist, "_id", None) or artist_dict.get("_id") or id)
    artist_dict["isFollowing"] = follow_service.is_following(user["id"], id) if user else False
    artist_dict["followerCount"] = follow_service.count_followers(id)

    return artist_dict

# ✅ CREATE artist
@router.post("", response_model=dict)
async def create_artist(artist_data: ArtistCreate):
    try:
        artist_id = artist_service.create_artist(artist_data)
        return {"id": artist_id, "message": "Artist created successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid artist data: {str(e)}")

# ✅ UPDATE artist
@router.put("/{id}", response_model=dict)
async def update_artist(id: str, artist_data: ArtistUpdate):
    if not artist_service.update_artist(id, artist_data):
        raise HTTPException(status_code=404, detail="Artist not found")
    return {"message": "Artist updated successfully"}

# ✅ DELETE artist
@router.delete("/{id}", response_model=dict)
async def delete_artist(id: str):
    if not artist_service.delete_artist(id):
        raise HTTPException(status_code=404, detail="Artist not found")
    return {"message": "Artist deleted successfully"}

# ✅ FOLLOW artist
@router.post("/{id}/follow", response_model=dict)
async def follow_artist(id: str, user: dict = Depends(get_current_user)):
    if follow_service.is_following(user["id"], id):
        raise HTTPException(status_code=400, detail="Already following")

    follow_service.follow(user["id"], id)
    return {"message": "Followed successfully"}

# ✅ UNFOLLOW artist
@router.post("/{id}/unfollow", response_model=dict)
async def unfollow_artist(id: str, user: dict = Depends(get_current_user)):
    if not follow_service.is_following(user["id"], id):
        raise HTTPException(status_code=400, detail="Not following")

    follow_service.unfollow(user["id"], id)
    return {"message": "Unfollowed successfully"}
