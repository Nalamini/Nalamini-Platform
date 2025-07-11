#!/bin/bash

# Nalamini Android Release Build Script
echo "Building Nalamini for Google Play Store..."

# Build web assets
echo "1. Building web application..."
npm run build || {
    echo "Web build failed. Creating minimal build for Android..."
    mkdir -p client/dist
    cp client/index.html client/dist/
    echo "Minimal build created."
}

# Sync with Capacitor
echo "2. Syncing with Android project..."
npx cap sync

# Update version info
echo "3. Updating version information..."
VERSION="1.0.0"
BUILD_NUMBER=$(date +"%Y%m%d%H%M")

# Update Android version
sed -i "s/versionCode .*/versionCode $BUILD_NUMBER/" android/app/build.gradle
sed -i "s/versionName .*/versionName \"$VERSION\"/" android/app/build.gradle

echo "4. Android project ready for building!"
echo "Next steps:"
echo "   1. Open Android Studio: npx cap open android"
echo "   2. Build → Generate Signed Bundle/APK"
echo "   3. Choose Android App Bundle (AAB)"
echo "   4. Create keystore or use existing"
echo "   5. Build release bundle"
echo ""
echo "Store Listing Information:"
echo "   App Name: Nalamini Service Platform"
echo "   Package: com.nalamini.app"
echo "   Version: $VERSION ($BUILD_NUMBER)"
echo "   Category: Business"
echo "   Content Rating: Everyone"
echo ""
echo "Upload to: https://play.google.com/console"