# Android Studio Setup Guide for Nalamini

## Step 1: Opening Your Project in Android Studio

### Option A: Manual Opening (Recommended for first time)
1. **Launch Android Studio**
   - Open Android Studio from your applications menu
   - If you see a welcome screen, click "Open an Existing Project"
   - If Android Studio is already open, go to File → Open

2. **Navigate to Project**
   - Browse to your project folder
   - Navigate to: `your-project-folder/android`
   - Select the `android` folder (not the root project folder)
   - Click "OK"

### Option B: Command Line (Alternative)
```bash
# Set Android Studio path (adjust for your installation)
export CAPACITOR_ANDROID_STUDIO_PATH="/Applications/Android Studio.app/Contents/MacOS/studio"

# Or for Linux:
export CAPACITOR_ANDROID_STUDIO_PATH="/opt/android-studio/bin/studio.sh"

# Or for Windows:
export CAPACITOR_ANDROID_STUDIO_PATH="C:\Program Files\Android\Android Studio\bin\studio64.exe"

# Then open project
npx cap open android
```

## Step 2: First-Time Setup in Android Studio

### When Project Opens:
1. **Gradle Sync**
   - Android Studio will automatically start syncing Gradle
   - You'll see "Gradle sync in progress..." at the bottom
   - Wait for this to complete (2-5 minutes first time)

2. **Install Missing Components**
   - If prompted, install any missing SDK components
   - Click "Install" for any suggested downloads
   - Accept license agreements

3. **Project Structure**
   - You should see your project in the left panel
   - Main folders: `app`, `gradle`, `build.gradle` files

## Step 3: Building Release APK/AAB

### Method 1: Using Android Studio Menu (Easiest)

1. **Go to Build Menu**
   - Click "Build" in top menu bar
   - Select "Generate Signed Bundle / APK..."

2. **Choose Bundle Type**
   - Select "Android App Bundle" (recommended for Play Store)
   - Or select "APK" if you prefer
   - Click "Next"

3. **Create New Keystore** (First time only)
   - Click "Create new..."
   - Choose location to save keystore file
   - **IMPORTANT**: Save this file securely - you'll need it for all future updates

   **Keystore Details to Fill:**
   ```
   Keystore path: /path/to/nalamini-release-key.jks
   Password: [Create strong password - SAVE THIS]
   
   Key alias: nalamini
   Password: [Create strong password - SAVE THIS]
   Validity (years): 25
   
   Certificate:
   First and Last Name: [Your name]
   Organizational Unit: Development
   Organization: Nalamini Services
   City or Locality: [Your city]
   State or Province: Tamil Nadu
   Country Code: IN
   ```

4. **Build Settings**
   - Select "release" build variant
   - Check both signature versions (V1 and V2)
   - Click "Next"

5. **Generate**
   - Choose destination folder for output
   - Click "Finish"
   - Wait for build to complete (5-10 minutes)

### Method 2: Using Gradle Commands (Advanced)

```bash
# In Android Studio terminal or external terminal
cd android

# For APK
./gradlew assembleRelease

# For App Bundle (recommended)
./gradlew bundleRelease
```

## Step 4: Locating Your Built Files

### After Successful Build:
- **App Bundle (.aab)**: `android/app/build/outputs/bundle/release/app-release.aab`
- **APK**: `android/app/build/outputs/apk/release/app-release.apk`

### File Sizes:
- App Bundle: Usually 15-30MB
- APK: Usually 20-40MB

## Step 5: Testing Your App

### Install on Connected Device:
1. **Enable Developer Options** on your Android phone:
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   - Enable "USB Debugging" in Developer Options

2. **Connect Device**
   - Connect phone via USB
   - Allow USB debugging when prompted

3. **Run App**
   - In Android Studio, click green "Run" button
   - Select your connected device
   - App will install and launch

### Testing Checklist:
- [ ] App launches successfully
- [ ] All 7 services accessible (taxi, delivery, rental, etc.)
- [ ] Camera works for document upload
- [ ] Location services work
- [ ] YouTube videos load in management section
- [ ] District/taluk selection works
- [ ] Payment integration functions

## Step 6: Common Issues and Solutions

### Gradle Sync Failed:
```bash
# Clean and rebuild
./gradlew clean
./gradlew build
```

### SDK Issues:
- Go to Tools → SDK Manager
- Install latest Android SDK Platform
- Install Android SDK Build-Tools

### Build Errors:
- Check "Build" tab at bottom for error details
- Most common: missing dependencies or SDK components

### Keystore Issues:
- Never lose your keystore file
- Use same keystore for all future updates
- Backup keystore file securely

## Step 7: Preparing for Play Store

### File to Upload:
- Use the `.aab` file (Android App Bundle)
- Located at: `android/app/build/outputs/bundle/release/app-release.aab`

### Before Upload:
1. **Test thoroughly** on real device
2. **Verify all features** work as expected
3. **Check app size** is reasonable
4. **Ensure no debug/test data** remains

### Upload to Play Console:
1. Go to play.google.com/console
2. Create new app
3. Upload your .aab file
4. Fill store listing details
5. Submit for review

## Important Notes

### Security:
- **Never share your keystore** or passwords
- **Backup keystore safely** - losing it means you can't update your app
- **Use different passwords** for keystore and key

### Updates:
- **Always use same keystore** for app updates
- **Increment version code** for each update
- **Test updates thoroughly** before publishing

### File Management:
- **Keep project organized** in dedicated folder
- **Backup entire project** regularly
- **Document your build process** for team members

Your Nalamini app is now ready for Android Studio building and Play Store submission!