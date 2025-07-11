import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const CHUNK_SIZE = 1 * 1024 * 1024; // 1MB chunks for maximum compatibility

export default function VideoUploadChunked() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv'];
      if (!validTypes.includes(selectedFile.type)) {
        toast({
          title: "Invalid file type",
          description: "Please select a valid video file (MP4, AVI, MOV, WMV, FLV)",
          variant: "destructive"
        });
        return;
      }

      // Validate file size (150MB limit)
      if (selectedFile.size > 150 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a video file smaller than 150MB",
          variant: "destructive"
        });
        return;
      }

      setFile(selectedFile);
      setUploadStatus('idle');
    }
  };

  const uploadChunk = async (chunk: Blob, chunkIndex: number, totalChunks: number, uploadId: string, retryCount = 0): Promise<any> => {
    const formData = new FormData();
    formData.append('chunk', chunk);
    formData.append('chunkIndex', chunkIndex.toString());
    formData.append('totalChunks', totalChunks.toString());
    formData.append('uploadId', uploadId);
    
    if (chunkIndex === 0) {
      formData.append('title', title);
      formData.append('description', description);
      formData.append('originalName', file!.name);
      formData.append('totalSize', file!.size.toString());
    }

    try {
      const response = await fetch('/api/videos/upload-chunk', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        if ((response.status === 413 || response.status === 502) && retryCount < 3) {
          // Request Entity Too Large or Bad Gateway - wait and retry
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
          return uploadChunk(chunk, chunkIndex, totalChunks, uploadId, retryCount + 1);
        }
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      if (retryCount < 3 && (
        error.message.includes('Entity Too Large') || 
        error.message.includes('timeout') ||
        error.message.includes('network') ||
        error.name === 'NetworkError'
      )) {
        // Retry with exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
        return uploadChunk(chunk, chunkIndex, totalChunks, uploadId, retryCount + 1);
      }
      throw error;
    }
  };

  const handleUpload = async () => {
    if (!file || !title.trim()) {
      toast({
        title: "Missing information",
        description: "Please select a file and enter a title",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus('uploading');
    setUploadProgress(0);

    try {
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
      const uploadId = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);

        await uploadChunk(chunk, i, totalChunks, uploadId);
        
        const progress = ((i + 1) / totalChunks) * 100;
        setUploadProgress(progress);
      }

      setUploadStatus('success');
      toast({
        title: "Upload successful",
        description: "Your video has been uploaded and is pending admin approval"
      });

      // Reset form
      setFile(null);
      setTitle("");
      setDescription("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      toast({
        title: "Upload failed",
        description: error.message || "An error occurred during upload",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload New Video (Chunked Upload)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Video File</label>
            <Input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              disabled={isUploading}
            />
            {file && (
              <div className="mt-2 text-sm text-gray-600">
                Selected: {file.name} ({formatFileSize(file.size)})
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
              disabled={isUploading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter video description"
              rows={4}
              disabled={isUploading}
            />
          </div>

          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Upload Progress</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button
              onClick={handleUpload}
              disabled={!file || !title.trim() || isUploading}
              className="flex items-center gap-2"
            >
              {uploadStatus === 'uploading' ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Uploading...
                </>
              ) : uploadStatus === 'success' ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Upload Complete
                </>
              ) : uploadStatus === 'error' ? (
                <>
                  <AlertCircle className="h-4 w-4" />
                  Upload Failed
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload Video
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}