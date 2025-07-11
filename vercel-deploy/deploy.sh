#!/bin/bash

# Minimal Vercel deployment script that uses only the most basic functionality

echo "===== Nalamini Service Platform - Minimal API Deployment ====="

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI not found. Installing it now..."
    npm install -g vercel
fi

# Deploy to Vercel with minimal configuration
echo "Deploying to Vercel..."
echo "You'll be prompted to log in if you haven't already."

# Change to the vercel-deploy directory
cd "$(dirname "$0")"

# Deploy without any build steps
vercel --prod

echo "===== Deployment Initiated ====="
echo "After deployment completes, verify that the API is working by visiting the deployed URL."
echo ""
echo "You can add these environment variables in the Vercel dashboard if needed:"
echo "- DATABASE_URL"
echo "- RAZORPAY_KEY_ID" 
echo "- RAZORPAY_KEY_SECRET"
echo "- NODE_ENV=production"