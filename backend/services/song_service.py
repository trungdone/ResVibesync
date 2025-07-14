from database.db import artists_collection
from bson import ObjectId
from datetime import datetime
from typing import List, Optional
from models.song import SongCreate, SongUpdate, SongInDB
from database.repositories.song_repository import SongRepository
from database.repositories.artist_repository import ArtistRepository
from urllib.request import urlopen
from urllib.error import HTTPError
from fastapi import HTTPException


class SongService:
    def __init__(self, song_repository: SongRepository, artist_repository: ArtistRepository):
        self.song_repository = song_repository
        self.artist_repository = artist_repository

    @staticmethod
    def _map_to_song_in_db(song: dict) -> SongInDB:
        return SongInDB(
            id=str(song["_id"]),
            title=song.get("title", ""),
            artist=song.get("artist", ""),
            album=song.get("album", ""),
            releaseYear=song.get("releaseYear", 0),
            duration=song.get("duration", 0),
            genre=song.get("genre", []),
            coverArt=song.get("coverArt", ""),
            audioUrl=song.get("audioUrl", ""),
            artistId=str(song.get("artistId", "")),
            created_at=song.get("created_at", datetime.utcnow()),
            updated_at=song.get("updated_at", None)
        )

    @staticmethod
    def _is_url_accessible(url: str) -> bool:
        try:
            with urlopen(url, timeout=5) as response:
                return response.status == 200
        except HTTPError:
            return False

    def get_all_songs(self, sort: Optional[str] = None, limit: Optional[int] = None) -> List[SongInDB]:
        songs = self.song_repository.find_all(sort, limit)
        return [self._map_to_song_in_db(song) for song in songs]

    def get_song_by_id(self, song_id: str) -> Optional[SongInDB]:
        song = self.song_repository.find_by_id(song_id)
        if not song:
            return None
        return self._map_to_song_in_db(song)

    def create_song(self, song_data: SongCreate) -> str:
        # Kiểm tra artistId tồn tại
        if not self.artist_repository.find_by_id(ObjectId(song_data.artistId)):
            raise ValueError(f"Artist with ID {song_data.artistId} does not exist")

        # Kiểm tra URL media
        if song_data.audioUrl and not self._is_url_accessible(song_data.audioUrl):
            raise ValueError("Invalid or inaccessible audio URL")
        if song_data.coverArt and not self._is_url_accessible(song_data.coverArt):
            raise ValueError("Invalid or inaccessible cover art URL")

        new_song = song_data.dict(exclude_unset=True)
        new_song["artistId"] = str(new_song["artistId"])  # Đảm bảo artistId là chuỗi
        new_song["created_at"] = datetime.utcnow()
        new_song["updated_at"] = None
        return str(self.song_repository.insert(new_song))

    def update_song(self, song_id: str, song_data: SongUpdate) -> bool:
        update_data = song_data.dict(exclude_unset=True)
        if "artistId" in update_data:
            if not self.artist_repository.find_by_id(ObjectId(update_data["artistId"])):
                raise ValueError(f"Artist with ID {update_data['artistId']} does not exist")
            update_data["artistId"] = str(update_data["artistId"])  # Đảm bảo artistId là chuỗi
        if "audioUrl" in update_data and update_data["audioUrl"]:
            if not self._is_url_accessible(update_data["audioUrl"]):
                raise ValueError("Invalid or inaccessible audio URL")
        if "coverArt" in update_data and update_data["coverArt"]:
            if not self._is_url_accessible(update_data["coverArt"]):
                raise ValueError("Invalid or inaccessible cover art URL")
        return self.song_repository.update(song_id, update_data)

    def delete_song(self, song_id: str) -> bool:
        return self.song_repository.delete(song_id)
    

    # services/song_service.py
    def get_all_songs_simple(self):
     try:
        songs = self.song_repository.find_all()
        return [
            {
                "title": song.get("title", ""),
                "song_id": str(song["_id"]),
            }
            for song in songs
        ]
     except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi lấy bài hát: {str(e)}")


    
    




