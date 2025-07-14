import re
import unicodedata
import difflib
from utils.gemini_api import ask_gemini
from services.artist_service import ArtistService
from services.song_service import SongService
from database.repositories.artist_repository import ArtistRepository
from database.repositories.song_repository import SongRepository


# ======== Chuẩn hóa văn bản ==========

def normalize_text(text: str) -> str:
    text = text.lower()
    text = unicodedata.normalize('NFD', text)
    text = re.sub(r'[\u0300-\u036f]', '', text)  # bỏ dấu tiếng Việt
    text = re.sub(r'[^\w\s]', '', text)          # bỏ ký tự đặc biệt
    return text.strip()


# ======== Phát hiện ngôn ngữ ==========

def detect_language(text: str) -> str:
    return "en" if re.search(r'[a-zA-Z]', text) and not re.search(r'[à-ỹÀ-Ỹ]', text) else "vi"


# ======== Khởi tạo service ==========

artist_repo = ArtistRepository()
song_repo = SongRepository()
artist_service = ArtistService()
song_service = SongService(song_repo, artist_repo)


# ======== Lấy dữ liệu từ MongoDB ==========

try:
    ARTISTS_DATA = artist_service.get_all_artists_simple()
except Exception:
    ARTISTS_DATA = []

try:
    SONGS_DATA = song_service.get_all_songs_simple()
except Exception:
    SONGS_DATA = []


# ======== Tạo danh sách tìm kiếm mềm ==========

ARTIST_ENTRIES = [
    {
        "name": artist["name"],
        "aliases": artist.get("aliases", []),
        "url": f"http://localhost:3000/artist/{artist['artist_id']}",
        "keywords": [normalize_text(artist["name"])] + [normalize_text(alias) for alias in artist.get("aliases", [])],
    }
    for artist in ARTISTS_DATA
]

SONG_ENTRIES = [
    {
        "title": song["title"],
        "url": f"http://localhost:3000/song/{song['song_id']}",
        "keywords": [normalize_text(song["title"])],
    }
    for song in SONGS_DATA
]


# ======== Câu hỏi định nghĩa sẵn (FAQ) ==========

CUSTOM_RESPONSES = {
    "creator": {
        "questions": [
            "ai tạo ra trang web này", "ai phát triển trang web này",
            "người làm ra trang web này là ai", "ai làm website này",
            "ai là lập trình viên", "developer là ai", "dev là ai"
        ],
        "answer_vi": "🧑‍💻 Website này được phát triển bởi đội ngũ VibeSync – đam mê âm nhạc và công nghệ.",
        "answer_en": "🧑‍💻 This website was developed by the VibeSync team – passionate about music and technology.",
    },
    "purpose": {
        "questions": [
            "trang web này dùng để làm gì", "mục đích của trang web này là gì",
            "website này dùng để làm gì", "tôi vào trang web này để làm gì",
            "chức năng của trang web", "trang web hoạt động thế nào"
        ],
        "answer_vi": "🎧 VibeSync là nền tảng nghe nhạc thông minh, nơi bạn có thể tìm kiếm, nghe và khám phá playlist theo tâm trạng.",
        "answer_en": "🎧 VibeSync is a smart music platform where you can search, listen, and explore playlists based on your mood.",
    },
    "register": {
        "questions": [
            "làm sao để đăng ký tài khoản", "cách đăng ký tài khoản", "tôi muốn tạo tài khoản",
            "đăng ký như thế nào", "đăng kí như thế nào", "đăng kí thế nào",
            "hướng dẫn đăng ký", "đăng ký ở đâu"
        ],
        "answer_vi": "🔐 Bạn có thể tạo tài khoản bằng cách nhấn vào nút 'Đăng ký' ở góc trên cùng bên phải, sau đó điền thông tin.",
        "answer_en": "🔐 You can create an account by clicking the 'Sign Up' button at the top right and filling in your details.",
    },
    "free_music": {
        "questions": [
            "tôi có thể nghe nhạc miễn phí không", "nghe nhạc có mất phí không",
            "website có miễn phí không", "nghe nhạc free không",
            "nghe nhạc không tốn tiền không", "có trả phí không"
        ],
        "answer_vi": "✅ Hoàn toàn có thể! Tất cả playlist cơ bản đều miễn phí, không cần trả phí.",
        "answer_en": "✅ Yes! All basic playlists are free, no subscription required.",
    },
}


# ========== HÀM XỬ LÝ CHÍNH ==========

async def handle_user_question(prompt: str) -> str:
    norm_prompt = normalize_text(prompt)
    language = detect_language(prompt)

    # === 1. Trả lời nhanh theo câu hỏi định nghĩa
    for group in CUSTOM_RESPONSES.values():
        for question in group["questions"]:
            if normalize_text(question) in norm_prompt:
                return group["answer_vi"] if language == "vi" else group["answer_en"]

    # === 2. Nhắc người dùng nếu câu hỏi không rõ
    MUSIC_KEYWORDS = [normalize_text(w) for w in ["bài hát", "ca sĩ", "nhạc", "nghệ sĩ", "song", "artist", "music"]]
    if len(norm_prompt.split()) <= 5 and not any(word in norm_prompt for word in MUSIC_KEYWORDS):
        if language == "vi":
            return (
                "❗ Câu hỏi của bạn chưa rõ ràng. Vui lòng nói rõ bạn đang tìm *bài hát*, *ca sĩ*, hoặc thể loại nhạc nào 🎵.\n"
                "Ví dụ: *'bài hát Yêu Một Người Có Lẽ'* hoặc *'ca sĩ Sơn Tùng M-TP'*."
            )
        else:
            return (
                "❗ Your question is unclear. Please specify whether you're looking for a *song*, *artist*, or *music genre* 🎵.\n"
                "Example: *'song Love Someone Like You'* or *'artist Taylor Swift'*."
            )

    # === 3. Làm rõ nếu người dùng nhập quá ngắn
    enriched_prompt = prompt
    if len(prompt.split()) == 1 and " " not in prompt and not any(c in prompt for c in "?!"):
        enriched_prompt = f"bài hát {prompt}" if language == "vi" else f"song {prompt}"

    # === 4. Gửi sang Gemini API
    reply = await ask_gemini(enriched_prompt)
    norm_reply = normalize_text(reply)

    # === 5. So khớp gần đúng → tìm kết quả từ local DB
    def get_similarity(a, b):
        if b in a or a in b:
          return 1.0
        return difflib.SequenceMatcher(None, a, b).ratio()

    best_entry = None
    best_score = 0.0

    for entry in ARTIST_ENTRIES + SONG_ENTRIES:
        for keyword in entry["keywords"]:
            score = get_similarity(norm_prompt, keyword)
            if score > best_score:
                best_score = score
                best_entry = entry

    # === 6. Trả kết quả nếu trùng
    if best_entry and best_score >= 0.6:
        name = best_entry.get("name") or best_entry.get("title") or "Xem thêm"
        reply += f"\n\n👉 Bạn có thể xem thêm về: [{name}]({best_entry['url']})"
    else:
        reply += (
            "\n\n❗ Website của chúng tôi chuyên về âm nhạc. "
            "Vui lòng đặt câu hỏi liên quan đến playlist, ca sĩ, thể loại nhạc hoặc bài hát bạn muốn nghe 🎵."
            if language == "vi" else
            "\n\n❗ Our website focuses on music. Please ask questions about playlists, artists, genres, or songs you want to hear 🎵."
        )

    return reply
