#!/bin/bash

# Nalamini Android App Setup Script
echo "Setting up Nalamini Android App..."

# Create minimal build for Capacitor
mkdir -p client/dist
echo '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nalamini Service Platform</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        .logo { font-size: 24px; color: #3b82f6; margin-bottom: 20px; }
        .loading { color: #666; }
    </style>
</head>
<body>
    <div class="logo">🚗 Nalamini Service Platform</div>
    <div class="loading">Loading mobile app...</div>
    <script>
        // Redirect to main app
        setTimeout(() => {
            window.location.href = "/";
        }, 2000);
    </script>
</body>
</html>' > client/dist/index.html

# Add Android platform
npx cap add android

# Sync web assets
npx cap sync

echo "Android app setup complete!"
echo "Next steps:"
echo "1. Install Android Studio"
echo "2. Run: npx cap open android"
echo "3. Build and test on device"