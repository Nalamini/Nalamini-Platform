import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Eye, Calendar, ExternalLink } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  duration: string;
  viewCount: string;
}

export function YouTubeVideosSection() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [channelUrl, setChannelUrl] = useState<string>('');

  useEffect(() => {
    fetchVideos();
    fetchChannelInfo();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await apiRequest('GET', '/api/youtube/videos?maxResults=6');
      const data = await response.json();
      setVideos(data);
    } catch (error: any) {
      console.error('Error fetching YouTube videos:', error);
      setError('Failed to load videos from YouTube channel');
    } finally {
      setLoading(false);
    }
  };

  const fetchChannelInfo = async () => {
    try {
      const response = await apiRequest('GET', '/api/youtube/channel-info');
      const data = await response.json();
      setChannelUrl(data.channelUrl);
    } catch (error) {
      console.error('Error fetching channel info:', error);
    }
  };

  const formatDuration = (isoDuration: string): string => {
    const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return '0:00';

    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  };

  const formatViewCount = (count: string): string => {
    const num = parseInt(count);
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M views`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K views`;
    } else {
      return `${num} views`;
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const openVideo = (videoId: string) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading training videos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Videos</h3>
          <p className="text-red-600 mb-4">{error}</p>
          {channelUrl && (
            <Button 
              onClick={() => window.open(channelUrl, '_blank')}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit YouTube Channel
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {videos.length === 0 ? (
        <div className="text-center py-8">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Videos Available</h3>
            <p className="text-gray-600 mb-4">No training videos found on the channel yet.</p>
            {channelUrl && (
              <Button 
                onClick={() => window.open(channelUrl, '_blank')}
                className="bg-primary hover:bg-primary/90"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit YouTube Channel
              </Button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Card 
                key={video.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => openVideo(video.id)}
              >
                <CardHeader className="p-0">
                  <div className="relative">
                    <img 
                      src={video.thumbnailUrl} 
                      alt={video.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors rounded-t-lg flex items-center justify-center">
                      <div className="bg-red-600 text-white rounded-full p-3 opacity-90 hover:opacity-100 transition-opacity">
                        <Play className="h-6 w-6 fill-current" />
                      </div>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className="absolute bottom-2 right-2 bg-black/70 text-white border-0"
                    >
                      {formatDuration(video.duration)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-base font-semibold mb-2 line-clamp-2">
                    {video.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {video.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      {formatViewCount(video.viewCount)}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(video.publishedAt)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            {channelUrl && (
              <Button 
                onClick={() => window.open(channelUrl, '_blank')}
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View All Videos on YouTube
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}