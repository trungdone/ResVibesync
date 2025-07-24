from typing import Dict, List
from bson.regex import Regex
from database.db import songs_collection, artists_collection, albums_collection

from bson import ObjectId

class SearchService:
    @staticmethod
    def _convert_id(doc: dict) -> dict:
        """Helper to convert ObjectId to string"""
        doc["_id"] = str(doc["_id"])
        if "artist" in doc and isinstance(doc["artist"], dict) and "_id" in doc["artist"]:
            doc["artist"]["_id"] = str(doc["artist"]["_id"])
        return doc

    @staticmethod
    def search_all(query: str, search_type: str = "all") -> Dict[str, List[dict]]:
        from bson.regex import Regex
        regex = Regex(f"{query}", "i")

        results = {
            "songs": [],
            "artists": [],
            "albums": []
        }

        if search_type in ("all", "song"):
            songs = songs_collection.find({
                "$or": [{"title": regex}, {"artist": regex}]
            }, {
                "_id": 1, "title": 1, "artist": 1, "coverArt": 1, "duration": 1
            })
            results["songs"] = [SearchService._convert_id(song) for song in songs]

        if search_type in ("all", "artist"):
            artists = artists_collection.find({"name": regex}, {
                "_id": 1, "name": 1, "image": 1, "avatar_url": 1,
            })
            results["artists"] = [SearchService._convert_id(artist) for artist in artists]

        if search_type in ("all", "album"):
            albums = albums_collection.find({
                "$or": [{"title": regex}, {"artist.name": regex}]
            }, {
                "_id": 1, "title": 1, "coverArt": 1, "cover_art": 1, "cover_url": 1,
                "artist": 1, "release_year": 1
            })
            results["albums"] = [SearchService._convert_id(album) for album in albums]

        return results