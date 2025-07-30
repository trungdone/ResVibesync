# services/album_service.py
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime
from typing import List, Optional
from fastapi import HTTPException
from models.album import AlbumCreate, AlbumUpdate, AlbumInDB
from database.repositories.album_repository import AlbumRepository
from database.repositories.song_repository import SongRepository
from database.db import artists_collection, songs_collection, albums_collection
from bson import ObjectId

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
            cover_art=None if not album.get("cover_art") and not album.get("cover_image") else (album.get("cover_art") or album.get("cover_image") or None),
            release_year=album.get("release_date", datetime.utcnow()).year if album.get("release_date") else (album.get("release_year", current_year) if album.get("release_year", current_year) >= 1900 else current_year),
            genres=album.get("genres", []),
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
        
    def get_artist_albums_by_name(self, artist_name: str):
        artist = artists_collection.find_one({"name": {"$regex": artist_name, "$options": "i"}})
        if not artist:
            return {"reply": f"Không tìm thấy nghệ sĩ có tên '{artist_name}'."}

        albums = list(albums_collection.find({"artist_id": artist["_id"]}))
        if not albums:
            return {"reply": f"Nghệ sĩ '{artist['name']}' chưa có album nào."}

        album_infos = [
            {
                "title": album["title"],
                "cover": album.get("cover_url", ""),
                "link": f"http://localhost:3000/album/{str(album['_id'])}"
            }
            for album in albums
        ]

        return {
            "reply": f"Các album của nghệ sĩ {artist['name']}:",
            "albums": album_infos
        }