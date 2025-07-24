# routes/user_routes.py
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from models.user import UserRegister, UserUpdate
from services.user_service import UserService
from services.song_service import SongService
from database.repositories.song_repository import SongRepository
from database.repositories.artist_repository import ArtistRepository
from auth import create_access_token, get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES
from fastapi import Body
from fastapi import UploadFile, File
from utils.cloudinary_upload import upload_image 
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


router = APIRouter(tags=["user"])

@router.post("/register")
async def register(user: UserRegister):
    try:
        user_id = UserService.create_user(user)
        return {"message": "User created successfully", "user_id": user_id}
    except HTTPException as e:
        raise e

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = UserService.authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    if user.banned:
        raise HTTPException(status_code=403, detail="Account is banned")

    # lấy artist_id nếu có
    artist_id = getattr(user, "artist_id", None)

    access_token = create_access_token(
        data={
            "sub": user.id,
            "role": user.role,
            "artist_id": artist_id
        },
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me")
async def get_current_user_endpoint(current_user: dict = Depends(get_current_user)):
    return current_user

@router.get("/users")
async def get_users(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    users = UserService.get_all_users()
    return users

@router.post("/users/{user_id}/promote")
async def promote_to_admin(user_id: str, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    UserService.promote_to_admin(user_id, current_user["id"])
    return {"message": "User promoted to admin"}

@router.post("/users/{user_id}/demote")
async def demote_from_admin(user_id: str, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    UserService.demote_from_admin(user_id, current_user["id"])
    return {"message": "User demoted to user"}

@router.post("/users/{user_id}/ban")
async def ban_user(user_id: str, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    UserService.ban_user(user_id, current_user["id"])
    return {"message": "User banned"}

@router.post("/users/{user_id}/unban")
async def unban_user(user_id: str, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    UserService.unban_user(user_id)
    return {"message": "User unbanned"}

@router.delete("/users/{user_id}")
async def delete_user(user_id: str, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    UserService.delete_user(user_id)
    return {"message": "User deleted successfully"}

@router.put("/me")
async def update_user_profile(
    user_data: UserUpdate,
    current_user: dict = Depends(get_current_user)
):
    updated_user = UserService.update_user(current_user["id"], user_data)
    return updated_user

@router.get("/admin/search")
async def admin_search(query: str, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    users = UserService.search_users(query)
    return {"users": users}

@router.post("/users/{user_id}/demote-artist")
async def demote_artist_to_user(user_id: str, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    UserService.demote_artist_to_user(user_id)
    return {"message": "Artist demoted to user"}

@router.post("/me/toggle-like/{song_id}")
def toggle_like_song(song_id: str, current_user: dict = Depends(get_current_user)):
    liked_songs = UserService.toggle_like_song(current_user["id"], song_id)
    return {"likedSongs": liked_songs}

@router.get("/me/following")
async def get_followed_artists(current_user: dict = Depends(get_current_user)):
    from services.follow_service import FollowService

    follow_service = FollowService()
    artists = follow_service.get_followed_artists(current_user["id"])  # ✅ Đã sửa "_id" thành "id"

    return {"following": artists}

@router.get("/me/liked-songs")
def get_liked_songs(current_user: dict = Depends(get_current_user)):

    song_service = SongService(SongRepository(), ArtistRepository())
    liked_song_ids = current_user.get("likedSongs", [])

    songs = [song_service.get_song_by_id(song_id) for song_id in liked_song_ids]
    # Lọc bỏ những bài hát None (không còn tồn tại)
    songs = [s for s in songs if s]
    return {"liked": songs}

@router.post("/change-password")
def change_password(
    old_password: str = Body(...),
    new_password: str = Body(...),
    current_user: dict = Depends(get_current_user)
):
    user = UserService.get_user_by_id(current_user["id"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not pwd_context.verify(old_password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect old password")

    hashed_new = pwd_context.hash(new_password)
    UserService.update_password(user.id, hashed_new)
    return {"message": "Password updated successfully"}


@router.patch("/user/update-name")
async def update_user_name(
    name: str = Body(..., embed=True),
    current_user: dict = Depends(get_current_user),
):
    updated_user = UserService.update_user_name(current_user["id"], name)
    return updated_user



from fastapi import UploadFile, File, Depends, HTTPException
import os, tempfile
from utils.cloudinary_upload import upload_image, CLOUDINARY_BASE_URL
from auth import get_current_user
from database.db import db


ALLOWED_EXTENSIONS = [".jpg", ".jpeg"]
MAX_FILE_SIZE_MB = 5

@router.post("/avatar")
async def upload_user_avatar(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Only JPG/JPEG images are allowed.")

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds 5MB.")

    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
        tmp.write(contents)
        temp_path = tmp.name

    try:
        result = upload_image(temp_path)

        public_url = result.get("secure_url")
        if not public_url:
            raise HTTPException(status_code=500, detail="Cloudinary did not return a URL")

        UserService.update_user_with_dict(current_user["id"], {"avatar": public_url})

        return {"avatar": public_url}

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)