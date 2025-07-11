import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { PushNotifications } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { StatusBar, Style } from '@capacitor/status-bar';

export const useCapacitor = () => {
  const [isNativeApp, setIsNativeApp] = useState(false);
  const [permissions, setPermissions] = useState({
    camera: false,
    location: false,
    notifications: false,
  });

  useEffect(() => {
    setIsNativeApp(Capacitor.isNativePlatform());
    
    if (Capacitor.isNativePlatform()) {
      initializeNativeFeatures();
    }
  }, []);

  const initializeNativeFeatures = async () => {
    // Set status bar style
    await StatusBar.setStyle({ style: Style.Dark });
    
    // Request permissions
    try {
      const cameraPermission = await Camera.requestPermissions();
      const locationPermission = await Geolocation.requestPermissions();
      const notificationPermission = await PushNotifications.requestPermissions();
      
      setPermissions({
        camera: cameraPermission.camera === 'granted',
        location: locationPermission.location === 'granted',
        notifications: notificationPermission.receive === 'granted',
      });

      // Setup push notifications
      if (notificationPermission.receive === 'granted') {
        await PushNotifications.register();
      }
    } catch (error) {
      console.log('Permission request error:', error);
    }
  };

  const takePicture = async (source: CameraSource = CameraSource.Camera) => {
    if (!permissions.camera) {
      throw new Error('Camera permission not granted');
    }

    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: source,
      });
      
      await Haptics.impact({ style: ImpactStyle.Light });
      return image.webPath;
    } catch (error) {
      console.error('Camera error:', error);
      throw error;
    }
  };

  const getCurrentLocation = async () => {
    if (!permissions.location) {
      throw new Error('Location permission not granted');
    }

    try {
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      });
      
      return {
        latitude: coordinates.coords.latitude,
        longitude: coordinates.coords.longitude,
        accuracy: coordinates.coords.accuracy,
      };
    } catch (error) {
      console.error('Location error:', error);
      throw error;
    }
  };

  const scheduleNotification = async (title: string, body: string, delay: number = 0) => {
    if (!permissions.notifications) {
      throw new Error('Notification permission not granted');
    }

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title,
            body,
            id: Date.now(),
            schedule: delay > 0 ? { at: new Date(Date.now() + delay) } : undefined,
            sound: 'beep.wav',
            attachments: undefined,
            actionTypeId: '',
            extra: null,
          },
        ],
      });
    } catch (error) {
      console.error('Notification error:', error);
      throw error;
    }
  };

  const vibrate = async (type: 'light' | 'medium' | 'heavy' = 'medium') => {
    if (!isNativeApp) return;
    
    const styles = {
      light: ImpactStyle.Light,
      medium: ImpactStyle.Medium,
      heavy: ImpactStyle.Heavy,
    };

    try {
      await Haptics.impact({ style: styles[type] });
    } catch (error) {
      console.error('Haptics error:', error);
    }
  };

  return {
    isNativeApp,
    permissions,
    takePicture,
    getCurrentLocation,
    scheduleNotification,
    vibrate,
  };
};