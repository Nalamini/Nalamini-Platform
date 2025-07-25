import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Eye, Clock } from "lucide-react";
import bannerImage from "@assets/banner_1749951384861.png";
import { apiRequest } from "@/lib/queryClient";
import { trackYouTubeVideo } from "@/lib/video-analytics";

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  duration: string;
  viewCount: number;
  language?: 'tamil' | 'english';
}

interface Playlist {
  tamil: YouTubeVideo[];
  english: YouTubeVideo[];
}



export default function LandingPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  // YouTube playlists state
  const [availablePlaylists, setAvailablePlaylists] = useState<any[]>([]);
  const [tamilPlaylistId, setTamilPlaylistId] = useState<string>("");
  const [englishPlaylistId, setEnglishPlaylistId] = useState<string>("");
  
  const [playlists, setPlaylists] = useState<Playlist>({ tamil: [], english: [] });
  const [channelInfo, setChannelInfo] = useState<{channelId: string; channelUrl: string} | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVideoId, setSelectedVideoId] = useState<string>("");
  const [currentLanguage, setCurrentLanguage] = useState<'tamil' | 'english'>('tamil');
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);
  const [sequentialPlaylist, setSequentialPlaylist] = useState<YouTubeVideo[]>([]);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [playerReady, setPlayerReady] = useState<boolean>(false);

  // Create sequential playlist alternating between Tamil and English
  const createSequentialPlaylist = (tamilVideos: YouTubeVideo[], englishVideos: YouTubeVideo[]) => {
    const maxLength = Math.max(tamilVideos.length, englishVideos.length);
    const sequential: YouTubeVideo[] = [];
    
    for (let i = 0; i < maxLength; i++) {
      if (i < tamilVideos.length) {
        sequential.push({ ...tamilVideos[i], language: 'tamil' });
      }
      if (i < englishVideos.length) {
        sequential.push({ ...englishVideos[i], language: 'english' });
      }
    }
    
    return sequential;
  };

  // Fetch available playlists from YouTube
  const fetchYouTubePlaylists = async () => {
    try {
      const response = await apiRequest('GET', '/api/youtube/playlists');
      if (response.ok) {
        const playlistData = await response.json();
        setAvailablePlaylists(playlistData);
        
        // Auto-detect Tamil and English playlists based on title
        const tamilPlaylist = playlistData.find((p: any) => 
          p.title.toLowerCase().includes('tamil') || 
          p.title.toLowerCase().includes('தமிழ்') ||
          p.title.includes('நளமிணி') ||
          p.title.toLowerCase().includes('உங்கள் பார்வைக்கு')
        );
        const englishPlaylist = playlistData.find((p: any) => 
          p.title.toLowerCase().includes('english') || 
          p.title.toLowerCase().includes('eng') ||
          p.title.toLowerCase().includes('introduction') ||
          p.title.toLowerCase().includes('nalamini introduction')
        );
        
        if (tamilPlaylist) setTamilPlaylistId(tamilPlaylist.id);
        if (englishPlaylist) setEnglishPlaylistId(englishPlaylist.id);
        
        console.log('Available playlists:', playlistData);
        console.log('Tamil playlist:', tamilPlaylist);
        console.log('English playlist:', englishPlaylist);
      }
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  // Fetch videos from specific playlists
  const fetchPlaylistVideos = async (playlistId: string): Promise<YouTubeVideo[]> => {
    try {
      const response = await apiRequest('GET', `/api/youtube/playlist/${playlistId}/videos`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error(`Error fetching videos for playlist ${playlistId}:`, error);
    }
    return [];
  };

  // Load both Tamil and English playlist videos
  const loadPlaylistVideos = async () => {
    if (!tamilPlaylistId && !englishPlaylistId) return;
    
    const [tamilVideos, englishVideos] = await Promise.all([
      tamilPlaylistId ? fetchPlaylistVideos(tamilPlaylistId) : Promise.resolve([]),
      englishPlaylistId ? fetchPlaylistVideos(englishPlaylistId) : Promise.resolve([])
    ]);
    
    // Add language property to videos
    const tamilWithLang: YouTubeVideo[] = tamilVideos.map(v => ({ ...v, language: 'tamil' as const }));
    const englishWithLang: YouTubeVideo[] = englishVideos.map(v => ({ ...v, language: 'english' as const }));
    
    setPlaylists({ tamil: tamilWithLang, english: englishWithLang });
    
    // Create sequential playlist
    const sequential = createSequentialPlaylist(tamilWithLang, englishWithLang);
    setSequentialPlaylist(sequential);
    
    console.log('Tamil videos:', tamilWithLang.length);
    console.log('English videos:', englishWithLang.length);
    console.log('Sequential playlist:', sequential.length);
  };

  // Fetch YouTube playlists and channel info
  useEffect(() => {
    const fetchYouTubeData = async () => {
      try {
        console.log('Starting YouTube data fetch...');
        
        // First fetch available playlists
        await fetchYouTubePlaylists();
        
        // Fetch channel info
        const channelResponse = await apiRequest("GET", "/api/youtube/channel-info");
        const channel = await channelResponse.json();
        setChannelInfo(channel);
        
        console.log('YouTube data fetch completed');
      } catch (error) {
        console.error("Error fetching YouTube data:", error);
      } finally {
        // Always set loading to false after 2 seconds max
        setTimeout(() => setLoading(false), 2000);
      }
    };

    fetchYouTubeData();
    
    // Fallback to ensure loading stops after 3 seconds
    const fallbackTimer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(fallbackTimer);
  }, []);

  // Load playlist videos when playlist IDs are available
  useEffect(() => {
    if (tamilPlaylistId || englishPlaylistId) {
      loadPlaylistVideos();
    }
  }, [tamilPlaylistId, englishPlaylistId]);

  // Set first video when sequential playlist is ready
  useEffect(() => {
    if (sequentialPlaylist.length > 0 && !selectedVideoId) {
      setSelectedVideoId(sequentialPlaylist[0].id);
      setCurrentLanguage(sequentialPlaylist[0].language || 'tamil');
    }
  }, [sequentialPlaylist, selectedVideoId]);

  // Auto-advance to next video in sequence
  useEffect(() => {
    if (!isAutoPlaying || !playerReady) return;

    const handleVideoEnd = () => {
      const nextIndex = (currentVideoIndex + 1) % sequentialPlaylist.length;
      const nextVideo = sequentialPlaylist[nextIndex];
      
      if (nextVideo) {
        setCurrentVideoIndex(nextIndex);
        setSelectedVideoId(nextVideo.id);
        setCurrentLanguage(nextVideo.language || 'tamil');
        
        // Load next video after a brief delay
        setTimeout(() => {
          const iframe = document.querySelector('iframe[data-session-id]') as HTMLIFrameElement;
          if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage(
              `{"event":"command","func":"loadVideoById","args":["${nextVideo.id}"]}`,
              '*'
            );
          }
        }, 1000);
      }
    };

    // Set up message listener for YouTube player events
    const messageListener = (event: MessageEvent) => {
      if (event.origin !== 'https://www.youtube.com') return;
      
      try {
        const data = JSON.parse(event.data);
        if (data.event === 'video-ended' || data.info === 0) {
          handleVideoEnd();
        }
      } catch (e) {
        // Ignore parsing errors
      }
    };

    window.addEventListener('message', messageListener);
    return () => window.removeEventListener('message', messageListener);
  }, [isAutoPlaying, playerReady, currentVideoIndex, sequentialPlaylist]);

  // Manual navigation functions
  const playNextVideo = () => {
    const nextIndex = (currentVideoIndex + 1) % sequentialPlaylist.length;
    const nextVideo = sequentialPlaylist[nextIndex];
    
    if (nextVideo) {
      setCurrentVideoIndex(nextIndex);
      setSelectedVideoId(nextVideo.id);
      setCurrentLanguage(nextVideo.language || 'tamil');
    }
  };

  const playPreviousVideo = () => {
    const prevIndex = currentVideoIndex > 0 ? currentVideoIndex - 1 : sequentialPlaylist.length - 1;
    const prevVideo = sequentialPlaylist[prevIndex];
    
    if (prevVideo) {
      setCurrentVideoIndex(prevIndex);
      setSelectedVideoId(prevVideo.id);
      setCurrentLanguage(prevVideo.language || 'english');
    }
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  // Switch between language playlists
  const switchToLanguage = (language: 'tamil' | 'english') => {
    const targetPlaylist = playlists[language];
    if (targetPlaylist.length > 0) {
      const firstVideo = targetPlaylist[0];
      setSelectedVideoId(firstVideo.id);
      setCurrentLanguage(language);
      
      // Find index in sequential playlist
      const sequentialIndex = sequentialPlaylist.findIndex(v => v.id === firstVideo.id);
      if (sequentialIndex !== -1) {
        setCurrentVideoIndex(sequentialIndex);
      }
    }
  };

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      if (user.userType === "service_provider") {
        navigate("/provider-dashboard");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Simple Navigation Bar for Landing Page */}
      <nav className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-primary">Nalamini</h1>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-gray-600 hover:text-primary transition-colors">About Us</a>
              <a href="#contact" className="text-gray-600 hover:text-primary transition-colors">Contact Us</a>
              <Button 
                variant="outline" 
                onClick={() => navigate("/auth")}
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => navigate("/auth")}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Get Started
              </Button>
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  const mobileMenu = document.getElementById('mobile-menu');
                  if (mobileMenu) {
                    mobileMenu.classList.toggle('hidden');
                  }
                }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </div>
          </div>
          
          {/* Mobile menu */}
          <div id="mobile-menu" className="hidden md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              <a href="#about" className="text-gray-600 hover:text-primary transition-colors py-2">About Us</a>
              <a href="#contact" className="text-gray-600 hover:text-primary transition-colors py-2">Contact Us</a>
              <Button 
                variant="outline" 
                onClick={() => navigate("/auth")}
                className="border-primary text-primary hover:bg-primary hover:text-white w-full mt-2"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => navigate("/auth")}
                className="bg-primary hover:bg-primary/90 text-white w-full"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero section with modern design */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white pt-24">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-block p-2 px-4 bg-white/10 rounded-full mb-4">
              <span className="text-white/90 text-sm font-medium">Tamil Nadu's Premier Service Platform</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/90">
              Nalamini Service Platform
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              Connecting communities with essential services across Tamil Nadu
            </p>
          </div>
        </div>
      </div>



      <div className="hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
          </div>
        </div>
      </div>
      
      {/* Loading State */}
      {loading && (
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading platform videos...</p>
            </div>
          </div>
        </div>
      )}

      {/* Unified YouTube Videos Section */}
      {!loading && (
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Platform Services</h2>
                <p className="text-lg text-gray-600">
                  Discover all 7 services through our educational videos and platform overview
                </p>

              </div>
              
              {/* Always show this section */}
              {/* <div className="mb-12 bg-white rounded-2xl shadow-xl p-6">
                <div className="max-w-full mx-auto relative"> */}
                  {/* Banner Background */}
                  {/* <div className="relative rounded-xl overflow-hidden">
                    <img 
                      src={bannerImage}
                      alt="Nalamini Platform Services"
                      className="w-full h-auto"
                      style={{ minHeight: '300px', objectFit: 'contain' }}
                    />
                  </div>
                </div>
              </div> */}
              
              {/* Platform Banner with YouTube Embedded ON Banner */}
              <div className="mb-12 bg-white rounded-2xl shadow-xl p-6">
                <div className="max-w-full mx-auto">
                  <div className="relative rounded-xl overflow-hidden">
                    {/* Banner Image - Always Show */}
                    <img 
                      src={bannerImage}
                      alt="Nalamini Platform Services - Farm to Market, Manufacturers Hub, Transport, Taxi, Rental, Recharge & Booking, Recycling"
                      className="w-full h-auto"
                      style={{ minHeight: '300px', objectFit: 'contain' }}
                    />
                    
                    {/* YouTube Video Overlay ON the Banner */}
                    {selectedVideoId && (
                      <div className="absolute inset-0 bg-black/95 rounded-xl flex items-center justify-center p-4">
                        <div className="w-full h-full relative" style={{ maxHeight: '400px' }}>
                          <iframe 
                            key={selectedVideoId}
                            ref={(iframe) => {
                              if (iframe) {
                                const sessionId = trackYouTubeVideo(iframe, selectedVideoId, user?.id);
                                iframe.setAttribute('data-session-id', sessionId);
                                iframe.onload = () => {
                                  setTimeout(() => setPlayerReady(true), 1000);
                                };
                              }
                            }}
                            className="w-full h-full rounded-lg"
                            style={{ aspectRatio: '16/9' }}
                            src={`https://www.youtube.com/embed/${selectedVideoId}?modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&fs=1&controls=1&enablejsapi=1&autoplay=1&origin=${window.location.origin}`}
                            title="Nalamini Platform Services Video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" 
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                          ></iframe>
                          
                          {/* Close Video Button */}
                          <button
                            onClick={() => setSelectedVideoId("")}
                            className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full z-20 shadow-lg"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Language Selection Buttons */}
                <div className="flex justify-center gap-4 mt-6 mb-4">
                  <button
                    onClick={() => {
                      if (playlists.english.length > 0) {
                        setSelectedVideoId(playlists.english[0].id);
                        setCurrentLanguage('english');
                        setCurrentVideoIndex(0);
                      }
                    }}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-lg"
                  >
                    English Videos ({playlists.english.length})
                  </button>
                  <button
                    onClick={() => {
                      if (playlists.tamil.length > 0) {
                        setSelectedVideoId(playlists.tamil[0].id);
                        setCurrentLanguage('tamil');
                        setCurrentVideoIndex(0);
                      }
                    }}
                    className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-all shadow-lg"
                  >
                    தமிழ் Videos ({playlists.tamil.length})
                  </button>
                </div>
                
                {/* Video Playlist Display */}
                {selectedVideoId && (
                  <div className="mt-6 bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">
                      {currentLanguage === 'english' ? 'English Videos Playlist' : 'தமிழ் Videos Playlist'}
                    </h4>
                    <div className="grid gap-2 max-h-64 overflow-y-auto">
                      {(currentLanguage === 'english' ? playlists.english : playlists.tamil).map((video, index) => (
                        <div
                          key={video.id}
                          className={`p-3 rounded-lg cursor-pointer transition-all border ${
                            video.id === selectedVideoId
                              ? 'bg-white border-blue-300 shadow-md'
                              : 'bg-white border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => {
                            setSelectedVideoId(video.id);
                            setCurrentVideoIndex(index);
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                            <div className="flex-1">
                              <h5 className="font-medium text-sm text-gray-800 line-clamp-1">{video.title}</h5>
                              <p className="text-xs text-gray-600 line-clamp-1">{video.description}</p>
                            </div>
                            {video.id === selectedVideoId && (
                              <div className="text-blue-600">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                

              </div>

            </div>
          </div>
        </div>
      )}



      {/* Get Started Today Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Background pattern */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 rounded-3xl transform -rotate-1 scale-105"></div>
              
              <div className="relative bg-white p-10 rounded-2xl shadow-xl border border-primary/10">
                <div className="text-center mb-8">
                  <span className="inline-block py-1 px-4 rounded-full text-sm font-medium bg-primary/10 text-primary mb-2">
                    Join Our Community
                  </span>
                  <h2 className="text-3xl font-bold mb-2">Get Started Today</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Choose your journey with Nalamini Service Platform and be part of a growing ecosystem that's transforming service delivery across Tamil Nadu
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Customer Login */}
                  <div className="text-center p-6 rounded-xl border border-gray-200 hover:border-primary/30 hover:shadow-lg transition-all">
                    <div className="mb-4 bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">I'm a Customer</h3>
                    <p className="text-gray-600 mb-4">
                      Access services like mobile recharges, travel bookings, local products, and more
                    </p>
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => navigate("/auth")}
                    >
                      Get Started
                    </Button>
                  </div>

                  {/* Admin/Management Login */}
                  <div className="text-center p-6 rounded-xl border border-gray-200 hover:border-primary/30 hover:shadow-lg transition-all">
                    <div className="mb-4 bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="m22 21-3-3"></path>
                        <path d="m16 8 2-2"></path>
                        <path d="m18 6 2-2"></path>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Management Team</h3>
                    <p className="text-gray-600 mb-4">
                      Admin access for platform management, analytics, and service oversight
                    </p>
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={() => navigate("/auth")}
                    >
                      Team Login
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* About Us Section */}
      <div id="about" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block py-1 px-4 rounded-full text-sm font-medium bg-primary/10 text-primary mb-2">
                About Nalamini
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Transforming Tamil Nadu's Service Ecosystem</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Nalamini Service Platform is Tamil Nadu's comprehensive digital ecosystem, 
                connecting communities with essential services through innovative technology.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
                <p className="text-gray-600 mb-6">
                  To bridge the digital divide across Tamil Nadu by creating a unified platform that makes 
                  essential services accessible to every citizen, while empowering local businesses and 
                  service providers with the tools they need to thrive in the digital economy.
                </p>
                
                <h3 className="text-2xl font-semibold mb-4">Our Vision</h3>
                <p className="text-gray-600">
                  To become the leading service platform in Tamil Nadu, fostering economic growth, 
                  community development, and digital inclusion across all districts and rural areas.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-2xl font-semibold mb-4">Platform Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-primary">7</div>
                    <div className="text-sm text-gray-600">Core Services</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-green-600">38</div>
                    <div className="text-sm text-gray-600">Districts Covered</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">400+</div>
                    <div className="text-sm text-gray-600">Taluks Served</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">24/7</div>
                    <div className="text-sm text-gray-600">Service Support</div>
                  </div>
                </div>
              </div>
            </div>




          </div>
        </div>
      </div>

      {/* Contact Us Section */}
      <div id="contact" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block py-1 px-4 rounded-full text-sm font-medium bg-primary/10 text-primary mb-2">
                Contact Us
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Have questions about our services? Need support? Want to partner with us? 
                We're here to help you connect with the right solutions.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              {/* Contact Information */}
              <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Headquarters</h4>
                        <p className="text-gray-600 text-sm">Coimbatore, Tamil Nadu, India</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Phone Support</h4>
                        <p className="text-gray-600 text-sm">+91 9513430615</p>
                        <p className="text-gray-500 text-xs">Mon-Sat, 9 AM - 6 PM IST</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Email Support</h4>
                        <p className="text-gray-600 text-sm">support@nalamini.com</p>
                        <p className="text-gray-500 text-xs">Response within 24 hours</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Business Partnerships</h4>
                        <p className="text-gray-600 text-sm">admin@nalamini.com</p>
                        <p className="text-gray-500 text-xs">For collaboration opportunities</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-medium mb-3">Follow Us</h4>
                    <div className="flex gap-3">
                      <a href="#" className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                        </svg>
                      </a>
                      <a href="#" className="bg-blue-800 text-white p-2 rounded-lg hover:bg-blue-900 transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                        </svg>
                      </a>
                      <a href="#" className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-xl font-semibold mb-6">Send us a Message</h3>
                  <form className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input 
                          type="email" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input 
                          type="tel" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                          <option>General Inquiry</option>
                          <option>Service Support</option>
                          <option>Partnership Opportunity</option>
                          <option>Technical Issue</option>
                          <option>Feedback</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                      <textarea 
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="Tell us how we can help you..."
                      ></textarea>
                    </div>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                      Send Message
                    </Button>
                  </form>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>

      {/* Career Opportunities Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8 border border-primary/20">
              <div className="mb-4">
                <span className="inline-block py-1 px-4 rounded-full text-sm font-medium bg-primary/10 text-primary mb-2">
                  Career Opportunities
                </span>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Nalamini Opportunities Forum</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Be part of Tamil Nadu's digital transformation. Apply for management positions, 
                  service agent roles, or become a service provider.
                </p>
              </div>
              
              <Button 
                className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 text-lg"
                onClick={() => navigate("/opportunities")}
              >
                Explore & Get Associated
              </Button>
            </div>
          </div>
        </div>
      </div>



      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Nalamini Service Platform</h3>
              <p className="text-gray-400 mb-4">
                Tamil Nadu's comprehensive digital ecosystem for essential services.
              </p>
              <div className="flex gap-3">
                <a href="#" className="bg-gray-800 text-gray-400 hover:text-white p-2 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="bg-gray-800 text-gray-400 hover:text-white p-2 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="bg-gray-800 text-gray-400 hover:text-white p-2 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Our Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Farmer's Market</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Manufacturers Hub</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Transport Services</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Taxi Services</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Rental Services</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Recharge & Utilities</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Recycling Services</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="/auth" className="hover:text-white transition-colors" onClick={(e) => { e.preventDefault(); navigate("/auth"); }}>Get Started</a></li>
                <li><a href="/opportunities" className="hover:text-white transition-colors" onClick={(e) => { e.preventDefault(); navigate("/opportunities"); }}>Careers</a></li>
                <li><a href="/privacy-policy" className="hover:text-white transition-colors" onClick={(e) => { e.preventDefault(); navigate("/privacy-policy"); }}>Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Information</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Coimbatore, Tamil Nadu</li>
                <li>support@nalamini.com</li>
                <li>admin@nalamini.com</li>
                <li>+91 9513430615</li>
              </ul>
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  Serving all 38 districts of Tamil Nadu
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Nalamini Service Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}