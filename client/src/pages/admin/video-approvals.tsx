import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { CheckCircle, XCircle, Eye, Calendar, User, FileVideo } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery, useMutation } from "@tanstack/react-query";

interface VideoUpload {
  id: number;
  title: string;
  description: string;
  fileName: string;
  fileSize: number;
  status: string;
  uploaderId: number;
  category: string;
  targetArea: string;
  createdAt: string;
  approvalNotes?: string;
}

export default function VideoApprovals() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedVideo, setSelectedVideo] = useState<VideoUpload | null>(null);
  const [approvalNotes, setApprovalNotes] = useState("");

  const { data: pendingVideos = [], isLoading } = useQuery({
    queryKey: ["/api/admin/videos/pending"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/videos/pending");
      return await response.json();
    }
  });

  const approveVideoMutation = useMutation({
    mutationFn: async ({ videoId, action, notes }: { videoId: number; action: 'approve' | 'reject'; notes: string }) => {
      const response = await apiRequest("POST", `/api/admin/videos/${videoId}/approval`, {
        action,
        notes
      });
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Video processed",
        description: "Video approval status updated successfully"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/videos/pending"] });
      setSelectedVideo(null);
      setApprovalNotes("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to process video approval",
        variant: "destructive"
      });
    }
  });

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleApproval = (action: 'approve' | 'reject') => {
    if (!selectedVideo) return;
    
    approveVideoMutation.mutate({
      videoId: selectedVideo.id,
      action,
      notes: approvalNotes
    });
  };

  if (!user || user.userType !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">Only administrators can access video approvals.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Video Approvals</h1>
        <p className="text-muted-foreground">Review and approve uploaded videos for publication</p>
      </div>

      {pendingVideos.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FileVideo className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No pending videos</h3>
            <p className="text-muted-foreground">All uploaded videos have been reviewed.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Video List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Pending Videos ({pendingVideos.length})</h2>
            {pendingVideos.map((video: VideoUpload) => (
              <Card 
                key={video.id} 
                className={`cursor-pointer transition-colors ${
                  selectedVideo?.id === video.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                }`}
                onClick={() => setSelectedVideo(video)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm line-clamp-2">{video.title}</h3>
                    <Badge variant="outline" className="ml-2 text-xs">
                      {video.category}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <FileVideo className="w-3 h-3" />
                      <span>{video.fileName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>User ID: {video.uploaderId}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(video.createdAt)}</span>
                    </div>
                    <div className="text-xs">
                      Size: {formatFileSize(video.fileSize)}
                    </div>
                  </div>
                  {video.description && (
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                      {video.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Video Details and Approval */}
          <div className="sticky top-6">
            {selectedVideo ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Review Video
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedVideo.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedVideo.description || "No description provided"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">File:</span>
                      <p className="text-muted-foreground">{selectedVideo.fileName}</p>
                    </div>
                    <div>
                      <span className="font-medium">Size:</span>
                      <p className="text-muted-foreground">{formatFileSize(selectedVideo.fileSize)}</p>
                    </div>
                    <div>
                      <span className="font-medium">Category:</span>
                      <p className="text-muted-foreground">{selectedVideo.category}</p>
                    </div>
                    <div>
                      <span className="font-medium">Target Area:</span>
                      <p className="text-muted-foreground">{selectedVideo.targetArea || "All areas"}</p>
                    </div>
                    <div>
                      <span className="font-medium">Uploaded:</span>
                      <p className="text-muted-foreground">{formatDate(selectedVideo.createdAt)}</p>
                    </div>
                    <div>
                      <span className="font-medium">Uploader ID:</span>
                      <p className="text-muted-foreground">{selectedVideo.uploaderId}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Approval Notes (optional)
                    </label>
                    <Textarea
                      value={approvalNotes}
                      onChange={(e) => setApprovalNotes(e.target.value)}
                      placeholder="Add notes about your approval decision..."
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleApproval('approve')}
                      disabled={approveVideoMutation.isPending}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleApproval('reject')}
                      disabled={approveVideoMutation.isPending}
                      variant="destructive"
                      className="flex-1"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>

                  {approveVideoMutation.isPending && (
                    <div className="text-center text-sm text-muted-foreground">
                      Processing approval...
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Eye className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Select a video</h3>
                  <p className="text-muted-foreground">
                    Choose a video from the list to review and approve
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}