from fastapi import APIRouter, Query
from services.recommendation_service import get_recommendations
from services.chat_recommend_service import get_recommendations_from_chat

router = APIRouter()

@router.get("/recommendations")
def recommend(user_id: str = Query(...), limit: int = 30):
    print(f"📩 [API] GET /recommendations?user_id={user_id}&limit={limit}")

    recs = get_recommendations(user_id, limit)

    if not recs:
        print("⚠️ Không có dữ liệu hành vi ➜ fallback sang hội thoại.")
        recs = get_recommendations_from_chat(user_id, limit)

    print("✅ Số bài gợi ý trả về:", len(recs))
    for idx, song in enumerate(recs):
        print(f"  #{idx+1}: {song.get('title')} by {song.get('artist')}")

    return [{
        "id": str(song["_id"]),
        "title": song.get("title"),
        "artist": song.get("artist"),
        "cover_art": song.get("coverArt"),
    } for song in recs]
