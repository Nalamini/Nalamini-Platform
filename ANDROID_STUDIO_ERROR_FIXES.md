# Android Studio Common Errors and Fixes

## Indentation/Formatting Errors

### Problem: Indentation setting warnings in build.gradle
**Cause:** Android Studio detects inconsistent spacing in Gradle files

**Quick Fix:**
1. **In Android Studio**: Code → Reformat Code (Ctrl+Alt+L)
2. **Or manually**: File → Settings → Editor → Code Style → Set to 4 spaces
3. **Clean project**: Build → Clean Project → Rebuild Project

### Problem: Gradle sync failures
**Solutions:**
1. **Invalidate caches**: File → Invalidate Caches and Restart
2. **Check internet connection** for dependency downloads
3. **Update Gradle wrapper**: File → Project Structure → Project

## Build Configuration Fixes

### Update build.gradle for consistent formatting
**Location:** `android/app/build.gradle`

**Ensure proper indentation:**
```gradle
android {
    namespace "com.nalamini.app"
    compileSdk 34
    
    defaultConfig {
        applicationId "com.nalamini.app"
        minSdkVersion 21
        targetSdkVersion 34
        versionCode 1
        versionName "1.0.0"
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }
    
    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

## Dependency Issues

### Missing SDK components
**Fix in Android Studio:**
1. Tools → SDK Manager
2. Install latest Android SDK Platform
3. Install Android SDK Build-Tools
4. Install Google Play Services

### Capacitor plugin errors
**Terminal commands:**
```bash
npx cap sync android
npx cap update
```

## Device Connection Issues

### Device not recognized
**Steps:**
1. Enable USB Debugging on phone
2. Use data-capable USB cable
3. Install device drivers on computer
4. Restart Android Studio

### Permission errors during installation
**Phone settings:**
- Settings → Security → Install from Unknown Sources (enable)
- Settings → Apps → Special Access → Install Unknown Apps

## Build Errors

### Gradle build failures
**Solutions:**
1. **Clean build**: Build → Clean Project
2. **Check Java version**: File → Project Structure → SDK Location
3. **Update Gradle**: gradle/wrapper/gradle-wrapper.properties

### Keystore creation issues
**Requirements:**
- Use simple file path (no special characters)
- Strong passwords (8+ characters)
- Valid certificate information
- Sufficient disk space

## Runtime Errors

### App crashes on launch
**Debug steps:**
1. Check Logcat in Android Studio (bottom panel)
2. Look for red error messages
3. Verify all permissions granted
4. Test on different Android versions

### Features not working
**Common fixes:**
- **Camera**: Check camera permission in app settings
- **Location**: Enable GPS and location permission
- **Notifications**: Allow notification permission
- **Storage**: Grant file access permission

## Project Structure Issues

### Missing files or folders
**Regenerate Android project:**
```bash
npx cap add android --force
npx cap sync
```

### Corrupted project state
**Fresh start:**
1. Delete `android` folder
2. Run `npx cap add android`
3. Run `npx cap sync`
4. Reopen in Android Studio

## Performance Optimization

### Slow build times
**Improvements:**
1. Enable offline mode: File → Settings → Build → Gradle → Offline work
2. Increase memory: Help → Edit Custom VM Options
3. Disable unnecessary plugins: File → Settings → Plugins

### Large APK size
**Reduce size:**
1. Enable ProGuard in release builds
2. Use App Bundle instead of APK
3. Optimize images and assets

## Final Checklist Before Release

**Pre-build verification:**
- [ ] All code compiles without warnings
- [ ] Gradle sync completes successfully
- [ ] App runs on connected device
- [ ] All features tested and working
- [ ] Keystore created and passwords saved
- [ ] Version numbers updated

**Build process:**
- [ ] Build → Generate Signed Bundle/APK
- [ ] Choose Android App Bundle (.aab)
- [ ] Use release keystore
- [ ] Verify output file created
- [ ] Test install APK on device

Your Nalamini app with comprehensive Tamil Nadu service platform is ready for successful Android Studio build and Play Store submission.