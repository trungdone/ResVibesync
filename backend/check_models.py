import os
import httpx
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")
url = f"https://generativelanguage.googleapis.com/v1beta/models?key={API_KEY}"

res = httpx.get(url)
print(res.json())
