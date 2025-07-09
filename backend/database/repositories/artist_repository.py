# ✅ repositories/artist_repository.py
from database.db import artists_collection
from bson import ObjectId

class ArtistRepository:
    def __init__(self):
        self.collection = artists_collection

    def find_by_id(self, artist_id: ObjectId):
        return self.collection.find_one({"_id": artist_id})

    def find_all(self, skip=0, limit=None):
        cursor = self.collection.find().skip(skip)
        if limit:
            cursor = cursor.limit(limit)
        return list(cursor)

    def insert_one(self, artist_data: dict):
        return self.collection.insert_one(artist_data)

    def update_one(self, artist_id: ObjectId, update_data: dict):
        return self.collection.update_one({"_id": artist_id}, {"$set": update_data})

    def update_fields(self, artist_id: ObjectId, update_data: dict):
        return self.collection.update_one({"_id": artist_id}, update_data)

    def delete_one(self, artist_id: ObjectId):
        return self.collection.delete_one({"_id": artist_id})