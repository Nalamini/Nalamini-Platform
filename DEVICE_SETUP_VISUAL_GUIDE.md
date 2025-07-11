# Visual Device Setup Guide for Nalamini Testing

## Phone Preparation Steps

### Step 1: Enable Developer Mode
**On your Android phone:**
1. Open **Settings** app
2. Scroll down to **"About phone"** or **"About device"**
3. Look for **"Build number"** (usually at the bottom)
4. **Tap "Build number" quickly 7 times**
5. You'll see: **"You are now a developer!"**

### Step 2: Enable USB Debugging
1. Go back to main **Settings**
2. Look for **"Developer options"** (now visible)
3. Tap **"Developer options"**
4. Turn on the **main toggle** at top
5. Find **"USB debugging"** and **turn it ON**
6. Also enable **"Install via USB"** if you see it

### Step 3: Connect to Computer
1. Use **USB cable** (must be data cable, not charging-only)
2. Connect phone to your computer
3. **On phone**: You'll see popup asking about USB debugging
4. **Tap "Allow"** or **"Always allow from this computer"**
5. Choose **"File transfer"** or **"MTP"** when connection options appear

## Android Studio Setup

### Opening Your Project
1. **Launch Android Studio**
2. **Wait for it to fully load**
3. Choose one method:

**Method A - Command Line:**
```bash
# In your project folder
npx cap open android
```

**Method B - Manual:**
- Click **"Open"** in Android Studio
- Navigate to your project
- Select the **"android"** folder (not the main project folder)
- Click **"Open"**

### First-Time Project Setup
**When project opens:**
1. **Wait for Gradle sync** (progress bar at bottom)
2. **Install any missing components** when prompted
3. **Accept license agreements**
4. **Wait for "Gradle sync finished"** message

## Running Your App

### Verify Device Connection
**Look at Android Studio toolbar:**
- **Device dropdown** (next to Run button) should show your phone model
- Example: "Samsung Galaxy S21" or "Pixel 6"

**If your device doesn't appear:**
- Unplug and reconnect USB cable
- Check USB debugging is still enabled
- Try a different USB cable
- Restart Android Studio

### Install and Test App
1. **Click green "Run" button** (triangle play icon)
2. **Select your device** from the popup list
3. **Click "OK"**

**What happens:**
- Android Studio builds the app (2-3 minutes)
- Transfers APK to your phone
- Automatically installs
- App launches on your phone

## Testing Nalamini Features

### Essential Tests
**When app opens on your phone:**

1. **Main Dashboard**
   - All 7 service icons visible
   - Taxi, Delivery, Rental, Local Products, Grocery, Recharge, Recycling

2. **Camera Test**
   - Try uploading a document or photo
   - Camera should open properly
   - Photo capture and save works

3. **Location Test**
   - Grant location permission when asked
   - Verify your current location is detected
   - Test district selection for Tamil Nadu

4. **Service Booking**
   - Try booking a taxi
   - Fill out delivery request
   - Browse local products

5. **Navigation**
   - District dropdown works
   - Taluk selection functions
   - Opportunities forum accessible

## Building Release APK

### Generate Signed Version
**In Android Studio:**
1. **Build menu** → **"Generate Signed Bundle / APK"**
2. Choose **"Android App Bundle"** (for Play Store)
3. Click **"Next"**

### Create Keystore (One-time setup)
**Fill these fields carefully:**
```
Keystore path: [Choose safe location like Documents/nalamini-key.jks]
Password: [Strong password - WRITE DOWN]
Confirm: [Same password]

Key alias: nalamini
Key password: [Strong password - WRITE DOWN]
Confirm: [Same password]
Validity: 25

Certificate:
First and Last Name: [Your real name]
Organizational Unit: Development
Organization: Nalamini
City or Locality: [Your city]
State or Province: Tamil Nadu
Country Code (XX): IN
```

**CRITICAL:** Save keystore file and passwords securely. You need them for all future app updates.

### Complete Build
1. **Build variant:** release
2. **Signature Versions:** Check both V1 and V2
3. **Destination folder:** Choose where to save
4. **Click "Finish"**
5. **Wait 5-10 minutes** for build completion

### Locate Your App File
**For Play Store submission:**
```
Location: android/app/build/outputs/bundle/release/app-release.aab
File size: Usually 20-40MB
```

**For direct installation:**
```
Location: android/app/build/outputs/apk/release/app-release.apk
File size: Usually 30-50MB
```

## Installation Testing

### Install APK Directly
1. **Copy APK file** to your phone
2. **Open file manager** on phone
3. **Navigate to APK file**
4. **Tap to install**
5. **Allow installation** from unknown sources if prompted

### Verify Installation
- App appears in phone's app drawer
- Icon displays correctly
- App launches without crashes
- All features accessible

## Common Issues and Solutions

### Device Not Detected
**Problem:** Phone doesn't appear in Android Studio
**Solutions:**
- Use different USB cable (must support data transfer)
- Check USB debugging is enabled
- Try different USB port on computer
- Restart both phone and Android Studio

### Build Errors
**Problem:** App won't compile
**Solutions:**
- Build → Clean Project
- File → Invalidate Caches and Restart
- Check internet connection for dependency downloads

### App Crashes on Phone
**Problem:** App closes immediately after opening
**Solutions:**
- Check Android Studio Logcat for error messages
- Verify all permissions granted
- Test individual features to isolate problem

### Keystore Issues
**Problem:** Can't create or use keystore
**Solutions:**
- Choose simple path without special characters
- Use strong but memorable passwords
- Ensure you have write permissions to chosen folder

## Pre-Upload Checklist

**Before submitting to Play Store:**
- [ ] App installs successfully on real device
- [ ] All 7 services work properly
- [ ] Camera and location permissions function
- [ ] No crashes during normal usage
- [ ] Tamil Nadu district data loads correctly
- [ ] YouTube videos play in management section
- [ ] Payment flow is accessible
- [ ] App responds quickly to user interactions

Your Nalamini app with authentic Tamil Nadu administrative data and comprehensive service platform is now ready for device testing and Play Store submission.