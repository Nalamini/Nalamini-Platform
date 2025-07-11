import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { Eye, Clock, Users, Play, TrendingUp, Calendar, MapPin, Monitor, Smartphone } from "lucide-react";

interface VideoAnalyticsData {
  totalViews: number;
  totalWatchTime: number;
  averageWatchTime: number;
  completionRate: number;
  topVideos: Array<{
    video: {
      id: number;
      title: string;
      description: string;
      targetAudience: string;
      district: string;
      taluk: string;
      createdAt: string;
    };
    viewCount: number;
    totalWatchTime: number;
    averageCompletion: number;
  }>;
  recentViews: Array<{
    id: number;
    videoId: string;
    deviceType: string;
    browserType: string;
    watchTime: number;
    completionPercentage: number;
    createdAt: string;
  }>;
}

interface DetailedVideoAnalytics {
  video: {
    id: number;
    title: string;
    description: string;
    targetAudience: string;
    district: string;
    taluk: string;
    createdAt: string;
  };
  totalViews: number;
  totalWatchTime: number;
  averageWatchTime: number;
  completionRate: number;
  viewsByDevice: Record<string, number>;
  viewsByHour: Record<string, number>;
  viewsByDay: Record<string, number>;
  engagementMetrics: {
    pauseCount: number;
    seekCount: number;
    volumeChanges: number;
    averagePlaybackSpeed: number;
  };
}

export default function VideoAnalyticsDashboard() {
  const { user } = useAuth();
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null);

  // Check if user has permission to view analytics
  const allowedRoles = ['branch_manager', 'taluk_manager', 'pincode_agent', 'admin'];
  const canViewAnalytics = user && allowedRoles.includes(user.userType);

  // Fetch overall analytics dashboard
  const { data: analytics, isLoading: analyticsLoading } = useQuery<VideoAnalyticsData>({
    queryKey: ["/api/videos/analytics/dashboard"],
    enabled: !!user && canViewAnalytics
  });

  // Fetch detailed analytics for selected video
  const { data: detailedAnalytics, isLoading: detailedLoading } = useQuery<DetailedVideoAnalytics>({
    queryKey: ["/api/videos/analytics/detailed", selectedVideoId],
    enabled: !!selectedVideoId && canViewAnalytics
  });

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Please log in to access video analytics</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!canViewAnalytics) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Video analytics are only available for managers and administrators
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (analyticsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Video Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Track screen time and engagement metrics for your uploaded videos
        </p>
      </div>

      {analytics && (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalViews}</div>
                  <p className="text-xs text-muted-foreground">
                    Across all your videos
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Watch Time</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatDuration(analytics.totalWatchTime)}</div>
                  <p className="text-xs text-muted-foreground">
                    Cumulative viewing time
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Watch Time</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatDuration(analytics.averageWatchTime)}</div>
                  <p className="text-xs text-muted-foreground">
                    Per viewing session
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.completionRate}%</div>
                  <p className="text-xs text-muted-foreground">
                    Videos watched to end
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Views */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Video Views</CardTitle>
                <CardDescription>Latest viewing sessions with device and engagement data</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics.recentViews.length > 0 ? (
                  <div className="space-y-4">
                    {analytics.recentViews.map((view) => (
                      <div key={view.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Monitor className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">{view.deviceType}</Badge>
                              <Badge variant="outline">{view.browserType}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {formatDate(view.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatDuration(view.watchTime)}</div>
                          <div className="text-sm text-muted-foreground">
                            {view.completionPercentage}% completed
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No recent views</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            {/* Top Performing Videos */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Videos</CardTitle>
                <CardDescription>Your most watched videos ranked by engagement</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics.topVideos.length > 0 ? (
                  <div className="space-y-4">
                    {analytics.topVideos.map((item, index) => (
                      <div key={item.video.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="text-lg font-bold text-muted-foreground">
                              #{index + 1}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{item.video.title}</h4>
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                <span>{item.video.district} - {item.video.taluk}</span>
                                <Badge variant="outline" className="text-xs">
                                  {item.video.targetAudience}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedVideoId(item.video.id)}
                          >
                            View Details
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="text-center">
                            <div className="font-medium">{item.viewCount}</div>
                            <div className="text-muted-foreground">Views</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium">{formatDuration(item.totalWatchTime)}</div>
                            <div className="text-muted-foreground">Total Watch Time</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium">{item.averageCompletion}%</div>
                            <div className="text-muted-foreground">Avg Completion</div>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Completion Rate</span>
                            <span>{item.averageCompletion}%</span>
                          </div>
                          <Progress value={item.averageCompletion} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No video data available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="engagement" className="space-y-6">
            {/* Video Engagement Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Engagement Overview</CardTitle>
                <CardDescription>How viewers interact with your video content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Viewing Patterns</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Average Completion Rate</span>
                        <span className="font-medium">{analytics.completionRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Total Video Sessions</span>
                        <span className="font-medium">{analytics.totalViews}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Average Session Duration</span>
                        <span className="font-medium">{formatDuration(analytics.averageWatchTime)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Device Distribution</h4>
                    <div className="space-y-2">
                      {analytics.recentViews.reduce((acc, view) => {
                        acc[view.deviceType] = (acc[view.deviceType] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)}
                      {Object.entries(
                        analytics.recentViews.reduce((acc, view) => {
                          acc[view.deviceType] = (acc[view.deviceType] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      ).map(([device, count]) => (
                        <div key={device} className="flex justify-between">
                          <span className="text-sm capitalize">{device}</span>
                          <Badge variant="outline">{count} views</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Screen Time Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Screen Time Insights</CardTitle>
                <CardDescription>Detailed viewer engagement and retention metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 border rounded-lg">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <div className="text-2xl font-bold">{Math.round(analytics.totalWatchTime / 3600)}h</div>
                    <div className="text-sm text-muted-foreground">Total Hours Watched</div>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <div className="text-2xl font-bold">{Math.round(analytics.averageWatchTime / 60)}m</div>
                    <div className="text-sm text-muted-foreground">Avg Session Length</div>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <Play className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                    <div className="text-2xl font-bold">{analytics.totalViews}</div>
                    <div className="text-sm text-muted-foreground">Video Starts</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Detailed Video Analytics Modal/Section */}
      {selectedVideoId && detailedAnalytics && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Detailed Analytics: {detailedAnalytics.video.title}</CardTitle>
                <CardDescription>In-depth metrics for this specific video</CardDescription>
              </div>
              <Button variant="outline" onClick={() => setSelectedVideoId(null)}>
                Close Details
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Video Information</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Title:</strong> {detailedAnalytics.video.title}</div>
                  <div><strong>Target Audience:</strong> {detailedAnalytics.video.targetAudience}</div>
                  <div><strong>Location:</strong> {detailedAnalytics.video.district} - {detailedAnalytics.video.taluk}</div>
                  <div><strong>Upload Date:</strong> {formatDate(detailedAnalytics.video.createdAt)}</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Performance Metrics</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="text-center p-3 border rounded">
                    <div className="font-bold">{detailedAnalytics.totalViews}</div>
                    <div className="text-muted-foreground">Total Views</div>
                  </div>
                  <div className="text-center p-3 border rounded">
                    <div className="font-bold">{detailedAnalytics.completionRate}%</div>
                    <div className="text-muted-foreground">Completion Rate</div>
                  </div>
                  <div className="text-center p-3 border rounded">
                    <div className="font-bold">{formatDuration(detailedAnalytics.totalWatchTime)}</div>
                    <div className="text-muted-foreground">Total Watch Time</div>
                  </div>
                  <div className="text-center p-3 border rounded">
                    <div className="font-bold">{formatDuration(detailedAnalytics.averageWatchTime)}</div>
                    <div className="text-muted-foreground">Avg Watch Time</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}