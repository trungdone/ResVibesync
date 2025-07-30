import requests

data = {
    "user_id": "6856665201b677ee5d2322bd",
    "song_id": "6860ffe9528f0b2e36248223"
}

res = requests.post("http://localhost:8000/api/history", json=data)
print(res.status_code)
print(res.text)
