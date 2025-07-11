import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, ImageIcon, X } from 'lucide-react';
import { useCapacitor } from '@/hooks/use-capacitor';
import { CameraSource } from '@capacitor/camera';

interface CameraCaptureProps {
  onImageCapture: (imageUrl: string) => void;
  onCancel?: () => void;
  title?: string;
  description?: string;
}

export default function CameraCapture({ 
  onImageCapture, 
  onCancel, 
  title = "Capture Document",
  description = "Take a photo or select from gallery"
}: CameraCaptureProps) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const { isNativeApp, permissions, takePicture, vibrate } = useCapacitor();

  const handleCapture = async (source: CameraSource) => {
    if (!permissions.camera) {
      alert('Camera permission is required. Please enable it in app settings.');
      return;
    }

    setIsCapturing(true);
    try {
      await vibrate('light');
      const imageUrl = await takePicture(source);
      if (imageUrl) {
        setCapturedImage(imageUrl);
        onImageCapture(imageUrl);
        await vibrate('medium');
      }
    } catch (error) {
      console.error('Camera capture failed:', error);
      alert('Failed to capture image. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleWebCapture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          setCapturedImage(imageUrl);
          onImageCapture(imageUrl);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  if (capturedImage) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-4">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold">Image Captured</h3>
          </div>
          <div className="relative mb-4">
            <img 
              src={capturedImage} 
              alt="Captured" 
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              onClick={() => setCapturedImage(null)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={() => setCapturedImage(null)}
              variant="outline" 
              className="flex-1"
            >
              Retake
            </Button>
            <Button 
              onClick={() => onCancel?.()}
              className="flex-1"
            >
              Use Image
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>

        <div className="space-y-3">
          {isNativeApp ? (
            <>
              <Button
                onClick={() => handleCapture(CameraSource.Camera)}
                disabled={isCapturing || !permissions.camera}
                className="w-full flex items-center justify-center space-x-2"
              >
                <Camera className="h-5 w-5" />
                <span>{isCapturing ? 'Opening Camera...' : 'Take Photo'}</span>
              </Button>

              <Button
                onClick={() => handleCapture(CameraSource.Photos)}
                disabled={isCapturing || !permissions.camera}
                variant="outline"
                className="w-full flex items-center justify-center space-x-2"
              >
                <ImageIcon className="h-5 w-5" />
                <span>Choose from Gallery</span>
              </Button>
            </>
          ) : (
            <Button
              onClick={handleWebCapture}
              className="w-full flex items-center justify-center space-x-2"
            >
              <ImageIcon className="h-5 w-5" />
              <span>Select Image</span>
            </Button>
          )}

          {onCancel && (
            <Button
              onClick={onCancel}
              variant="ghost"
              className="w-full"
            >
              Cancel
            </Button>
          )}
        </div>

        {!permissions.camera && isNativeApp && (
          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800">
              Camera permission required. Please enable it in your device settings.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}