from fastapi import APIRouter, Depends, HTTPException
from models.artist_request import ArtistRequestCreate, ArtistRequestInDB
from services.artist_request_service import ArtistRequestService
from database.repositories.artist_request_repository import ArtistRequestRepository
from models.user import User 
from auth import get_current_user, get_current_admin
from typing import List
from datetime import datetime
router = APIRouter(prefix="/api/artist_requests", tags=["artist_requests"])

@router.post("", response_model=ArtistRequestInDB)
async def create_artist_request(artist_request: ArtistRequestCreate, user: User = Depends(get_current_user)):
    # check trùng
    existing = ArtistRequestRepository().find_by_user_id(user["id"])

    if existing:
        raise HTTPException(status_code=400, detail="You already sent an artist request")

    request_dict = artist_request.dict()
    request_dict["user_id"] = user["id"]
    request_dict["status"] = "pending"
    request_dict["created_at"] = datetime.utcnow()
    request_dict["updated_at"] = None

    # ép social_links về mảng string
    request_dict["social_links"] = [str(link) for link in request_dict["social_links"]]

    repo = ArtistRequestRepository()
    inserted_id = repo.create(request_dict)

    # sau khi lưu thành công -> tạo notification cho admin
    from services.notification_service import NotificationService
    from models.notification import NotificationCreate

    notif = NotificationCreate(
        user_id="685630a6ee24ec3fa3dd28b8",  # TODO: bạn thay id admin thật
        title="New artist request",
        message=f"{artist_request.name} has sent an artist request",
        type="artist_request"
    )
    await NotificationService.create_notification(notif)

    request_dict["id"] = inserted_id
    return ArtistRequestInDB(**request_dict)

@router.get("", response_model=List[ArtistRequestInDB])
async def get_artist_requests(status: str = None, current_user: dict = Depends(get_current_admin)):
    return ArtistRequestService().get_requests(status)

@router.post("/{request_id}/approve", response_model=dict)
async def approve_artist_request(
    request_id: str,
    body: dict,  # Nhận matched_artist_id từ JSON body
    current_user: dict = Depends(get_current_admin)
):
    matched_artist_id = body.get("matched_artist_id")
    return ArtistRequestService().approve_request(request_id, matched_artist_id)

@router.post("/{request_id}/reject", response_model=dict)
async def reject_artist_request(request_id: str, current_user: dict = Depends(get_current_admin)):
    return ArtistRequestService().reject_request(request_id)

@router.delete("/{request_id}", response_model=dict)
async def delete_artist_request(request_id: str, current_user: dict = Depends(get_current_admin)):
    repo = ArtistRequestRepository()
    success = repo.delete(request_id)
    if not success:
        raise HTTPException(status_code=404, detail="Request not found or failed to delete")
    return {"message": "Artist request deleted"}