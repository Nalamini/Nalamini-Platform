import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nalamini.app',
  appName: 'Nalamini Service Platform',
  webDir: 'client/dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: "#3b82f6",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      spinnerColor: "#ffffff"
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#3b82f6"
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#3b82f6",
      sound: "beep.wav"
    },
    Camera: {
      permissions: {
        camera: "Camera access is required for document uploads and profile pictures."
      }
    },
    Geolocation: {
      permissions: {
        location: "Location access is required for taxi services and delivery tracking."
      }
    }
  }
};

export default config;
