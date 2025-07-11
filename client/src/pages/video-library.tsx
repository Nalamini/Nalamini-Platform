import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Video, Play, Search, Eye, Clock, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import VideoPlayer from "@/components/video-player";

interface Video {
  id: number;
  title: string;
  description: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  duration: number;
  thumbnailUrl?: string;
  uploadedBy: number;
  category: string;
  isPublic: boolean;
  tags: string[];
  status: 'active' | 'inactive' | 'archived';
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function VideoLibrary() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    'all',
    'general',
    'training',
    'announcement',
    'tutorial',
    'policy',
    'onboarding',
    'safety',
    'technical'
  ];

  useEffect(() => {
    fetchPublicVideos();
  }, []);

  useEffect(() => {
    filterVideos();
  }, [videos, searchTerm, selectedCategory]);

  const fetchPublicVideos = async () => {
    try {
      const response = await apiRequest("GET", "/api/videos/approved");
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          // All approved videos are already filtered by the backend
          setVideos(data);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (parseError) {
        console.error("JSON parsing error:", parseError);
        throw new Error('Failed to parse videos response');
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
      toast({
        title: "Error",
        description: "Failed to load video library",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterVideos = () => {
    let filtered = [...videos];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(video => video.category === selectedCategory);
    }

    setFilteredVideos(filtered);
  };

  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video);
    setPlayerOpen(true);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Video Library</h1>
        <p className="text-muted-foreground">Browse training videos and educational content</p>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search videos, descriptions, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Video Grid */}
      {filteredVideos.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Videos Found</h3>
            <p className="text-muted-foreground">
              {searchTerm || selectedCategory !== "all" 
                ? "Try adjusting your search or filter criteria"
                : "No public videos are currently available"
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map((video) => (
            <Card key={video.id} className="group hover:shadow-lg transition-shadow cursor-pointer">
              <div 
                onClick={() => handleVideoSelect(video)}
                className="relative"
              >
                {/* Video Thumbnail */}
                <div className="aspect-video bg-black rounded-t-lg relative overflow-hidden">
                  {video.thumbnailUrl ? (
                    <img 
                      src={video.thumbnailUrl} 
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/40">
                      <Video className="h-12 w-12 text-primary/60" />
                    </div>
                  )}
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="bg-white/90 group-hover:bg-white rounded-full p-3 group-hover:scale-110 transition-all">
                      <Play className="h-6 w-6 text-black ml-1" />
                    </div>
                  </div>
                  
                  {/* Duration Badge */}
                  <div className="absolute bottom-2 right-2">
                    <Badge variant="secondary" className="bg-black/80 text-white border-0">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDuration(video.duration)}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-base line-clamp-2 group-hover:text-primary transition-colors">
                      {video.title}
                    </CardTitle>
                    <Badge variant="outline" className="shrink-0">
                      {video.category}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {video.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      {video.viewCount.toLocaleString()} views
                    </div>
                    <div>
                      {formatFileSize(video.fileSize)}
                    </div>
                  </div>

                  {video.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {video.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {video.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{video.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="mt-3 pt-3 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVideoSelect(video);
                      }}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Watch Now
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Video Player Dialog */}
      <Dialog open={playerOpen} onOpenChange={setPlayerOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="sr-only">Video Player</DialogTitle>
          </DialogHeader>
          {selectedVideo && (
            <VideoPlayer
              video={selectedVideo}
              userId={user?.id}
              onViewProgress={(progress) => {
                console.log(`Video progress: ${progress}%`);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}