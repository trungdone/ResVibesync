import os
import httpx
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")
url = f"https://generativelanguage.googleapis.com/v1beta/models?key={API_KEY}"

try:
    res = httpx.get(url)
    res.raise_for_status()
    data = res.json()
    print("✅ Các model bạn có quyền sử dụng:")
    for model in data.get("models", []):
        print(f"👉 {model.get('name')} - {model.get('displayName', '')}")
except Exception as e:
    print(f"❌ Lỗi khi gọi API: {e}")
