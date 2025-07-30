import sys
import os

# Thêm đường dẫn đến thư mục backend (nơi chứa 'database')
current_dir = os.path.dirname(__file__)
backend_dir = os.path.abspath(os.path.join(current_dir, "../.."))  # tức là D:/.../backend
sys.path.append(backend_dir)

from database.repositories.song_repository import SongRepository

def test_get_love_songs():
    songs = SongRepository.get_top_songs_by_genre_simple("love")
    for song in songs:
        print(f"{song['title']} - {song['artist']}")

if __name__ == "__main__":
    test_get_love_songs()
