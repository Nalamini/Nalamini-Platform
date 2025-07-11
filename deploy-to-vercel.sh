#!/bin/bash

# Standalone API deploy script for Vercel
# This approach completely bypasses the package.json path issue

echo "===== Nalamini Service Platform - Standalone API Deployment ====="

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI not found. Installing it now..."
    npm install -g vercel
fi

# Ensure necessary files exist
if [ ! -f "api/index.js" ]; then
    echo "Error: api/index.js not found. Make sure you've created this file."
    exit 1
fi

if [ ! -f "api/package.json" ]; then
    echo "Error: api/package.json not found. Make sure you've created this file."
    exit 1
fi

if [ ! -f "vercel.json" ]; then
    echo "Error: vercel.json not found. Make sure you've created this file."
    exit 1
fi

if [ ! -f ".vercelignore" ]; then
    echo "Error: .vercelignore not found. Make sure you've created this file."
    exit 1
fi

# Deploy to Vercel with special flags to override build settings
echo "Deploying to Vercel with standalone API approach..."
echo "You'll be prompted to log in if you haven't already."

# Deploy with specific settings to override default behavior
vercel --prod --build-env VERCEL_FORCE_NO_BUILD=1

echo "===== Deployment Initiated ====="
echo "After deployment completes, verify that:"
echo "1. The base URL should serve the API response"
echo "2. Set these environment variables in the Vercel dashboard:"
echo "   - DATABASE_URL"
echo "   - RAZORPAY_KEY_ID" 
echo "   - RAZORPAY_KEY_SECRET"
echo "   - NODE_ENV=production"
echo "   - VERCEL_FORCE_NO_BUILD=1"