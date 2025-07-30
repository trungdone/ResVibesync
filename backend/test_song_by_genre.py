from repositories.song_repository import SongRepository

def test_get_love_songs():
    songs = SongRepository.get_top_songs_by_genre_simple("love")
    for song in songs:
        print(f"{song['title']} - {song['artist']}")

if __name__ == "__main__":
    test_get_love_songs()
