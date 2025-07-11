# Alternative APK Build Methods for Nalamini

## Method 1: Direct Gradle Build (No Android Studio)

### Prerequisites
- Java 11 or 17 installed
- Android SDK installed

### Build Commands
```bash
cd android
./gradlew assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release-unsigned.apk`

### Sign APK Manually
```bash
# Create keystore
keytool -genkey -v -keystore nalamini-release.jks -alias nalamini -keyalg RSA -keysize 2048 -validity 10000

# Sign APK
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore nalamini-release.jks app-release-unsigned.apk nalamini

# Align APK
zipalign -v 4 app-release-unsigned.apk nalamini-release.apk
```

## Method 2: Online APK Builder

### Ionic AppFlow (Free Tier)
1. Create account at ionicframework.com/appflow
2. Connect GitHub repository
3. Configure build settings
4. Download signed APK

### Capacitor Cloud Build
1. Upload project to GitHub
2. Use GitHub Actions for automated builds
3. Configure signing certificates
4. Download from CI/CD pipeline

## Method 3: Simplified Local Build

### Install Android SDK Only
```bash
# Download command line tools
wget https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip

# Extract and setup
unzip commandlinetools-linux-9477386_latest.zip
export ANDROID_HOME=$PWD/cmdline-tools
export PATH=$PATH:$ANDROID_HOME/bin

# Install build tools
sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.0"
```

### Build APK
```bash
cd android
chmod +x gradlew
./gradlew assembleDebug
```

## Method 4: Web Distribution (Alternative)

### Progressive Web App (PWA)
- Deploy to web hosting
- Users install via browser
- Works on Android without app store

### Direct APK Download
- Build once using any method
- Host APK file for direct download
- Users install via "Unknown Sources"

## Method 5: GitHub Actions Build

### Create .github/workflows/android.yml
```yaml
name: Android Build

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build web assets
      run: npm run build
      
    - name: Setup Android SDK
      uses: android-actions/setup-android@v2
      
    - name: Build APK
      run: |
        cd android
        ./gradlew assembleRelease
        
    - name: Upload APK
      uses: actions/upload-artifact@v2
      with:
        name: nalamini-release
        path: android/app/build/outputs/apk/release/
```

## Quick Start Options

### Immediate Solutions
1. **Use Appetize.io**: Upload APK for web-based testing
2. **Deploy as PWA**: Host on Vercel/Netlify for web access
3. **GitHub Actions**: Automated builds in cloud
4. **Local command line**: Build without Android Studio GUI

### For Play Store Submission
- Any signed APK works for Google Play Console
- AAB format preferred but APK acceptable
- Upload via web interface at play.google.com/console

Your Nalamini platform with authentic Tamil Nadu data and comprehensive services can be built using any of these alternative methods.