import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import { useCapacitor } from '@/hooks/use-capacitor';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  address?: string;
}

interface LocationPickerProps {
  onLocationSelect: (location: LocationData) => void;
  onCancel?: () => void;
  title?: string;
  description?: string;
}

export default function LocationPicker({
  onLocationSelect,
  onCancel,
  title = "Select Location",
  description = "Choose pickup/delivery location"
}: LocationPickerProps) {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isNativeApp, permissions, getCurrentLocation, vibrate } = useCapacitor();

  const handleGetCurrentLocation = async () => {
    if (!permissions.location) {
      setError('Location permission required. Please enable it in app settings.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await vibrate('light');
      const location = await getCurrentLocation();
      
      // Reverse geocoding to get address (simplified)
      const address = `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
      
      const locationData: LocationData = {
        ...location,
        address
      };

      setCurrentLocation(locationData);
      await vibrate('medium');
    } catch (error) {
      console.error('Location error:', error);
      setError('Failed to get location. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseLocation = () => {
    if (currentLocation) {
      onLocationSelect(currentLocation);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <span>{title}</span>
        </CardTitle>
        <p className="text-sm text-gray-600">{description}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {currentLocation ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-green-800">Location Found</p>
                <p className="text-sm text-green-600">{currentLocation.address}</p>
                <p className="text-xs text-green-500 mt-1">
                  Accuracy: ±{Math.round(currentLocation.accuracy)}m
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No location selected</p>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          <Button
            onClick={handleGetCurrentLocation}
            disabled={isLoading || (isNativeApp && !permissions.location)}
            className="w-full flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Navigation className="h-4 w-4" />
            )}
            <span>
              {isLoading ? 'Getting Location...' : 'Use Current Location'}
            </span>
          </Button>

          {currentLocation && (
            <Button
              onClick={handleUseLocation}
              className="w-full"
            >
              Use This Location
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

        {!permissions.location && isNativeApp && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800">
              Location permission required for automatic location detection.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}