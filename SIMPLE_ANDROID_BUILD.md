# Simple Android Studio Build for Nalamini

## Quick Steps to Build Your App

### 1. Open Your Project
1. Launch Android Studio
2. Click "Open an Existing Project"
3. Navigate to your project folder
4. Select the `android` folder (inside your main project)
5. Click "OK"

### 2. Wait for Setup
- Android Studio will sync automatically (2-5 minutes)
- Install any missing components when prompted
- Wait until you see "Gradle sync finished" at bottom

### 3. Build Release Version
1. Go to **Build** menu → **Generate Signed Bundle / APK**
2. Choose **Android App Bundle** → Next
3. Click **Create new** (for keystore)

### 4. Create Keystore (One-time setup)
Fill these details:
```
Keystore path: Choose where to save (like Desktop/nalamini-key.jks)
Password: [Create strong password - WRITE THIS DOWN]

Key alias: nalamini  
Key password: [Create strong password - WRITE THIS DOWN]
Validity: 25 years

Your name: [Your actual name]
Organization: Nalamini
City: [Your city]
State: Tamil Nadu
Country: IN
```

**CRITICAL**: Save these passwords safely - you need them for future updates!

### 5. Generate App
1. Select "release" 
2. Check V1 and V2 signatures
3. Click "Finish"
4. Wait 5-10 minutes for build

### 6. Find Your App File
Built file location: `android/app/build/outputs/bundle/release/app-release.aab`

This `.aab` file is what you upload to Google Play Store.

## Testing First
Before uploading:
1. Connect Android phone via USB
2. Enable "Developer Options" and "USB Debugging" 
3. Click green "Run" button in Android Studio
4. Test all features work properly

## If Something Goes Wrong
- Check bottom panel for error messages
- Try: Build → Clean Project, then rebuild
- Ensure all Android SDK components installed

Your app is ready for Play Store once the .aab file builds successfully!