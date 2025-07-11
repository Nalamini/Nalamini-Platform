import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const CHUNK_SIZE = 512 * 1024; // 512KB chunks for maximum compatibility

export default function VideoUploadSimple() {
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
      const validTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm'];
      if (!validTypes.includes(selectedFile.type)) {
        toast({
          title: "Invalid file type",
          description: "Please select a valid video file",
          variant: "destructive"
        });
        return;
      }

      setFile(selectedFile);
      setUploadStatus('idle');
    }
  };

  const uploadChunk = async (chunk: Blob, chunkIndex: number, totalChunks: number, uploadId: string, retryCount = 0): Promise<any> => {
    const maxRetries = 5;
    
    try {
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

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch('/api/videos/upload-chunk', {
        method: 'POST',
        credentials: 'include',
        body: formData,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return await response.json();
      }

      throw new Error(`Upload failed with status: ${response.status}`);
    } catch (error: any) {
      if (retryCount < maxRetries) {
        const delay = Math.pow(2, retryCount) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
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
      const uploadId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
      
      toast({
        title: "Starting upload",
        description: `Breaking file into ${totalChunks} small chunks for reliable upload`
      });

      for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);

        await uploadChunk(chunk, i, totalChunks, uploadId);
        
        const progress = ((i + 1) / totalChunks) * 100;
        setUploadProgress(progress);
        
        // Small delay to prevent server overload
        if (i < totalChunks - 1) {
          await new Promise(resolve => setTimeout(resolve, 50));
        }
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
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

    } catch (error: any) {
      console.error("Upload failed:", error);
      setUploadStatus('error');
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload video. Please try again.",
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
            Simple Video Upload
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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
                <div>Selected: {file.name}</div>
                <div>Size: {formatFileSize(file.size)}</div>
                <div>Will be split into: {Math.ceil(file.size / CHUNK_SIZE)} chunks</div>
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
              rows={3}
              disabled={isUploading}
            />
          </div>

          <Button
            onClick={handleUpload}
            disabled={!file || !title.trim() || isUploading}
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? "Uploading..." : "Upload Video"}
          </Button>

          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Upload Progress</span>
                <span>{uploadProgress.toFixed(1)}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          {uploadStatus === 'success' && (
            <div className="flex items-center space-x-2 text-green-600 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5" />
              <span>Upload completed successfully!</span>
            </div>
          )}

          {uploadStatus === 'error' && (
            <div className="flex items-center space-x-2 text-red-600 p-3 bg-red-50 rounded-lg">
              <AlertCircle className="h-5 w-5" />
              <span>Upload failed. Please try again.</span>
            </div>
          )}

          <div className="text-sm text-gray-500 space-y-1">
            <div>• Uses 512KB chunks for maximum compatibility</div>
            <div>• Automatic retry on failed chunks</div>
            <div>• Works with large files and slow connections</div>
            <div>• Supported formats: MP4, AVI, MOV, WMV, WEBM</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}