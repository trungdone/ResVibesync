from fastapi import APIRouter, Query
from services.recommendation_service import get_recommendations

router = APIRouter()

@router.get("/recommendations")
def recommend(user_id: str = Query(...), limit: int = 30):
    recs = get_recommendations(user_id, limit)
    return [{
        "id": str(song["_id"]),
        "title": song.get("title"),
        "artist": song.get("artist"),
        "cover_art": song.get("coverArt"),  # ✅ đảm bảo đây là URL hoặc đường dẫn đúng
    } for song in recs]
