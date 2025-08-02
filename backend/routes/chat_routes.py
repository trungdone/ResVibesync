from fastapi import APIRouter, HTTPException
from models.chat import ChatRequest, ChatResponse, ChatMessage, ChatHistory
from database.db import chat_history_collection
from utils.question_handler import handle_user_question

from database.repositories.artist_repository import ArtistRepository
from database.repositories.song_repository import SongRepository
from database.repositories.album_repository import AlbumRepository
from database.db import albums_collection
from typing import Optional
from datetime import datetime
import logging
from pydantic import ValidationError

# ✅ Logger cấu hình
logger = logging.getLogger("chat_logger")
logging.basicConfig(level=logging.INFO)

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat_with_bot(payload: ChatRequest):
    """
    📩 Gửi tin nhắn đến AI và lưu lịch sử chat cho user_id.
    """
    user_id = payload.user_id
    user_message = (payload.message or "").strip()

    # Khởi tạo repository và resolver
    artist_repo = ArtistRepository()
    song_repo = SongRepository()
    album_repo = AlbumRepository(albums_collection)
    

    logger.info(f"[📨 POST /chat] 🧑‍💻 User ({user_id}) gửi: '{user_message}'")

    if not user_message:
        raise HTTPException(status_code=400, detail="Tin nhắn không được để trống.")
    
    # ⚡ Phân tích truy vấn
    try:
        resolved = resolver.resolve_entity(user_message)
    except Exception as e:
        logger.error(f"[❌ Resolver Error] {str(e)}")
        resolved = {"type": "unknown", "data": None}

    bot_reply: str

    if resolved["type"] == "artist":
        artist_list = resolved["data"]
        if isinstance(artist_list, list) and artist_list:
            artist = artist_list[0]
            bot_reply = f"🎤 Nghệ sĩ **{artist['name']}**.\n\n📚 Tiểu sử: {artist.get('bio', 'Không có mô tả.')}"
        else:
            bot_reply = "Không tìm thấy thông tin nghệ sĩ."
    elif resolved["type"] == "song":
        song = resolved["data"]
        if song:
            genres = ", ".join(song.get("genre", []))
            bot_reply = (
                f"🎶 Bài hát: **{song['title']}**\n"
                f"🎤 Ca sĩ: {song['artist']}\n"
                f"💿 Album: {song.get('album', 'Không rõ')}\n"
                f"📅 Năm: {song.get('releaseYear', 'N/A')}\n"
                f"🎧 Thể loại: {genres}"
            )
        else:
            bot_reply = "Không tìm thấy thông tin bài hát."
    else:
        # 🤖 Gửi câu hỏi tới AI handler nếu không phải nghệ sĩ hoặc bài hát
        try:
            bot_reply = await handle_user_question(user_message)
            if not bot_reply:
                bot_reply = "Xin lỗi, tôi chưa hiểu bạn hỏi gì. Bạn có thể hỏi lại rõ hơn không?"
        except Exception as e:
            logger.error(f"[❌ AI Handler Error] {str(e)}")
            bot_reply = "Hiện tại tôi không thể xử lý yêu cầu. Vui lòng thử lại sau."

    logger.info(f"[🤖 AI Response] Bot trả lời: '{bot_reply}'")

    # 🧾 Chuẩn bị tin nhắn để lưu
    now = datetime.utcnow()
    user_msg = {
        "sender": "user",
        "text": user_message or "Không có nội dung",
        "timestamp": now,
    }
    bot_msg = {
        "sender": "bot",
        "text": bot_reply or "Không có phản hồi",
        "timestamp": now,
    }

    # 💾 Lưu lịch sử
    try:
        chat_history_collection.update_one(
            {"user_id": user_id},
            {"$push": {"messages": {"$each": [user_msg, bot_msg]}}},
            upsert=True
        )
        logger.info(f"[💾 DB Update] Đã lưu 2 tin nhắn vào user_id: {user_id}")
    except Exception as e:
        logger.error(f"[❌ DB Error] Lỗi khi lưu chat: {str(e)}")
        raise HTTPException(status_code=500, detail="Lỗi server khi lưu tin nhắn")

    # 🔄 Trả lại toàn bộ lịch sử
    updated_doc = chat_history_collection.find_one({"user_id": user_id})
    messages_raw = updated_doc.get("messages", [])
    history = []
    for msg in messages_raw:
        try:
            if msg.get("text") is not None:
                history.append(ChatMessage(**msg))
        except ValidationError as ve:
            logger.warning(f"[⚠️ Skip] Tin nhắn không hợp lệ bị bỏ qua: {ve}")

    logger.info(f"[📚 History Return] Trả về {len(history)} tin nhắn lịch sử cho user: {user_id}")

    return ChatResponse(response=bot_reply, history=history)


@router.get("/chat/history/{user_id}", response_model=ChatHistory)
async def get_chat_history(user_id: str):
    """
    📥 Lấy toàn bộ lịch sử chat theo user_id.
    """
    logger.info(f"[📥 GET /chat/history] Truy vấn lịch sử của user_id: {user_id}")

    doc = chat_history_collection.find_one({"user_id": user_id})
    if not doc:
        logger.warning(f"[⚠️ NOT FOUND] Không tìm thấy lịch sử user: {user_id}")
        return {"user_id": user_id, "history": []}


#mới
    messages_raw = doc.get("messages", [])
    history = []
    for msg in messages_raw:
        try:
            if msg.get("text") is not None:
                history.append(ChatMessage(**msg))
        except ValidationError as ve:
            logger.warning(f"[⚠️ Skip] Tin nhắn không hợp lệ bị bỏ qua: {ve}")

    logger.info(f"[✅ History Found] Lấy được {len(history)} tin nhắn từ user_id: {user_id}")

    return {"user_id": user_id, "history": history}


@router.delete("/chat/history/{user_id}")
async def delete_chat_history(user_id: str):
    """
    🗑️ Xoá toàn bộ lịch sử chat của user_id.
    """
    logger.info(f"[🗑️ DELETE /chat/history] Đang xoá lịch sử user_id: {user_id}")

    try:
        result = chat_history_collection.delete_one({"user_id": user_id})
        if result.deleted_count == 0:
            logger.warning(f"[⚠️ Delete Failed] Không tìm thấy lịch sử để xoá user_id: {user_id}")
            raise HTTPException(status_code=404, detail="Không tìm thấy lịch sử để xoá.")

        logger.info(f"[✅ Delete Success] Đã xoá lịch sử chat của user_id: {user_id}")
        return {"message": f"🗑️ Đã xoá lịch sử chat của user {user_id}"}
    except Exception as e:
        logger.error(f"[❌ Delete Error] Lỗi khi xoá lịch sử: {str(e)}")
        raise HTTPException(status_code=500, detail="Lỗi server khi xoá lịch sử")
