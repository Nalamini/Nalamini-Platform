# Android Device Testing Guide for Nalamini

## Part 1: Preparing Your Android Device

### Enable Developer Options
1. **Go to Settings** on your Android phone
2. **Scroll to "About Phone"** or "About Device"
3. **Find "Build Number"** (usually at bottom)
4. **Tap "Build Number" 7 times rapidly**
5. You'll see message "You are now a developer!"

### Enable USB Debugging
1. **Go back to main Settings**
2. **Find "Developer Options"** (now visible)
3. **Turn on "Developer Options"** toggle
4. **Find "USB Debugging"** and enable it
5. **Also enable "Install via USB"** (if available)

### Connect Device to Computer
1. **Use USB cable** to connect phone to computer
2. **On phone**: Allow USB debugging popup
3. **Select "File Transfer" or "MTP"** mode when prompted
4. **Computer should recognize device**

## Part 2: Opening Project in Android Studio

### Method 1: Direct Command (Preferred)
```bash
# Navigate to your project folder
cd /path/to/your/nalamini-project

# Open Android Studio with project
npx cap open android
```

### Method 2: Manual Opening
1. **Launch Android Studio**
2. **Click "Open"** or File → Open
3. **Navigate to your project folder**
4. **Select the "android" folder** (inside main project)
5. **Click "Open"**

### First-Time Setup
- **Wait for Gradle sync** (2-5 minutes)
- **Install missing components** when prompted
- **Accept license agreements**
- **Wait for "Gradle sync finished"**

## Part 3: Running App on Device

### Verify Device Connection
1. **In Android Studio**, look at top toolbar
2. **Device dropdown** should show your phone model
3. **If not visible**: 
   - Unplug and reconnect USB
   - Check USB debugging is enabled
   - Try different USB cable

### Run the App
1. **Click green "Run" button** (play icon) in toolbar
2. **Or use menu**: Run → Run 'app'
3. **Select your device** from popup
4. **Click "OK"**

### Installation Process
- **Gradle builds app** (2-3 minutes first time)
- **Transfers APK to device**
- **Installs automatically**
- **App launches on phone**

## Part 4: Testing Nalamini Features

### Core Features to Test
1. **App Launch**
   - App opens without crashes
   - Splash screen displays correctly
   - Main dashboard loads

2. **Service Access**
   - Taxi booking interface
   - Delivery request form
   - Local products browsing
   - Grocery ordering
   - Mobile recharge
   - Rental services
   - Recycling requests

3. **Mobile-Specific Features**
   - **Camera**: Test document upload
   - **Location**: Allow GPS access, verify location detection
   - **Notifications**: Check if permission requested
   - **Phone calls**: Test calling service providers

4. **Navigation**
   - District selection (Tamil Nadu)
   - Taluk selection within districts
   - Pincode-based searches
   - Opportunities forum access

5. **YouTube Integration**
   - Management videos load properly
   - Videos play without issues

### Testing Checklist
- [ ] App installs successfully
- [ ] All 7 services accessible
- [ ] Camera opens for photo capture
- [ ] Location permission works
- [ ] District/taluk navigation functional
- [ ] YouTube videos load
- [ ] No crashes during normal use
- [ ] Payment flow accessible
- [ ] Service provider registration works

## Part 5: Building Signed APK for Distribution

### Generate Signed Bundle/APK
1. **In Android Studio**: Build → Generate Signed Bundle / APK
2. **Choose "Android App Bundle"** (for Play Store) or "APK" (for direct install)
3. **Click "Next"**

### Create Keystore (First Time)
```
Keystore Information:
- Keystore path: Choose secure location (e.g., Documents/nalamini-release.jks)
- Password: [Strong password - RECORD THIS]
- Key alias: nalamini-key
- Key password: [Strong password - RECORD THIS]
- Validity: 25 years

Certificate Details:
- First/Last Name: [Your name]
- Organizational Unit: Development
- Organization: Nalamini Services
- City: [Your city]
- State: Tamil Nadu
- Country Code: IN
```

### Build Settings
- **Build Variant**: release
- **Signature Versions**: Check V1 and V2
- **Destination Folder**: Choose output location
- **Click "Finish"**

### Build Process
- **Compilation**: 5-10 minutes
- **Signing**: Automatic with your keystore
- **Output**: Creates signed file

### Locate Built Files
**For Play Store (.aab file):**
```
android/app/build/outputs/bundle/release/app-release.aab
```

**For Direct Install (.apk file):**
```
android/app/build/outputs/apk/release/app-release.apk
```

## Part 6: Installing APK on Device

### Direct Installation
1. **Copy APK file** to phone storage
2. **On phone**: Open file manager
3. **Navigate to APK file**
4. **Tap to install**
5. **Allow "Install from unknown sources"** if prompted

### ADB Installation (Alternative)
```bash
# Install via command line
adb install android/app/build/outputs/apk/release/app-release.apk
```

## Part 7: Troubleshooting Common Issues

### Device Not Recognized
- **Check USB cable** (use data cable, not charging-only)
- **Try different USB port**
- **Restart Android Studio**
- **Revoke and re-grant USB debugging**

### Build Failures
- **Clean project**: Build → Clean Project
- **Invalidate caches**: File → Invalidate Caches and Restart
- **Check SDK versions** in Tools → SDK Manager

### App Crashes
- **Check Logcat** in Android Studio (bottom panel)
- **Look for red error messages**
- **Test individual features** to isolate issues

### Permission Issues
- **Camera not working**: Check camera permission in app settings
- **Location not working**: Enable location permission
- **Storage issues**: Check storage permission

## Part 8: Performance Monitoring

### Check App Performance
- **Memory usage**: Monitor in Android Studio profiler
- **Battery impact**: Check device battery settings
- **Network usage**: Monitor data consumption
- **Startup time**: Measure app launch speed

### User Experience Testing
- **Navigation smoothness**
- **Button responsiveness**
- **Form submission speed**
- **Image loading times**
- **Video playback quality**

## Part 9: Preparing for Play Store

### Final Testing Before Upload
1. **Test on multiple devices** (different Android versions)
2. **Verify all features work**
3. **Check app size** (should be under 150MB)
4. **Test offline functionality**
5. **Verify payment integration**

### File for Play Store Upload
- **Use .aab file** (Android App Bundle)
- **Located at**: android/app/build/outputs/bundle/release/app-release.aab
- **Size typically**: 20-40MB compressed

Your Nalamini app with comprehensive Tamil Nadu service platform, native Android features, and authentic administrative data is now ready for device testing and Play Store distribution.