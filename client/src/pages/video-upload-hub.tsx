import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileVideo, 
  Zap, 
  Settings, 
  Upload, 
  HardDrive,
  Wifi,
  Timer,
  CheckCircle2
} from "lucide-react";
import { Link } from "wouter";

export default function VideoUploadHub() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getRecommendedMethod = (fileSize: number) => {
    if (fileSize > 200 * 1024 * 1024) return "compression";
    if (fileSize > 100 * 1024 * 1024) return "ultra";
    if (fileSize > 50 * 1024 * 1024) return "chunked";
    return "standard";
  };

  const uploadMethods = [
    {
      id: "compression",
      title: "Video Compression",
      description: "Reduce file size before upload",
      icon: Settings,
      route: "/video-upload-compressed",
      features: ["Adjustable quality", "Custom resolution", "80% size reduction"],
      recommended: ["Files over 200MB", "Slow internet", "Quality flexible"],
      color: "bg-green-100 text-green-800 border-green-200"
    },
    {
      id: "ultra",
      title: "Ultra Small Chunks",
      description: "256KB - 512KB chunks with retry logic",
      icon: Zap,
      route: "/video-upload-ultra",
      features: ["Ultra small chunks", "Advanced retry", "Multiple strategies"],
      recommended: ["Files 100-500MB", "Unstable connection", "Maximum reliability"],
      color: "bg-blue-100 text-blue-800 border-blue-200"
    },
    {
      id: "chunked",
      title: "Standard Chunked",
      description: "1-2MB chunks for reliable upload",
      icon: Upload,
      route: "/video-upload-chunked",
      features: ["Standard chunking", "Progress tracking", "Error recovery"],
      recommended: ["Files 50-200MB", "Normal connection", "Balanced approach"],
      color: "bg-purple-100 text-purple-800 border-purple-200"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
          <FileVideo className="h-8 w-8" />
          Video Upload Solutions
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Choose the best upload method for your video based on file size and connection quality. 
          Each method is optimized for different scenarios.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            File Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select your video file for analysis</label>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {selectedFile && (
              <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">File:</span> {selectedFile.name}
                  </div>
                  <div>
                    <span className="font-medium">Size:</span> {formatFileSize(selectedFile.size)}
                  </div>
                  <div>
                    <span className="font-medium">Type:</span> {selectedFile.type}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    Recommended: {uploadMethods.find(m => m.id === getRecommendedMethod(selectedFile.size))?.title}
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {uploadMethods.map((method) => (
          <Card key={method.id} className={`border-2 ${selectedFile && getRecommendedMethod(selectedFile.size) === method.id ? 'ring-2 ring-blue-500 border-blue-300' : ''}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <method.icon className="h-5 w-5" />
                {method.title}
                {selectedFile && getRecommendedMethod(selectedFile.size) === method.id && (
                  <Badge variant="secondary" className="ml-auto">
                    Recommended
                  </Badge>
                )}
              </CardTitle>
              <p className="text-sm text-gray-600">{method.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Features:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {method.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-gray-400 rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2">Best for:</h4>
                <div className="flex flex-wrap gap-1">
                  {method.recommended.map((rec, idx) => (
                    <Badge key={idx} variant="outline" className={method.color}>
                      {rec}
                    </Badge>
                  ))}
                </div>
              </div>

              <Link href={method.route}>
                <Button className="w-full">
                  <method.icon className="mr-2 h-4 w-4" />
                  Use This Method
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5" />
            Upload Tips & Troubleshooting
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tips" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tips">General Tips</TabsTrigger>
              <TabsTrigger value="troubleshoot">Troubleshooting</TabsTrigger>
              <TabsTrigger value="specs">File Specs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tips" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium">For Large Files (over 100MB):</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Use compression to reduce size by 70-80%</li>
                    <li>• Upload during off-peak hours</li>
                    <li>• Ensure stable internet connection</li>
                    <li>• Close other bandwidth-heavy applications</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">For Slow Connections:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Use ultra small chunks (256KB)</li>
                    <li>• Enable sequential upload mode</li>
                    <li>• Consider compression first</li>
                    <li>• Upload overnight if possible</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="troubleshoot" className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-medium text-red-900">413 Entity Too Large Error:</h4>
                  <p className="text-sm text-red-700 mt-1">Switch to ultra small chunks or compress the video first.</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium text-yellow-900">Upload Keeps Failing:</h4>
                  <p className="text-sm text-yellow-700 mt-1">Try the sequential upload mode or reduce chunk size further.</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">Very Slow Upload:</h4>
                  <p className="text-sm text-blue-700 mt-1">Use compression to reduce file size, then upload the smaller file.</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="specs" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Supported Formats:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>MP4</span>
                      <Badge variant="outline">Recommended</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>AVI</span>
                      <Badge variant="outline">Supported</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>MOV</span>
                      <Badge variant="outline">Supported</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>WMV</span>
                      <Badge variant="outline">Supported</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>WEBM</span>
                      <Badge variant="outline">Supported</Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Recommended Settings:</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>Resolution: 1280x720 (HD) or lower</div>
                    <div>Bitrate: 1-5 Mbps</div>
                    <div>Frame Rate: 30fps or lower</div>
                    <div>Audio: AAC, 128kbps</div>
                    <div>Max File Size: 500MB</div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}