# Android Studio Quick Start for Nalamini

## Essential Steps for New Android Studio Users

### 1. Prepare Your Android Phone
**Enable Developer Mode:**
- Settings → About Phone → Tap "Build Number" 7 times
- Go back → Developer Options → Enable "USB Debugging"
- Connect phone with USB cable
- Allow USB debugging when prompted

### 2. Open Project in Android Studio
```bash
# Navigate to your project
cd /path/to/nalamini-project

# Open Android Studio
npx cap open android
```

**Alternative:** Launch Android Studio → Open → Select "android" folder

### 3. Initial Setup
- Wait for Gradle sync (2-5 minutes)
- Install missing SDK components when prompted
- Verify your device appears in device dropdown

### 4. Test App on Device
- Click green "Run" button
- Select your connected device
- App installs and launches automatically

### 5. Build Release Version
**For Play Store submission:**
- Build → Generate Signed Bundle/APK
- Choose "Android App Bundle"
- Create keystore (save passwords securely)
- Build takes 5-10 minutes
- Output: `android/app/build/outputs/bundle/release/app-release.aab`

### 6. Key Testing Points
- All 7 services accessible (taxi, delivery, rental, products, grocery, recharge, recycling)
- Camera works for document uploads
- Location permission granted for GPS services
- Tamil Nadu district/taluk navigation functions
- YouTube management videos load properly

Your Nalamini app includes authentic Tamil Nadu administrative data across 38 districts with comprehensive service integration and native Android capabilities for immediate Play Store deployment.