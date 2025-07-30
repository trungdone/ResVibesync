import FeaturedSection from "@/components/featured-section";
import NewReleases from "@/components/home/new-releases";
import RecommendedPlaylists from "@/components/playlist/recommended-playlists"; 
import TopArtists from "@/components/home/top-artists";
import RecommendSection from "@/components/home/recommend-section";
import ListeningHistory from "@/components/home/ListeningHistory";
import ChatBoxLauncher from "@/components/chatbot/ChatBoxLauncher";
import HotAlbums from "@/components/home/hot-albums";
import ArtistFanSection from "@/components/home/ArtistFanSection/ArtistFanSection";
import TopListenStats from "@/components/home/TopListenStats";

export default function Home() {
  return (
    <div className="space-y-8 pb-24">
      <FeaturedSection />
      <RecommendedPlaylists />
      <RecommendSection />
      <NewReleases />
      <TopListenStats />
      <ArtistFanSection/>
      <ChatBoxLauncher />      
      <TopArtists />
      <HotAlbums />
      <ListeningHistory />
    </div>
  )
}
