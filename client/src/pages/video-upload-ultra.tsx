import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload, CheckCircle, AlertCircle, FileVideo, Zap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ULTRA_SMALL_CHUNK = 512 * 1024; // 512KB chunks
const MICRO_CHUNK = 256 * 1024; // 256KB chunks for problematic files

export default function VideoUploadUltra() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [chunkSize, setChunkSize] = useState(ULTRA_SMALL_CHUNK);
  const [uploadMethod, setUploadMethod] = useState<'ultra' | 'micro' | 'sequential'>('ultra');
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
      
      // Auto-select upload method based on file size
      if (selectedFile.size > 100 * 1024 * 1024) { // > 100MB
        setUploadMethod('micro');
        setChunkSize(MICRO_CHUNK);
      } else if (selectedFile.size > 50 * 1024 * 1024) { // > 50MB
        setUploadMethod('ultra');
        setChunkSize(ULTRA_SMALL_CHUNK);
      }
    }
  };

  const uploadChunkWithRetry = async (
    chunk: Blob, 
    chunkIndex: number, 
    totalChunks: number, 
    uploadId: string, 
    maxRetries = 5
  ) => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
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
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

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

        if (response.status === 413 || response.status === 502) {
          // Wait before retry for server issues
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
          continue;
        }

        throw new Error(`Upload failed: ${response.status}`);
      } catch (error: any) {
        if (attempt === maxRetries - 1) throw error;
        
        // Progressive backoff: 1s, 2s, 4s, 8s, 16s
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  };

  const handleUltraUpload = async () => {
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
      const totalChunks = Math.ceil(file.size / chunkSize);
      
      toast({
        title: "Starting upload",
        description: `Breaking file into ${totalChunks} chunks of ${Math.round(chunkSize/1024)}KB each`
      });

      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);

        await uploadChunkWithRetry(chunk, i, totalChunks, uploadId);
        
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
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

    } catch (error: any) {
      console.error("Ultra upload failed:", error);
      setUploadStatus('error');
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload video. Please try a different method.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSequentialUpload = async () => {
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
      const totalChunks = Math.ceil(file.size / chunkSize);
      
      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);

        // Sequential upload with delay between chunks
        await uploadChunkWithRetry(chunk, i, totalChunks, uploadId);
        
        const progress = ((i + 1) / totalChunks) * 100;
        setUploadProgress(progress);
        
        // Small delay between chunks to prevent overwhelming server
        if (i < totalChunks - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      setUploadStatus('success');
      toast({
        title: "Upload successful",
        description: "Your video has been uploaded sequentially"
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
      console.error("Sequential upload failed:", error);
      setUploadStatus('error');
      toast({
        title: "Upload failed",
        description: error.message || "Sequential upload failed",
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
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Ultra Large Video Upload Solutions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={uploadMethod} onValueChange={(value) => setUploadMethod(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="ultra">Ultra Small Chunks</TabsTrigger>
              <TabsTrigger value="micro">Micro Chunks</TabsTrigger>
              <TabsTrigger value="sequential">Sequential Upload</TabsTrigger>
            </TabsList>
            
            <div className="mt-6 space-y-4">
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
                    <div>Selected: {file.name} ({formatFileSize(file.size)})</div>
                    <div>Chunks: {Math.ceil(file.size / chunkSize)} × {Math.round(chunkSize/1024)}KB</div>
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

              <TabsContent value="ultra" className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900">Ultra Small Chunks (512KB)</h3>
                  <p className="text-sm text-blue-700">Best for files 50-100MB. Uses 512KB chunks with aggressive retry logic.</p>
                </div>
                <Button
                  onClick={handleUltraUpload}
                  disabled={!file || !title.trim() || isUploading}
                  className="w-full"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload with Ultra Small Chunks
                </Button>
              </TabsContent>

              <TabsContent value="micro" className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-medium text-green-900">Micro Chunks (256KB)</h3>
                  <p className="text-sm text-green-700">For very large files over 100MB. Uses 256KB chunks for maximum compatibility.</p>
                </div>
                <Button
                  onClick={() => {
                    setChunkSize(MICRO_CHUNK);
                    handleUltraUpload();
                  }}
                  disabled={!file || !title.trim() || isUploading}
                  className="w-full"
                >
                  <FileVideo className="mr-2 h-4 w-4" />
                  Upload with Micro Chunks
                </Button>
              </TabsContent>

              <TabsContent value="sequential" className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-medium text-purple-900">Sequential Upload</h3>
                  <p className="text-sm text-purple-700">Uploads chunks one by one with delays. Slowest but most reliable.</p>
                </div>
                <Button
                  onClick={handleSequentialUpload}
                  disabled={!file || !title.trim() || isUploading}
                  className="w-full"
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Upload Sequentially
                </Button>
              </TabsContent>

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
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span>Upload completed successfully!</span>
                </div>
              )}

              {uploadStatus === 'error' && (
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  <span>Upload failed. Try a different method.</span>
                </div>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}