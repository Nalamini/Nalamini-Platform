import { useEffect, useState, useRef } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bus, 
  Car, 
  Package, 
  Smartphone, 
  ShoppingCart, 
  Recycle,
  MapPin,
  Phone,
  Mail,
  Users,
  Truck,
  Home,
  Play,
  SkipForward,
  SkipBack,
  Volume2
} from "lucide-react";

// YouTube playlist data - replace with your actual video IDs
const PLAYLISTS = {
  tamil: [
    { id: "dQw4w9WgXcQ", title: "நளமினி சேவை தளம் - அறிமுகம்", description: "தமிழ்நாட்டின் முழுமையான சேவை தளத்தைப் பற்றி அறிந்து கொள்ளுங்கள்" },
    { id: "L_jWHffIx5E", title: "பயண சேவைகள்", description: "பேருந்து, விமானம் மற்றும் ஹோட்டல் முன்பதிவுகள்" },
    { id: "fJ9rUzIMcZQ", title: "உள்ளூர் தயாரிப்புகள்", description: "கைவினைஞர்கள் மற்றும் உள்ளூர் உற்பத்தியாளர்களின் தயாரிப்புகள்" }
  ],
  english: [
    { id: "9bZkp7q19f0", title: "Nalamini Service Platform Introduction", description: "Discover Tamil Nadu's comprehensive service ecosystem" },
    { id: "kJQP7kiw5ve", title: "Travel Services Overview", description: "Bus, flight, and hotel booking made easy" },
    { id: "tgbNymZ7vqY", title: "Local Products Marketplace", description: "Supporting Tamil Nadu artisans and manufacturers" }
  ]
};

interface YouTubePlayerProps {
  playlist: typeof PLAYLISTS.tamil;
  language: 'tamil' | 'english';
}

function YouTubePlayer({ playlist, language }: YouTubePlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load YouTube IFrame API
    if (!(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      (window as any).onYouTubeIframeAPIReady = () => {
        initializePlayer();
      };
    } else {
      initializePlayer();
    }

    return () => {
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    // Reinitialize player when language changes
    if (playerRef.current && playerReady) {
      playerRef.current.loadVideoById(playlist[currentIndex].id);
    }
  }, [language, playlist]);

  const initializePlayer = () => {
    if (containerRef.current) {
      const YT = (window as any).YT;
      playerRef.current = new YT.Player(containerRef.current, {
        height: '360',
        width: '100%',
        videoId: playlist[currentIndex].id,
        playerVars: {
          autoplay: 0,
          controls: 1,
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onReady: () => {
            console.log(`YouTube player ready for ${language}`);
            setPlayerReady(true);
          },
          onStateChange: (event: any) => {
            const YT = (window as any).YT;
            if (event.data === YT.PlayerState.ENDED) {
              playNext();
            }
            setIsPlaying(event.data === YT.PlayerState.PLAYING);
          }
        }
      });
    }
  };

  const playNext = () => {
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentIndex(nextIndex);
    if (playerRef.current && playerReady) {
      playerRef.current.loadVideoById(playlist[nextIndex].id);
    }
  };

  const playPrevious = () => {
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    if (playerRef.current && playerReady) {
      playerRef.current.loadVideoById(playlist[prevIndex].id);
    }
  };

  const togglePlay = () => {
    if (playerRef.current && playerReady) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
        <div ref={containerRef} className="w-full h-full" />
        {!playerReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
            <div className="text-center">
              <Volume2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Loading video player...</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">
            {playlist[currentIndex].title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {playlist[currentIndex].description}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Video {currentIndex + 1} of {playlist.length}
          </p>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <Button variant="outline" size="sm" onClick={playPrevious}>
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={togglePlay}>
            <Play className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={playNext}>
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {playlist.map((video, index) => (
          <div
            key={video.id}
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              index === currentIndex
                ? 'bg-primary/10 border border-primary/20'
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
            onClick={() => {
              setCurrentIndex(index);
              if (playerRef.current && playerReady) {
                playerRef.current.loadVideoById(video.id);
              }
            }}
          >
            <h4 className="font-medium text-sm">{video.title}</h4>
            <p className="text-xs text-gray-600 mt-1">{video.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SimpleLanding() {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user && !isLoading) {
      if (user.userType === "service_provider") {
        navigate("/provider-dashboard");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't show landing page if user is logged in
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Home className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-gray-900">NALAMINI</span>
            </div>
            <div className="flex space-x-4">
              <Button variant="outline" onClick={() => navigate("/auth")}>
                Login
              </Button>
              <Button onClick={() => navigate("/auth")}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            Serving Tamil Nadu Communities
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Your Complete Service Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Connecting communities across Tamil Nadu through integrated services - 
            from transportation and delivery to local products and digital services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/auth")} className="px-8 py-3">
              Start Using Services
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate("/auth")} className="px-8 py-3">
              Become a Provider
            </Button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            7 Essential Services
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need for daily life, business, and community connections
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Travel Services */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Bus className="h-10 w-10 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Travel Booking</CardTitle>
              <CardDescription>Bus, Flight & Hotel Reservations</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Book buses, flights, and hotels across India with best prices and instant confirmation.
              </p>
            </CardContent>
          </Card>

          {/* Taxi Services */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Car className="h-10 w-10 text-yellow-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Taxi Services</CardTitle>
              <CardDescription>Local Transportation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Reliable taxi services for local trips with GPS tracking and fair pricing.
              </p>
            </CardContent>
          </Card>

          {/* Delivery Services */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Package className="h-10 w-10 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Delivery</CardTitle>
              <CardDescription>Package & Document Delivery</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Fast and secure delivery services for packages and important documents.
              </p>
            </CardContent>
          </Card>

          {/* Farmer's Market */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Truck className="h-10 w-10 text-green-700 mx-auto mb-2" />
              <CardTitle className="text-lg">Farmer's Market</CardTitle>
              <CardDescription>Fresh Farm Products</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Direct access to fresh produce from local farmers across Tamil Nadu.
              </p>
            </CardContent>
          </Card>

          {/* Local Products */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <ShoppingCart className="h-10 w-10 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Local Products</CardTitle>
              <CardDescription>Artisan & Local Goods</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Discover unique local products from artisans and manufacturers.
              </p>
            </CardContent>
          </Card>

          {/* Grocery */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <ShoppingCart className="h-10 w-10 text-orange-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Grocery</CardTitle>
              <CardDescription>Daily Essentials</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Order groceries and daily essentials with home delivery options.
              </p>
            </CardContent>
          </Card>

          {/* Recharge Services */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Smartphone className="h-10 w-10 text-blue-500 mx-auto mb-2" />
              <CardTitle className="text-lg">Recharge & Bills</CardTitle>
              <CardDescription>Mobile & Utility Payments</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Recharge mobile phones and pay utility bills with instant processing.
              </p>
            </CardContent>
          </Card>

          {/* Recycling */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Recycle className="h-10 w-10 text-green-500 mx-auto mb-2" />
              <CardTitle className="text-lg">Recycling</CardTitle>
              <CardDescription>Waste Management</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Eco-friendly waste management and recycling services for communities.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* YouTube Video Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Learn About Our Services
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Watch our videos to understand how Nalamini can help your community
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="english" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="english" className="flex items-center space-x-2">
                <span>🇬🇧</span>
                <span>English</span>
              </TabsTrigger>
              <TabsTrigger value="tamil" className="flex items-center space-x-2">
                <span>🇮🇳</span>
                <span>தமிழ்</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="english" className="space-y-4">
              <YouTubePlayer playlist={PLAYLISTS.english} language="english" />
            </TabsContent>
            
            <TabsContent value="tamil" className="space-y-4">
              <YouTubePlayer playlist={PLAYLISTS.tamil} language="tamil" />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Get in Touch
              </h2>
              <p className="text-gray-600">
                Ready to start using our services? Contact us today.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <MapPin className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Address</h3>
                <p className="text-gray-600">
                  Coimbatore, Tamil Nadu<br />
                  India
                </p>
              </div>

              <div className="text-center">
                <Phone className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Phone</h3>
                <p className="text-gray-600">
                  +91 9513430615
                </p>
              </div>

              <div className="text-center">
                <Mail className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-gray-600">
                  admin@nalamini.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Home className="h-6 w-6" />
              <span className="text-xl font-bold">NALAMINI</span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400">
                © 2025 Nalamini Service Platform. Serving Tamil Nadu communities.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}