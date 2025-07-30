from fastapi import APIRouter, HTTPException
from models.chat import ChatRequest, ChatResponse, ChatMessage, ChatHistory
from database.db import chat_history_collection  # Đã đổi tên collection
from utils.question_handler import handle_user_question
from typing import Optional
from datetime import datetime
import logging

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
    user_message = payload.message.strip()

    logger.info(f"[📨 POST /chat] 🧑‍💻 User ({user_id}) gửi: '{user_message}'")

    if not user_message:
        raise HTTPException(status_code=400, detail="Tin nhắn không được để trống.")

    # 🤖 Gửi câu hỏi tới AI handler
    bot_reply = await handle_user_question(user_message)
    logger.info(f"[🤖 AI Response] Bot trả lời: '{bot_reply}'")

    # 🧾 Chuẩn bị tin nhắn để lưu (thêm timestamp)
    user_msg = {
        "sender": "user", 
        "text": user_message,
        "timestamp": datetime.now()
    }
    bot_msg = {
        "sender": "bot", 
        "text": bot_reply,
        "timestamp": datetime.now()
    }

    # 💾 Lưu vào MongoDB với upsert (tự tạo nếu chưa tồn tại)
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

    # 🔄 Lấy lại toàn bộ lịch sử để trả về
    updated_doc = chat_history_collection.find_one({"user_id": user_id})
    history = [ChatMessage(**msg) for msg in updated_doc.get("messages", [])]
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

    history = [ChatMessage(**msg) for msg in doc.get("messages", [])]
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