# Nalamini Service Platform - Deployment & Mobile App Guide

## 🌐 Web App Deployment

### Option 1: Vercel (Recommended)
1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables:
     - `DATABASE_URL`
     - `YOUTUBE_API_KEY`
     - `YOUTUBE_CHANNEL_ID`
     - `RAZORPAY_KEY_ID`
     - `RAZORPAY_KEY_SECRET`

3. **Database Setup**
   - Use Neon PostgreSQL (free tier)
   - Or Supabase PostgreSQL
   - Run `npm run db:push` after deployment

### Option 2: Railway
1. **Connect GitHub to Railway**
   - Visit [railway.app](https://railway.app)
   - Import your repository
   - Railway auto-detects Node.js

2. **Add PostgreSQL**
   - Add PostgreSQL service in Railway
   - Copy connection string to `DATABASE_URL`

### Option 3: Render
1. **Create Web Service**
   - Go to [render.com](https://render.com)
   - Connect GitHub repository
   - Build command: `npm install && npm run build`
   - Start command: `npm start`

## 📱 Android App Conversion

### Option 1: PWA (Progressive Web App) - Easiest
**Benefits**: Uses existing web code, installable on Android, offline support

1. **Add PWA Configuration**
   ```json
   // Add to client/public/manifest.json
   {
     "name": "Nalamini Service Platform",
     "short_name": "Nalamini",
     "description": "Sustainable transportation and service platform",
     "start_url": "/",
     "display": "standalone",
     "background_color": "#ffffff",
     "theme_color": "#3b82f6",
     "icons": [
       {
         "src": "/icon-192.png",
         "sizes": "192x192",
         "type": "image/png"
       },
       {
         "src": "/icon-512.png",
         "sizes": "512x512",
         "type": "image/png"
       }
     ]
   }
   ```

2. **Add Service Worker**
   - Enables offline functionality
   - Push notifications
   - Background sync

### Option 2: React Native with Expo (Recommended for Native App)
**Benefits**: True native app, shared codebase, app store distribution

1. **Initialize Expo Project**
   ```bash
   npx create-expo-app nalamini-mobile
   cd nalamini-mobile
   ```

2. **Shared Components Strategy**
   ```
   shared/
   ├── components/     # Reusable UI components
   ├── hooks/         # Custom hooks
   ├── utils/         # Helper functions
   ├── types/         # TypeScript definitions
   └── api/           # API client
   ```

3. **Install Dependencies**
   ```bash
   npx expo install expo-router expo-sqlite expo-notifications
   npm install @tanstack/react-query axios
   ```

### Option 3: Capacitor (Web-to-Mobile Wrapper)
**Benefits**: Minimal code changes, web app in native container

1. **Add Capacitor**
   ```bash
   npm install @capacitor/core @capacitor/cli
   npx cap init nalamini com.nalamini.app
   ```

2. **Add Android Platform**
   ```bash
   npm install @capacitor/android
   npx cap add android
   npx cap sync
   ```

3. **Open in Android Studio**
   ```bash
   npx cap open android
   ```

## 🏗️ Development Workflow

### For Web + PWA
1. Deploy web app to production
2. Add PWA manifest and service worker
3. Users can install from browser

### For Native Mobile App
1. Set up shared component library
2. Create React Native/Expo app
3. Share business logic and API calls
4. Design mobile-specific UI/UX
5. Test on devices
6. Publish to Google Play Store

## 📋 Pre-Deployment Checklist

### Web App
- [ ] Environment variables configured
- [ ] Database schema deployed
- [ ] YouTube API integration tested
- [ ] Payment system (Razorpay) configured
- [ ] SSL certificate (automatic with Vercel/Railway)

### Mobile App
- [ ] App icons designed (192x192, 512x512)
- [ ] Splash screen created
- [ ] Push notification setup
- [ ] Android permissions configured
- [ ] App signing configured for Play Store

## 🚀 Recommended Deployment Strategy

1. **Phase 1**: Deploy web app on Vercel
2. **Phase 2**: Convert to PWA for mobile users
3. **Phase 3**: Build native React Native app for app stores

This approach allows you to:
- Get to market quickly with web app
- Provide mobile experience via PWA
- Eventually launch full native app

## 📱 Mobile-Specific Considerations

### User Experience
- Touch-friendly interface
- Offline functionality
- Push notifications for service updates
- GPS integration for location services
- Camera for document uploads

### Performance
- Image optimization
- Lazy loading
- Local storage for frequently accessed data
- Background sync for form submissions

### Security
- Secure storage for tokens
- Biometric authentication
- Certificate pinning for API calls