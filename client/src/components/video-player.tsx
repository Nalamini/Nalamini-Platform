import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, RotateCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

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

interface VideoPlayerProps {
  video: Video;
  userId?: number;
  onViewProgress?: (progress: number) => void;
}

export default function VideoPlayer({ video, userId, onViewProgress }: VideoPlayerProps) {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasStartedWatching, setHasStartedWatching] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const updateTime = () => {
      const current = videoElement.currentTime;
      const total = videoElement.duration;
      setCurrentTime(current);
      setDuration(total);
      
      if (total > 0) {
        const progressPercent = (current / total) * 100;
        setProgress(progressPercent);
        
        // Track viewing progress
        if (userId && hasStartedWatching && progressPercent > 0) {
          onViewProgress?.(progressPercent);
          
          // Log view progress every 10% watched
          if (Math.floor(progressPercent) % 10 === 0 && Math.floor(progressPercent) > 0) {
            trackViewProgress(progressPercent, current);
          }
        }
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(videoElement.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (userId && hasStartedWatching) {
        trackViewProgress(100, videoElement.duration);
      }
    };

    videoElement.addEventListener('timeupdate', updateTime);
    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    videoElement.addEventListener('ended', handleEnded);

    return () => {
      videoElement.removeEventListener('timeupdate', updateTime);
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.removeEventListener('ended', handleEnded);
    };
  }, [userId, hasStartedWatching, onViewProgress]);

  const trackViewProgress = async (progressPercent: number, watchTime: number) => {
    if (!userId) return;
    
    try {
      await apiRequest("POST", `/api/videos/${video.id}/view`, {
        progressPercent,
        watchTime,
        completed: progressPercent >= 90
      });
    } catch (error) {
      console.error("Error tracking view progress:", error);
    }
  };

  const togglePlay = async () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (isPlaying) {
      videoElement.pause();
      setIsPlaying(false);
    } else {
      try {
        await videoElement.play();
        setIsPlaying(true);
        
        // Track that user started watching
        if (!hasStartedWatching && userId) {
          setHasStartedWatching(true);
          // Increment view count on first play
          await apiRequest("GET", `/api/videos/${video.id}`);
        }
      } catch (error) {
        console.error("Error playing video:", error);
        toast({
          title: "Playback Error",
          description: "Unable to play video. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const toggleMute = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const newMuted = !isMuted;
    videoElement.muted = newMuted;
    setIsMuted(newMuted);
  };

  const handleVolumeChange = (newVolume: number) => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    videoElement.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleSeek = (seekTime: number) => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    videoElement.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progressPercent = (clickX / rect.width) * 100;
    const seekTime = (progressPercent / 100) * duration;
    handleSeek(seekTime);
  };

  const toggleFullscreen = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (!isFullscreen) {
      if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const skipTime = (seconds: number) => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    handleSeek(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl mb-2">{video.title}</CardTitle>
            <p className="text-muted-foreground mb-3">{video.description}</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline">{video.category}</Badge>
            <Badge variant={video.isPublic ? "default" : "secondary"}>
              {video.isPublic ? "Public" : "Private"}
            </Badge>
          </div>
        </div>
        
        {video.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {video.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="relative bg-black rounded-lg overflow-hidden mb-4">
          <video
            ref={videoRef}
            className="w-full aspect-video"
            poster={video.thumbnailUrl}
            preload="metadata"
          >
            <source src={video.fileUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Video Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            {/* Progress Bar */}
            <div 
              className="w-full h-2 bg-white/20 rounded-full mb-3 cursor-pointer"
              onClick={handleProgressClick}
            >
              <div 
                className="h-full bg-primary rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            {/* Control Buttons */}
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePlay}
                  className="text-white hover:bg-white/20"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => skipTime(-10)}
                  className="text-white hover:bg-white/20"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => skipTime(10)}
                  className="text-white hover:bg-white/20"
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>
                  
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-16 h-1 bg-white/20 rounded-lg"
                  />
                </div>
                
                <span className="text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="text-white hover:bg-white/20"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Video Information */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Duration:</span>
            <div className="font-medium">{formatTime(video.duration)}</div>
          </div>
          <div>
            <span className="text-muted-foreground">File Size:</span>
            <div className="font-medium">{formatFileSize(video.fileSize)}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Views:</span>
            <div className="font-medium">{video.viewCount.toLocaleString()}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Uploaded:</span>
            <div className="font-medium">{new Date(video.createdAt).toLocaleDateString()}</div>
          </div>
        </div>

        {/* Progress Indicator */}
        {hasStartedWatching && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-1">
              <span>Viewing Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}