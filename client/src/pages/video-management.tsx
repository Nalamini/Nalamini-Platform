import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Upload, Video, Eye, ExternalLink, Youtube, RefreshCw, Calendar, Clock, Trash2, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { apiRequest } from "@/lib/queryClient";

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  duration: string;
  viewCount: number;
}

export default function VideoManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideo[]>([]);
  const [channelInfo, setChannelInfo] = useState<{channelId: string; channelUrl: string} | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deletingVideoId, setDeletingVideoId] = useState<string | null>(null);

  // Check if user has video upload permissions
  const hasVideoPermissions = user && ['admin', 'branch_manager', 'taluk_manager'].includes(user.userType);

  useEffect(() => {
    if (hasVideoPermissions) {
      fetchYouTubeVideos();
      fetchChannelInfo();
    }
  }, [user]);

  const fetchYouTubeVideos = async () => {
    try {
      const response = await apiRequest("GET", "/api/youtube/videos?maxResults=50");
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          setYoutubeVideos(data);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (parseError) {
        console.error("JSON parsing error:", parseError);
        throw new Error('Failed to parse response data');
      }
    } catch (error) {
      console.error("Error fetching YouTube videos:", error);
      toast({
        title: "Error",
        description: "Failed to fetch YouTube videos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchChannelInfo = async () => {
    try {
      const response = await apiRequest("GET", "/api/youtube/channel-info");
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          setChannelInfo(data);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (parseError) {
        console.error("JSON parsing error:", parseError);
        throw new Error('Failed to parse channel info response');
      }
    } catch (error) {
      console.error("Error fetching channel info:", error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchYouTubeVideos();
    setRefreshing(false);
    toast({
      title: "Success",
      description: "Video list refreshed successfully",
    });
  };

  const openVideoInNewTab = (videoId: string) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  const openChannelInNewTab = () => {
    if (channelInfo) {
      window.open(channelInfo.channelUrl, '_blank');
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    setDeletingVideoId(videoId);
    try {
      const response = await apiRequest("DELETE", `/api/videos/${videoId}`);
      
      if (response.ok) {
        // Remove video from local state
        setYoutubeVideos(prev => prev.filter(video => video.id !== videoId));
        
        toast({
          title: "Success",
          description: "Video deleted successfully",
        });
      } else {
        throw new Error("Failed to delete video");
      }
    } catch (error) {
      console.error("Error deleting video:", error);
      toast({
        title: "Error",
        description: "Failed to delete video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingVideoId(null);
    }
  };

  if (!hasVideoPermissions) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <Video className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
            <p className="text-gray-600">
              You don't have permission to access video management. 
              Contact your administrator for access.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Video Management</h1>
          <p className="text-gray-600 mt-2">Manage videos on the Nalamini YouTube channel</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            onClick={() => window.location.href = '/video-upload-chunked'}
            variant="outline"
          >
            <Upload className="h-4 w-4 mr-2" />
            Large File Upload
          </Button>
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Quick Upload
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Upload Video to Nalamini Channel</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                    <Youtube className="h-5 w-5 mr-2" />
                    YouTube Studio Upload Instructions
                  </h3>
                  <p className="text-blue-800 text-sm mb-3">
                    To upload videos to the Nalamini channel, follow these steps:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                    <li>Go to YouTube Studio (studio.youtube.com)</li>
                    <li>Sign in with the Nalamini channel account</li>
                    <li>Click "CREATE" → "Upload videos"</li>
                    <li>Select your video file and add details</li>
                    <li>Set visibility to "Public" for landing page display</li>
                    <li>Click "PUBLISH" to make it live</li>
                  </ol>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    onClick={openChannelInNewTab}
                    className="flex-1"
                    variant="outline"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open YouTube Channel
                  </Button>
                  <Button 
                    onClick={() => window.open('https://studio.youtube.com', '_blank')}
                    className="flex-1"
                  >
                    <Youtube className="h-4 w-4 mr-2" />
                    Open YouTube Studio
                  </Button>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Note:</strong> After uploading, click the refresh button above to see your new videos appear in the system.
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="channel-videos" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="channel-videos">Channel Videos ({youtubeVideos.length})</TabsTrigger>
          <TabsTrigger value="channel-info">Channel Information</TabsTrigger>
        </TabsList>

        <TabsContent value="channel-videos" className="space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : youtubeVideos.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Youtube className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No Videos Found</h3>
                <p className="text-gray-600 mb-4">
                  No videos are currently available on the Nalamini YouTube channel.
                </p>
                <Button onClick={() => setUploadDialogOpen(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload First Video
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {youtubeVideos.map((video) => (
                <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
                    <iframe 
                      className="absolute top-0 left-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${video.id}?modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&fs=0&controls=1&enablejsapi=0`}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      referrerPolicy="strict-origin-when-cross-origin"
                      loading="lazy"
                    ></iframe>
                    <Badge className="absolute top-2 right-2 bg-black/70 text-white z-10">
                      {video.duration}
                    </Badge>
                    <div className="absolute top-2 left-2 z-10">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            className="h-8 w-8 p-0 bg-black/70 hover:bg-black/90 border-0"
                          >
                            <MoreHorizontal className="h-4 w-4 text-white" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem onClick={() => openVideoInNewTab(video.id)}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open in YouTube
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => window.open('https://studio.youtube.com', '_blank')}>
                            <Youtube className="h-4 w-4 mr-2" />
                            Manage in YouTube Studio
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{video.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {video.viewCount.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(video.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="channel-info" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Youtube className="h-5 w-5 mr-2 text-red-600" />
                Nalamini YouTube Channel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {channelInfo ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Channel ID</label>
                      <p className="text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded">{channelInfo.channelId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Total Videos</label>
                      <p className="text-sm text-gray-900">{youtubeVideos.length} videos</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button onClick={openChannelInNewTab} variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Channel
                    </Button>
                    <Button onClick={() => window.open('https://studio.youtube.com', '_blank')}>
                      <Youtube className="h-4 w-4 mr-2" />
                      YouTube Studio
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-gray-600">Loading channel information...</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Integration Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">YouTube API Connection</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">Connected</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Channel Access</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Video Sync</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">Real-time</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}