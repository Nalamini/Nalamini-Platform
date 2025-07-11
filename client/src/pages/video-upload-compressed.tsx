import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload, CheckCircle, AlertCircle, Zap, Settings } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export default function VideoUploadCompressed() {
  const [file, setFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [quality, setQuality] = useState([0.8]);
  const [maxWidth, setMaxWidth] = useState(1280);
  const [maxHeight, setMaxHeight] = useState(720);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const validTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm'];
      if (!validTypes.includes(selectedFile.type)) {
        toast({
          title: "Invalid file type",
          description: "Please select a valid video file",
          variant: "destructive"
        });
        return;
      }

      setFile(selectedFile);
      setCompressedFile(null);
    }
  };

  const compressVideo = async () => {
    if (!file) return;

    setIsCompressing(true);
    setCompressionProgress(0);

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const video = document.createElement('video');
      
      video.src = URL.createObjectURL(file);
      video.muted = true;
      
      await new Promise((resolve) => {
        video.onloadedmetadata = () => {
          // Calculate new dimensions maintaining aspect ratio
          const aspectRatio = video.videoWidth / video.videoHeight;
          let newWidth = Math.min(video.videoWidth, maxWidth);
          let newHeight = Math.min(video.videoHeight, maxHeight);
          
          if (newWidth / newHeight > aspectRatio) {
            newWidth = newHeight * aspectRatio;
          } else {
            newHeight = newWidth / aspectRatio;
          }
          
          canvas.width = newWidth;
          canvas.height = newHeight;
          resolve(null);
        };
      });

      // Use MediaRecorder for better compression
      const stream = canvas.captureStream(30); // 30 fps
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 1000000 * quality[0] // Adjust bitrate based on quality
      });

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const compressedBlob = new Blob(chunks, { type: 'video/webm' });
        const compressedVideoFile = new File([compressedBlob], `compressed_${file.name.replace(/\.[^/.]+$/, ".webm")}`, {
          type: 'video/webm'
        });
        setCompressedFile(compressedVideoFile);
        setIsCompressing(false);
        
        const compressionRatio = ((file.size - compressedVideoFile.size) / file.size * 100).toFixed(1);
        toast({
          title: "Compression complete",
          description: `File size reduced by ${compressionRatio}% (${formatFileSize(file.size)} → ${formatFileSize(compressedVideoFile.size)})`
        });
      };

      mediaRecorder.start();
      
      // Simulate compression progress
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 2;
        setCompressionProgress(progress);
        if (progress >= 100) {
          clearInterval(progressInterval);
          mediaRecorder.stop();
        }
      }, 100);

    } catch (error) {
      console.error("Compression failed:", error);
      setIsCompressing(false);
      toast({
        title: "Compression failed",
        description: "Could not compress video. You can still upload the original file.",
        variant: "destructive"
      });
    }
  };

  const uploadFile = async (fileToUpload: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const chunkSize = 1024 * 1024; // 1MB chunks
      const totalChunks = Math.ceil(fileToUpload.size / chunkSize);
      const uploadId = Date.now().toString() + Math.random().toString(36).substr(2, 9);

      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, fileToUpload.size);
        const chunk = fileToUpload.slice(start, end);

        const formData = new FormData();
        formData.append('chunk', chunk);
        formData.append('chunkIndex', i.toString());
        formData.append('totalChunks', totalChunks.toString());
        formData.append('uploadId', uploadId);
        
        if (i === 0) {
          formData.append('title', title);
          formData.append('description', description);
          formData.append('originalName', fileToUpload.name);
          formData.append('totalSize', fileToUpload.size.toString());
        }

        const response = await fetch('/api/videos/upload-chunk', {
          method: 'POST',
          credentials: 'include',
          body: formData
        });

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.status}`);
        }

        const progress = ((i + 1) / totalChunks) * 100;
        setUploadProgress(progress);
      }

      toast({
        title: "Upload successful",
        description: "Your video has been uploaded and is pending admin approval"
      });

      // Reset form
      setFile(null);
      setCompressedFile(null);
      setTitle("");
      setDescription("");
      setUploadProgress(0);
      setCompressionProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

    } catch (error: any) {
      console.error("Upload failed:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload video",
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
            Compressed Video Upload
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="video-file">Video File</Label>
            <Input
              id="video-file"
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              disabled={isCompressing || isUploading}
            />
            {file && (
              <div className="mt-2 text-sm text-gray-600">
                Original: {file.name} ({formatFileSize(file.size)})
              </div>
            )}
          </div>

          {file && !compressedFile && (
            <Card className="p-4 bg-blue-50">
              <div className="space-y-4">
                <h3 className="font-medium">Compression Settings</h3>
                
                <div>
                  <Label>Quality: {(quality[0] * 100).toFixed(0)}%</Label>
                  <Slider
                    value={quality}
                    onValueChange={setQuality}
                    max={1}
                    min={0.3}
                    step={0.1}
                    className="mt-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="max-width">Max Width</Label>
                    <Input
                      id="max-width"
                      type="number"
                      value={maxWidth}
                      onChange={(e) => setMaxWidth(Number(e.target.value))}
                      min={480}
                      max={1920}
                    />
                  </div>
                  <div>
                    <Label htmlFor="max-height">Max Height</Label>
                    <Input
                      id="max-height"
                      type="number"
                      value={maxHeight}
                      onChange={(e) => setMaxHeight(Number(e.target.value))}
                      min={360}
                      max={1080}
                    />
                  </div>
                </div>

                <Button
                  onClick={compressVideo}
                  disabled={isCompressing}
                  className="w-full"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  {isCompressing ? "Compressing..." : "Compress Video"}
                </Button>

                {isCompressing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Compression Progress</span>
                      <span>{compressionProgress.toFixed(1)}%</span>
                    </div>
                    <Progress value={compressionProgress} className="w-full" />
                  </div>
                )}
              </div>
            </Card>
          )}

          {compressedFile && (
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-900">Compressed Video Ready</h3>
              <p className="text-sm text-green-700">
                Compressed: {compressedFile.name} ({formatFileSize(compressedFile.size)})
              </p>
              <p className="text-xs text-green-600">
                Size reduction: {((file!.size - compressedFile.size) / file!.size * 100).toFixed(1)}%
              </p>
            </div>
          )}

          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
              disabled={isCompressing || isUploading}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter video description"
              rows={3}
              disabled={isCompressing || isUploading}
            />
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => uploadFile(file!)}
              disabled={!file || !title.trim() || isCompressing || isUploading}
              variant="outline"
              className="flex-1"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Original
            </Button>

            <Button
              onClick={() => uploadFile(compressedFile!)}
              disabled={!compressedFile || !title.trim() || isCompressing || isUploading}
              className="flex-1"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Compressed
            </Button>
          </div>

          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Upload Progress</span>
                <span>{uploadProgress.toFixed(1)}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}