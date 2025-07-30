from pydantic import BaseModel, validator, HttpUrl
from datetime import datetime
from typing import Optional, List
from bson import ObjectId


class SongBase(BaseModel):
    title: str
    artist: str
    album: Optional[str] = None
    releaseYear: int
    duration: int  # in seconds
    genre: List[str]
    coverArt: Optional[HttpUrl] = None
    audioUrl: Optional[HttpUrl] = None
    lyrics_lrc: Optional[str] = None  # ✅ giữ lyrics_lrc
    artistId: str

    @validator("releaseYear")
    def validate_release_year(cls, v):
        current_year = datetime.now().year
        if v < 1900 or v > current_year + 1:
            raise ValueError("Invalid release year")
        return v

    @validator("duration")
    def validate_duration(cls, v):
        if v <= 0:
            raise ValueError("Duration must be positive")
        return v


class SongCreate(SongBase):
    """Dùng khi tạo bài hát mới"""
    pass


class SongUpdate(BaseModel):
    """Dùng khi update bài hát"""
    title: Optional[str] = None
    artist: Optional[str] = None
    album: Optional[str] = None
    releaseYear: Optional[int] = None
    duration: Optional[int] = None
    genre: Optional[List[str]] = None
    coverArt: Optional[HttpUrl] = None
    audioUrl: Optional[HttpUrl] = None
    lyrics_lrc: Optional[str] = None
    artistId: Optional[str] = None


class SongInDB(SongBase):
    """Model trả về khi đọc từ DB"""
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    lyrics_lrc: Optional[str] = None  # ✅ giữ lyrics_lrc cho SongInDB

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        fields = {"id": "_id"}  # Map MongoDB _id -> id
