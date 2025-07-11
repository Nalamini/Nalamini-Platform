import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload, Video, Eye, Clock, Users, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface VideoUpload {
  id: number;
  title: string;
  description: string;
  filename: string;
  originalName: string;
  fileSize: number;
  uploadedBy: number;
  district: string;
  taluk: string;
  pincode: string;
  targetAudience: string;
  categories: string[];
  status: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  isPublic: boolean;
  youtubeVideoId?: string;
  adminNotes?: string;
  createdAt: string;
}

interface AnalyticsDashboard {
  totalViews: number;
  totalWatchTime: number;
  averageWatchTime: number;
  completionRate: number;
  topVideos: Array<{
    video: VideoUpload;
    viewCount: number;
    totalWatchTime: number;
    averageCompletion: number;
  }>;
  recentViews: Array<{
    id: number;
    videoId: string;
    deviceType: string;
    watchTime: number;
    completionPercentage: number;
    createdAt: string;
  }>;
}

export default function VideoUploadPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetAudience: "general",
    categories: [] as string[]
  });

  // Check if user has permission to upload videos
  const allowedRoles = ['branch_manager', 'taluk_manager', 'pincode_agent', 'admin'];
  const canUpload = user && allowedRoles.includes(user.userType);

  // Fetch user's uploaded videos
  const { data: myVideos, isLoading: videosLoading } = useQuery<VideoUpload[]>({
    queryKey: ["/api/videos/my-uploads"],
    enabled: !!user && canUpload
  });

  // Fetch analytics dashboard
  const { data: analytics, isLoading: analyticsLoading } = useQuery<AnalyticsDashboard>({
    queryKey: ["/api/videos/analytics/dashboard"],
    enabled: !!user && canUpload
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (formDataToUpload: FormData) => {
      const response = await fetch("/api/videos/upload", {
        method: "POST",
        credentials: "include",
        body: formDataToUpload
      });
      
      if (!response.ok) {
        let errorMessage = "Upload failed";
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const error = await response.json();
            errorMessage = error.message || errorMessage;
          } else {
            const text = await response.text();
            errorMessage = text || errorMessage;
          }
        } catch (parseError) {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await response.json();
        } else {
          const text = await response.text();
          throw new Error(`Expected JSON response but got: ${text}`);
        }
      } catch (parseError) {
        throw new Error(`Failed to parse response: ${parseError.message}`);
      }
    },
    onSuccess: () => {
      toast({
        title: "Upload Successful",
        description: "Your video has been uploaded and is pending admin approval"
      });
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        targetAudience: "general",
        categories: []
      });
      setSelectedFile(null);
      setUploadProgress(0);
      
      // Refresh video list
      queryClient.invalidateQueries({ queryKey: ["/api/videos/my-uploads"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Video file must be under 100MB",
          variant: "destructive"
        });
        return;
      }
      
      // Check file type
      const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Only MP4, AVI, MOV, WMV, FLV files are allowed",
          variant: "destructive"
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !formData.title) {
      toast({
        title: "Missing Information",
        description: "Please select a file and enter a title",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formDataToUpload = new FormData();
    formDataToUpload.append('video', selectedFile);
    formDataToUpload.append('title', formData.title);
    formDataToUpload.append('description', formData.description);
    formDataToUpload.append('targetAudience', formData.targetAudience);
    formDataToUpload.append('categories', JSON.stringify(formData.categories));

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 500);

    try {
      await uploadMutation.mutateAsync(formDataToUpload);
      setUploadProgress(100);
    } finally {
      clearInterval(progressInterval);
      setIsUploading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Please log in to access video management</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!canUpload) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Only branch managers, taluk managers, and pincode agents can upload videos.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Video Management</h1>
        <p className="text-muted-foreground">
          Upload area-specific advertisement videos for your region
        </p>
      </div>

      {/* Analytics Dashboard */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalViews}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Watch Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatDuration(analytics.totalWatchTime)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Watch Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatDuration(analytics.averageWatchTime)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.completionRate}%</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle>Upload New Video</CardTitle>
          <CardDescription>
            Upload promotional content for your area ({user.district} - {user.taluk})
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="video-file">Video File</Label>
            <div className="flex items-center space-x-4">
              <Input
                id="video-file"
                type="file"
                accept=".mp4,.avi,.mov,.wmv,.flv"
                onChange={handleFileSelect}
                disabled={isUploading}
              />
              {selectedFile && (
                <div className="text-sm text-muted-foreground">
                  {selectedFile.name} ({formatFileSize(selectedFile.size)})
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter video title"
              disabled={isUploading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your video content"
              disabled={isUploading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="audience">Target Audience</Label>
            <Select
              value={formData.targetAudience}
              onValueChange={(value) => setFormData({ ...formData, targetAudience: value })}
              disabled={isUploading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Public</SelectItem>
                <SelectItem value="farmers">Farmers</SelectItem>
                <SelectItem value="businesses">Local Businesses</SelectItem>
                <SelectItem value="students">Students</SelectItem>
                <SelectItem value="seniors">Senior Citizens</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          <Button 
            onClick={handleUpload}
            disabled={!selectedFile || !formData.title || isUploading}
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? "Uploading..." : "Upload Video"}
          </Button>
        </CardContent>
      </Card>

      {/* My Videos */}
      <Card>
        <CardHeader>
          <CardTitle>My Uploaded Videos</CardTitle>
          <CardDescription>
            Track the status and performance of your uploaded videos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {videosLoading ? (
            <div className="text-center py-8">Loading videos...</div>
          ) : myVideos && myVideos.length > 0 ? (
            <div className="space-y-4">
              {myVideos.map((video) => (
                <div key={video.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Video className="h-4 w-4" />
                      <h3 className="font-medium">{video.title}</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(video.approvalStatus)}
                      <Badge variant={
                        video.approvalStatus === 'approved' ? 'default' :
                        video.approvalStatus === 'rejected' ? 'destructive' :
                        'secondary'
                      }>
                        {video.approvalStatus}
                      </Badge>
                    </div>
                  </div>
                  
                  {video.description && (
                    <p className="text-sm text-muted-foreground">{video.description}</p>
                  )}
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>Size: {formatFileSize(video.fileSize)}</span>
                    <span>Uploaded: {new Date(video.createdAt).toLocaleDateString()}</span>
                    <span>Audience: {video.targetAudience}</span>
                  </div>
                  
                  {video.adminNotes && (
                    <Alert className="mt-2">
                      <AlertDescription>
                        <strong>Admin Notes:</strong> {video.adminNotes}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {video.youtubeVideoId && (
                    <div className="mt-2">
                      <Badge variant="outline">
                        YouTube ID: {video.youtubeVideoId}
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No videos uploaded yet
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Performing Videos */}
      {analytics && analytics.topVideos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Videos</CardTitle>
            <CardDescription>
              Your most watched videos with engagement metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topVideos.map((item, index) => (
                <div key={item.video.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                  <div className="text-lg font-bold text-muted-foreground">
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.video.title}</h4>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{item.viewCount} views</span>
                      <span>{formatDuration(item.totalWatchTime)} total watch time</span>
                      <span>{item.averageCompletion}% avg completion</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}