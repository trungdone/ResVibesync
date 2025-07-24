from pydantic import BaseModel, validator
from datetime import datetime
from typing import List, Optional
from bson import ObjectId

class PlaylistBase(BaseModel):
    title: str
    description: Optional[str] = "A new playlist"
    creator: str = "You"
    songIds: Optional[List[str]] = []  # Danh sách ObjectId của bài hát
    coverArt: Optional[str] = "https://via.placeholder.com/640x640.png?text=Playlist+Cover"
    isPublic: Optional[bool] = True
    isShuffle: Optional[bool] = False

    @validator("title")
    def title_must_not_be_empty(cls, v):
        if not v or not v.strip():
            raise ValueError("Title cannot be empty")
        return v

class PlaylistCreate(PlaylistBase):
    pass

class PlaylistUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    songIds: Optional[List[str]] = None
    isPublic: Optional[bool] = None
    coverArt: Optional[str] = None

class PlaylistInDB(PlaylistBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class PlaylistCreate(PlaylistBase):
    pass