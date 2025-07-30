from database.db import songs_collection
from bson import ObjectId
from bson.errors import InvalidId
from bson.regex import Regex
from typing import List, Optional, Dict
from datetime import datetime
import random
import logging

from services.genre_service import get_region_query  # dùng cho filter theo region

# 🔧 Logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
if not logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter('[%(levelname)s] %(asctime)s - %(message)s')
    handler.setFormatter(formatter)
    logger.addHandler(handler)


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

    # -----------------------
    # Generic find
    # -----------------------
    @staticmethod
    def find_all(
        sort: Optional[str] = None,
        limit: Optional[int] = None,
        skip: Optional[int] = 0,
        query: Optional[Dict] = None
    ) -> List[Dict]:
        try:
            cursor = songs_collection.find(query or {}, SongRepository.PROJECTION)
            if sort:
                cursor = cursor.sort(sort, 1)
            if skip is not None:
                cursor = cursor.skip(skip)
            if limit:
                cursor = cursor.limit(limit)
            songs = list(cursor)
            logger.info(f"[find_all] Found {len(songs)} song(s) | query={query} sort={sort} skip={skip} limit={limit}")
            return songs
        except Exception as e:
            logger.error(f"[find_all] Error: {e}")
            raise ValueError(f"Failed to query songs: {e}")

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
            logger.error(f"[find_by_artist_id] Error: {e}")
            raise ValueError(f"Failed to query songs by artist_id: {e}")

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
    def find_by_album_id(album_id: str, artist_id: str) -> List[Dict]:
        """Lấy bài hát theo album + artist (artistId có thể là string hoặc ObjectId)."""
        try:
            return list(songs_collection.find({
                "album": album_id,
                "$or": [
                    {"artistId": artist_id},
                    {"artistId": ObjectId(artist_id)}
                ]
            }, SongRepository.PROJECTION))
        except Exception as e:
            logger.error(f"[find_by_album_id] Error: {e}")
            raise

    # -----------------------
    # Search helpers
    # -----------------------
    @staticmethod
    def search_by_title(keyword: str, limit: int = 20) -> List[Dict]:
        try:
            regex = Regex(keyword, "i")
            cursor = songs_collection.find(
                {"title": {"$regex": regex}},
                SongRepository.PROJECTION
            ).sort("title", 1).limit(limit)
            results = list(cursor)
            logger.info(f"[search_by_title] Found {len(results)} result(s) for '{keyword}'")
            return results
        except Exception as e:
            logger.error(f"[search_by_title] Error: {e}")
            raise ValueError(f"Failed to search songs: {e}")

    @staticmethod
    def find_by_ids(song_ids: List[str]) -> List[Dict]:
        try:
            object_ids = [ObjectId(sid) for sid in song_ids]
            return list(songs_collection.find(
                {"_id": {"$in": object_ids}},
                SongRepository.PROJECTION
            ))
        except Exception as e:
            logger.error(f"[find_by_ids] Error: {e}")
            raise ValueError("Failed to find songs by IDs")

    # -----------------------
    # Genre & Region
    # -----------------------
    @staticmethod
    def find_by_genre(genre: str, page: int = 1, limit: Optional[int] = 50) -> List[Dict]:
        """
        Tìm theo thể loại. Hỗ trợ "A and B" => yêu cầu bài hát chứa cả A lẫn B trong mảng genre.
        - Match không phân biệt hoa/thường.
        - Phân trang nếu có limit; nếu limit=None, trả toàn bộ.
        """
        try:
            if not genre:
                return []

            # Chuẩn bị mảng genres; dùng regex i-case cho từng phần tử
            raw_genres = [g.strip() for g in genre.split(" and ")] if " and " in genre else [genre]
            genres_regex = [{"$regex": f"^{g}$", "$options": "i"} for g in raw_genres if g]

            query = {"genre": {"$all": genres_regex}} if genres_regex else {}
            logger.info(f"[find_by_genre] Query={query} page={page} limit={limit}")

            cursor = songs_collection.find(query, SongRepository.PROJECTION)
            if limit is not None:
                skip = max(page - 1, 0) * limit
                cursor = cursor.skip(skip).limit(limit)

            songs = list(cursor)
            logger.info(f"[find_by_genre] Found {len(songs)} song(s) for '{genre}'")
            return songs
        except Exception as e:
            logger.error(f"[find_by_genre] Error: {e}")
            raise ValueError(f"Failed to query songs by genre: {e}")

    @staticmethod
    def get_random_songs(limit: int = 10) -> List[Dict]:
        try:
            pipeline = [
                {"$sample": {"size": limit}},
                {"$project": SongRepository.PROJECTION}
            ]
            return list(songs_collection.aggregate(pipeline))
        except Exception as e:
            logger.error(f"[get_random_songs] Error: {e}")
            raise ValueError(f"Error in get_random_songs: {e}")

    @staticmethod
    def get_random_songs_by_region(region: Optional[str], limit: int = 12) -> List[Dict]:
        try:
            match_stage = {"$match": get_region_query(region)} if region else {"$match": {}}
            pipeline = [
                match_stage,
                {"$sample": {"size": limit}},
                {"$project": SongRepository.PROJECTION}
            ]
            return list(songs_collection.aggregate(pipeline))
        except Exception as e:
            logger.error(f"[get_random_songs_by_region] Error: {e}")
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
            logger.error(f"[find_by_region] Error: {e}")
            raise ValueError(f"Failed to find songs by region: {e}")
