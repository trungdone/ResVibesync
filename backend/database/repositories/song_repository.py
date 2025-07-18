from database.db import songs_collection
from bson import ObjectId
from bson.errors import InvalidId
from typing import List, Optional, Dict
from datetime import datetime

class SongRepository:
    @staticmethod
    def _validate_object_id(song_id: str) -> ObjectId:
        try:
            return ObjectId(song_id)
        except InvalidId:
            raise ValueError(f"Invalid ObjectId: {song_id}")

    @staticmethod
    def find_all(sort: Optional[str] = None, limit: Optional[int] = None, skip: Optional[int] = 0, query: Optional[Dict] = None) -> List[Dict]:
        try:
            cursor = songs_collection.find(query or {})
            if sort:
                cursor = cursor.sort(sort, 1)
            if skip is not None:
                cursor = cursor.skip(skip)
            if limit:
                cursor = cursor.limit(limit)
            songs = list(cursor)
            print(f"Found {len(songs)} songs with query={query}, sort={sort}, skip={skip}, limit={limit}")
            return songs
        except Exception as e:
            print(f"Error in find_all: {str(e)}")
            raise ValueError(f"Failed to query songs: {str(e)}")

    @staticmethod
    def find_by_id(song_id: str) -> Optional[Dict]:
        return songs_collection.find_one({"_id": SongRepository._validate_object_id(song_id)})

    @staticmethod
    def find_by_artist_id(artist_id: ObjectId) -> List[Dict]:
        try:
            # Thử tìm với cả chuỗi và ObjectId
            songs = songs_collection.find({
                "$or": [
                    {"artistId": str(artist_id)},
                    {"artistId": artist_id}
                ]
            })
            return list(songs)
        except Exception as e:
            print(f"Error in find_by_artist_id: {str(e)}")
            raise ValueError(f"Failed to query songs by artist_id: {str(e)}")

    @staticmethod
    def insert(song_data: Dict) -> str:
        result = songs_collection.insert_one(song_data)
        return str(result.inserted_id)

    @staticmethod
    def update(song_id: str, update_data: Dict) -> bool:
        update_data["updated_at"] = datetime.utcnow()
        result = songs_collection.update_one(
            {"_id": SongRepository._validate_object_id(song_id)},
            {"$set": update_data}
        )
        return result.matched_count > 0

    @staticmethod
    def delete(song_id: str) -> bool:
        result = songs_collection.delete_one({"_id": SongRepository._validate_object_id(song_id)})
        return result.deleted_count > 0

    @staticmethod
    def delete_by_artist_id(artist_id: ObjectId) -> bool:
        result = songs_collection.delete_many({
            "$or": [
                {"artistId": str(artist_id)},
                {"artistId": artist_id}
            ]
        })
        return result.deleted_count > 0
    

    @staticmethod
    def get_all_songs_simple() -> List[Dict]:
        try:
            # Truy vấn chỉ các trường đơn giản cần cho tìm kiếm
            songs = songs_collection.find({}, {
                "_id": 1,
                "title": 1,
                "artist": 1,
                "artistId": 1,
                "releaseYear": 1
            })
            return list(songs)
        except Exception as e:
            print(f"Error in get_all_songs_simple: {str(e)}")
            return []
