# backend/utils/cloudinary_upload.py

import os
import cloudinary
import cloudinary.uploader
import cloudinary.api
from dotenv import load_dotenv

# 🔐 Load biến môi trường từ .env
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

# ✅ Cấu hình Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

# ✅ Hàm upload file audio (.mp3) với public_id cố định
def upload_audio(file_path):
    try:
        file_name = os.path.splitext(os.path.basename(file_path))[0]
        result = cloudinary.uploader.upload_large(
            file_path,
            resource_type="raw",
            folder="audios/",
            public_id=file_name,
            overwrite=True
        )
        return result.get("secure_url")
    except Exception as e:
        print("❌ Upload audio failed:", e)
        return None

# ✅ Hàm upload ảnh (jpg, png,...) với public_id cố định
def upload_image(file_path):
    try:
        file_name = os.path.splitext(os.path.basename(file_path))[0]
        result = cloudinary.uploader.upload(
            file_path,
            resource_type="image",
            folder="images/",
            public_id=file_name,
            overwrite=True
        )
        return result.get("secure_url")
    except Exception as e:
        print("❌ Upload image failed:", e)
        return None

# ✅ Hàm xoá tất cả audio đã upload sai định dạng
def delete_audio_files(folder="audios/"):
    try:
        cloudinary.api.delete_resources_by_prefix(
            prefix=folder,
            resource_type="video"  # Xoá file .mp3 bị sai định dạng (video)
        )
        print("🗑️ Deleted all audio files in:", folder)
    except Exception as e:
        print("❌ Error deleting audio files:", e)

# ✅ Hàm xoá toàn bộ ảnh (tuỳ chọn)
def delete_image_files(folder="images/"):
    try:
        cloudinary.api.delete_resources_by_prefix(
            prefix=folder,
            resource_type="image"
        )
        print("🗑️ Deleted all image files in:", folder)
    except Exception as e:
        print("❌ Error deleting image files:", e)


import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv
import cloudinary.uploader

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True,
)

CLOUDINARY_BASE_URL = f"https://res.cloudinary.com/{os.getenv('CLOUDINARY_CLOUD_NAME')}/"

def upload_image(file_path: str) -> dict:
    result = cloudinary.uploader.upload(file_path, folder="avatars")
    return result  # Return full response dict (includes secure_url, public_id, etc.)


