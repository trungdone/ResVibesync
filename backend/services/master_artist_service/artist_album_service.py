from models.album import AlbumCreate, AlbumUpdate, AlbumInDB
from database.repositories.album_repository import AlbumRepository
from database.repositories.song_repository import SongRepository
from models.song import SongInDB
from bson import ObjectId
from typing import List, Tuple, Optional
from datetime import datetime

class ArtistAlbumService:
    def __init__(self):
        self.repo = AlbumRepository()

    def _map_to_album_in_db(self, album: dict) -> AlbumInDB:
        return AlbumInDB(
            id=str(album["_id"]),
            title=album.get("title", ""),
            description=album.get("description", ""),
            artist_id=str(album.get("artistId", "")),  # Đổi artistId thành artist_id
            cover_art=album.get("cover_image") or album.get("cover_art") or None,
            release_year=(
                album.get("release_date", datetime.utcnow()).year
                if album.get("release_date")
                else album.get("releaseYear", datetime.utcnow().year)  # Mặc định là năm hiện tại
            ),
            genres=album.get("genres", []),
            songs=[str(sid) for sid in album.get("songs", [])],
            created_at=album.get("created_at", datetime.utcnow()),
        )

    def get_artist_albums(self, artist_id: str) -> Tuple[List[AlbumInDB], int]:
        try:
            albums = self.repo.find_by_artist_id(ObjectId(artist_id))
            print(f"📀 Found {len(albums)} albums for artist_id: {artist_id}")
            result = [self._map_to_album_in_db(a) for a in albums]
            return result, len(result)
        except Exception as e:
            print(f"❌ Error fetching albums: {e}")
            return [], 0

    def create_album(self, artist_id: str, album_data: AlbumCreate) -> str:
        data = album_data.dict(exclude_unset=True)
        data["artist_id"] = artist_id
        data["created_at"] = datetime.utcnow()
        album_id = self.repo.insert(data)
        return str(album_id)

    def update_album(self, album_id: str, album_data: AlbumUpdate, artist_id: str) -> bool:
        album = self.repo.find_by_id(album_id)
        if not album or str(album["artistId"]) != artist_id:
            return False
        update_data = album_data.dict(exclude_unset=True)
        update_data["updated_at"] = datetime.utcnow()
        return self.repo.update(album_id, update_data)

    def delete_album(self, album_id: str, artist_id: str) -> bool:
        album = self.repo.find_by_id(album_id)
        if not album or str(album["artistId"]) != artist_id:
            return False
        return self.repo.delete(album_id)
    
    def get_songs_by_album(self, album_id: str) -> List[SongInDB]:
        query = {"albumId": ObjectId(album_id)}
        songs = self.repo.find_all(query=query)
        return [SongInDB(**{**s, "id": str(s["_id"])}) for s in songs]
    
