from models.song import SongInDB
from database.repositories.song_repository import SongRepository
from database.repositories.album_repository import AlbumRepository
from bson import ObjectId
from datetime import datetime
from typing import List

class ArtistSongService:
    def __init__(self):
        self.repo = SongRepository()
        self.album_repo = AlbumRepository()

    def get_artist_songs(self, artist_id: str):
        query = {"artistId": str(artist_id)}
        songs = self.repo.find_all(query=query)
        result = [SongInDB(**{**s, "id": str(s["_id"])}) for s in songs]
        return result, len(result)

    def create_song(self, song_data):
        song_dict = song_data.dict()
        song_dict["created_at"] = datetime.utcnow()
        song_dict["updated_at"] = datetime.utcnow()
        inserted_id = self.repo.insert(song_dict)
        new_song = self.repo.find_by_id(inserted_id)
        return SongInDB(**{**new_song, "id": inserted_id})

    def update_song(self, song_id: str, update_data, artist_id: str):
        song = self.repo.find_by_id(song_id)
        if not song or str(song.get("artistId")) != str(artist_id):
            return False
        return self.repo.update(song_id, update_data.dict())

    def delete_song(self, song_id: str, artist_id: str):
        song = self.repo.find_by_id(song_id)
        if not song or str(song.get("artistId")) != str(artist_id):
            return False
        return self.repo.delete(song_id)
    
    def get_songs_by_album(self, album_id: str, artist_id: str) -> List[SongInDB]:
        # ✅ Tìm album từ ID
        album = self.album_repo.find_by_id(album_id)

        if not album or str(album.get("artist_id")) != str(artist_id):
            return []

        # ✅ Lấy danh sách bài hát từ field `songs`
        song_ids = album.get("songs", [])
        if not song_ids:
            return []

        query = {
            "_id": {"$in": [ObjectId(sid) for sid in song_ids]}
        }

        songs = self.repo.find_all(query)

        return [SongInDB(**{**s, "id": str(s["_id"])}) for s in songs]




