from fastapi import APIRouter, HTTPException, Depends
<<<<<<< HEAD
from services.artist_service import ArtistService
from models.artist import ArtistCreate, ArtistUpdate, ArtistInDB
from auth import get_current_admin

router = APIRouter(prefix="/artists", tags=["artists"])

# Khởi tạo instance của ArtistService
artist_service = ArtistService()

@router.get("", response_model=dict)
async def get_artists(skip: int = 0, limit: int = 10, include_songs_albums: bool = False):
    try:
        artists = artist_service.get_all_artists(skip=skip, limit=limit, include_songs_albums=include_songs_albums)
        return {"artists": artists, "total": len(artists), "skip": skip, "limit": limit}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Không thể lấy danh sách nghệ sĩ: {str(e)}")

@router.get("/{id}", response_model=ArtistInDB)
async def get_artist(id: str):
    artist = artist_service.get_artist_by_id(id)
    if not artist:
        raise HTTPException(status_code=404, detail="Nghệ sĩ không tìm thấy")
    return artist

@router.post("", dependencies=[Depends(get_current_admin)])
async def create_artist(artist_data: ArtistCreate):
    try:
        artist_id = artist_service.create_artist(artist_data)
        return {"id": artist_id, "message": "Tạo nghệ sĩ thành công"}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Không thể tạo nghệ sĩ: {str(e)}")

@router.put("/{id}", dependencies=[Depends(get_current_admin)])
async def update_artist(id: str, artist_data: ArtistUpdate):
    try:
        if not artist_service.update_artist(id, artist_data):
            raise HTTPException(status_code=404, detail="Nghệ sĩ không tìm thấy")
        return {"message": "Cập nhật nghệ sĩ thành công"}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Không thể cập nhật nghệ sĩ: {str(e)}")

@router.delete("/{id}", dependencies=[Depends(get_current_admin)])
async def delete_artist(id: str):
    try:
        if not artist_service.delete_artist(id):
            raise HTTPException(status_code=404, detail="Nghệ sĩ không tìm thấy")
        return {"message": "Xóa nghệ sĩ thành công"}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Không thể xóa nghệ sĩ: {str(e)}")
=======
from services.admin_service.admin_artist_service import AdminArtistService
from database.repositories.artist_repository import ArtistRepository
from models.artist import ArtistCreate, ArtistUpdate, ArtistInDB
from auth import get_current_admin

router = APIRouter(prefix="/admin/artists", tags=["admin_artists"])

service = AdminArtistService(ArtistRepository())

@router.get("", response_model=dict)
async def get_artists(skip: int = 0, limit: int = 20):
    artists = service.get_all_artists()
    return {"artists": artists, "total": len(artists)}

@router.get("/search", response_model=dict)
async def search_artists(name: str, skip: int = 0, limit: int = 20, dependencies=[Depends(get_current_admin)]):
    artists = service.search_artists(name)
    return {"artists": artists, "total": len(artists)}

@router.get("/{artist_id}", response_model=ArtistInDB)  # Thêm endpoint
async def get_artist_by_id(artist_id: str):
    artist = service.get_artist_by_id(artist_id)
    if not artist:
        raise HTTPException(status_code=404, detail="Artist not found")
    return artist

@router.post("", dependencies=[Depends(get_current_admin)], response_model=dict)
async def create_artist(artist: ArtistCreate):
    try:
        artist_id = service.create_artist(artist)
        return {"id": artist_id, "message": "Artist created successfully"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{artist_id}", dependencies=[Depends(get_current_admin)], response_model=dict)
async def update_artist(artist_id: str, artist: ArtistUpdate):
    updated = service.update_artist(artist_id, artist)
    if not updated:
        raise HTTPException(status_code=404, detail="Artist not found")
    return {"message": "Artist updated successfully"}

@router.delete("/{artist_id}", dependencies=[Depends(get_current_admin)], response_model=dict)
async def delete_artist(artist_id: str):
    deleted = service.delete_artist(artist_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Artist not found")
    return {"message": "Artist deleted successfully"}
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
