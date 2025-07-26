from database.db import songs_collection
from bson import ObjectId
from bson.errors import InvalidId
from bson.regex import Regex
from typing import List, Optional, Dict
from datetime import datetime
import random

from services.genre_service import get_region_query


class SongRepository:
    PROJECTION = {
        "title": 1,
        "artistId": 1,
        "album": 1,
        "releaseYear": 1,
        "duration": 1,
        "genre": 1,
        "coverArt": 1,
        "audioUrl": 1,
        "lyrics_lrc": 1,
        "created_at": 1,
        "updated_at": 1
    }

    @staticmethod
    def _validate_object_id(song_id: str) -> ObjectId:
        try:
            return ObjectId(song_id)
        except InvalidId:
            raise ValueError(f"Invalid ObjectId: {song_id}")

    @staticmethod
    def find_all(sort: Optional[str] = None, limit: Optional[int] = None, skip: Optional[int] = 0, query: Optional[Dict] = None) -> List[Dict]:
        try:
            cursor = songs_collection.find(query or {}, SongRepository.PROJECTION)
            if sort:
                cursor = cursor.sort(sort, 1)
            if skip is not None:
                cursor = cursor.skip(skip)
            if limit:
                cursor = cursor.limit(limit)
            songs = list(cursor)
            print(f"[find_all] Found {len(songs)} songs with query={query}, sort={sort}, skip={skip}, limit={limit}")
            return songs
        except Exception as e:
            print(f"[find_all] Error: {str(e)}")
            raise ValueError(f"Failed to query songs: {str(e)}")

    @staticmethod
    def find_by_id(song_id: str) -> Optional[Dict]:
        return songs_collection.find_one(
            {"_id": SongRepository._validate_object_id(song_id)},
            SongRepository.PROJECTION
        )

    @staticmethod
    def find_by_artist_id(artist_id: ObjectId) -> List[Dict]:
        try:
            return list(songs_collection.find({
                "$or": [
                    {"artistId": str(artist_id)},
                    {"artistId": artist_id}
                ]
            }, SongRepository.PROJECTION))
        except Exception as e:
            print(f"[find_by_artist_id] Error: {str(e)}")
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
        result = songs_collection.delete_one(
            {"_id": SongRepository._validate_object_id(song_id)}
        )
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
    def find_by_album_id(album_id: str, artist_id: str) -> List[dict]:
        return list(songs_collection.find({
            "album": album_id,
            "$or": [
                {"artistId": artist_id},
                {"artistId": ObjectId(artist_id)}
            ]
        }, SongRepository.PROJECTION))

    @staticmethod
    def search_by_title(keyword: str, limit: int = 20) -> List[Dict]:
        try:
            regex = Regex(keyword, "i")
            cursor = songs_collection.find(
                {"title": {"$regex": regex}},
                SongRepository.PROJECTION
            ).sort("title", 1).limit(limit)
            results = list(cursor)
            print(f"[search_by_title] Found {len(results)} result(s) for '{keyword}'")
            return results
        except Exception as e:
            print(f"[search_by_title] Error: {e}")
            raise ValueError(f"Failed to search songs: {e}")

    @staticmethod
    def find_by_ids(song_ids: List[str]) -> List[Dict]:
        try:
            object_ids = [ObjectId(id) for id in song_ids]
            return list(songs_collection.find(
                {"_id": {"$in": object_ids}},
                SongRepository.PROJECTION
            ))
        except Exception as e:
            print(f"[find_by_ids] Error: {e}")
            raise ValueError("Failed to find songs by IDs")

    @staticmethod
    def get_random_songs(limit: int = 10) -> List[Dict]:
        try:
            pipeline = [
                {"$sample": {"size": limit}},
                {"$project": SongRepository.PROJECTION}
            ]
            return list(songs_collection.aggregate(pipeline))
        except Exception as e:
            print(f"[get_random_songs] Error: {e}")
            raise ValueError(f"Error in get_random_songs: {e}")

    @staticmethod
    def get_random_songs_by_region(region: str, limit: int = 12) -> List[Dict]:
        try:
            pipeline = [
                {"$match": get_region_query(region)},
                {"$sample": {"size": limit}},
                {"$project": SongRepository.PROJECTION}
            ]
            return list(songs_collection.aggregate(pipeline))
        except Exception as e:
            print(f"[get_random_songs_by_region] Error: {e}")
            raise ValueError(f"Error in get_random_songs_by_region: {e}")

    @staticmethod
    def find_by_region(region: str, limit: Optional[int] = None, refresh: bool = False) -> List[Dict]:
        try:
            match = get_region_query(region)
            cursor = songs_collection.find(match, SongRepository.PROJECTION)

            if refresh:
                songs = list(cursor)
                random.shuffle(songs)
                return songs[:limit] if limit else songs

            cursor = cursor.sort("title", 1)
            if limit:
                cursor = cursor.limit(limit)
            return list(cursor)
        except Exception as e:
            print(f"[find_by_region] Error: {e}")
            raise ValueError(f"Failed to find songs by region: {e}")

    @staticmethod
    def find_by_genre(genre: str, page: int = 1, limit: int = 50) -> List[Dict]:
        try:
            genres = [g.strip() for g in genre.split(" and ")] if " and " in genre else [genre]
            query = {"genre": {"$all": genres}} if genres else {}
            print(f"[find_by_genre] Query: {query}")
            cursor = songs_collection.find(query, SongRepository.PROJECTION).skip((page - 1) * limit).limit(limit)
            songs = list(cursor)
            print(f"[find_by_genre] Found {len(songs)} songs for genre '{genre}' (page={page}, limit={limit})")
            return songs
        except Exception as e:
            print(f"[find_by_genre] Error: {str(e)}")
            raise ValueError(f"Failed to query songs by genre: {str(e)}")
