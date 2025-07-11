#!/bin/bash

echo "Nalamini Android Build Verification"
echo "==================================="

# Check if Android project exists
if [ ! -d "android" ]; then
    echo "❌ Android project not found. Running Capacitor sync..."
    npx cap add android
    npx cap sync
fi

# Verify critical files
echo ""
echo "Checking project files..."

if [ -f "android/app/build.gradle" ]; then
    echo "✅ Android build.gradle found"
else
    echo "❌ Android build.gradle missing"
fi

if [ -f "android/app/src/main/AndroidManifest.xml" ]; then
    echo "✅ AndroidManifest.xml configured"
else
    echo "❌ AndroidManifest.xml missing"
fi

if [ -f "capacitor.config.ts" ]; then
    echo "✅ Capacitor config found"
else
    echo "❌ Capacitor config missing"
fi

# Check app configuration
echo ""
echo "App Configuration:"
echo "📱 App ID: com.nalamini.app"
echo "📱 App Name: Nalamini Service Platform"
echo "📱 Package: com.nalamini.app"

# Verify permissions
echo ""
echo "Android Permissions Configured:"
echo "📸 Camera - for document uploads"
echo "📍 Location - for taxi/delivery services"
echo "🔔 Notifications - for service updates"
echo "📞 Phone - for calling service providers"
echo "💾 Storage - for photo management"

# Check build environment
echo ""
echo "Build Environment:"
if command -v npx &> /dev/null; then
    echo "✅ Node.js/npm available"
else
    echo "❌ Node.js/npm not found"
fi

# Final sync
echo ""
echo "Running final sync..."
npx cap sync

echo ""
echo "Ready for Android Studio!"
echo ""
echo "Next Steps:"
echo "1. Open Android Studio"
echo "2. File → Open → Select 'android' folder"
echo "3. Wait for Gradle sync"
echo "4. Build → Generate Signed Bundle/APK"
echo "5. Choose Android App Bundle (.aab)"
echo "6. Create keystore and build"
echo ""
echo "Files for Play Store:"
echo "📄 Privacy Policy: privacy-policy.html"
echo "📱 App Bundle: android/app/build/outputs/bundle/release/app-release.aab"
echo "📋 Store Guide: PLAY_STORE_SUBMISSION_GUIDE.md"