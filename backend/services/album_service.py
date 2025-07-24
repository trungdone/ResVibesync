from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime
from typing import List, Optional
from fastapi import HTTPException
from models.album import AlbumCreate, AlbumUpdate, AlbumInDB
from database.repositories.album_repository import AlbumRepository
from database.repositories.song_repository import SongRepository


class AlbumService:
    def __init__(self):
        self.album_repo = AlbumRepository()
        self.song_repo = SongRepository()

    def _build_album_in_db(self, album: dict) -> AlbumInDB:
        current_year = datetime.utcnow().year
        return AlbumInDB(
            id=str(album["_id"]),
            title=album.get("title", ""),
            artist_id=str(album.get("artist_id", "")),
            cover_art=album.get("cover_art") or album.get("cover_image") or "",
            release_year=(
                album.get("release_year", 0)
                if album.get("release_year")
                else album.get("release_date", datetime.utcnow()).year
            ),
            genres=album.get("genres", []) or [album.get("genre", "")],
            songs=album.get("songs", []),
            created_at=album.get("created_at", datetime.utcnow()),
            updated_at=album.get("updated_at", datetime.utcnow())
        )

    def get_all_albums(self, limit: Optional[int] = None, skip: int = 0) -> List[AlbumInDB]:
        try:
            albums = self.album_repo.find_all(limit=limit, skip=skip)
            return [self._build_album_in_db(album) for album in albums]
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Không thể lấy danh sách album: {str(e)}")

    def get_album_by_id(self, album_id: str) -> Optional[AlbumInDB]:
        try:
            print(f"Searching for album with ID: {album_id}")
            album = self.album_repo.find_by_id(album_id)
            if not album:
                return None
            return self._build_album_in_db(album)
        except InvalidId:
            raise HTTPException(status_code=400, detail="ID album không hợp lệ")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Không thể lấy thông tin album: {str(e)}")

    def create_album(self, album_data: AlbumCreate) -> str:
        try:
            new_album = album_data.dict(exclude_unset=True)
            new_album["created_at"] = datetime.utcnow()
            new_album["updated_at"] = datetime.utcnow()
            result = self.album_repo.insert(new_album)
            return str(result.inserted_id)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Không thể tạo album: {str(e)}")

    def update_album(self, album_id: str, album_data: AlbumUpdate) -> bool:
        try:
            update_data = album_data.dict(exclude_unset=True)
            if not update_data:
                raise ValueError("Không có dữ liệu cập nhật được cung cấp")
            update_data["updated_at"] = datetime.utcnow()
            result = self.album_repo.update(album_id, update_data)
            return result
        except InvalidId:
            raise HTTPException(status_code=400, detail="ID album không hợp lệ")
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Không thể cập nhật album: {str(e)}")

    def delete_album(self, album_id: str) -> bool:
        try:
            result = self.album_repo.delete(album_id)
            return result
        except InvalidId:
            raise HTTPException(status_code=400, detail="ID album không hợp lệ")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Không thể xóa album: {str(e)}")
