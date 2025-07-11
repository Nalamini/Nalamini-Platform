#!/bin/bash

# Script to create a zip file of the minimal deployment for easy uploading to Vercel

echo "===== Creating Minimal Deployment Package ====="

# Check if the vercel-deploy directory exists
if [ ! -d "vercel-deploy" ]; then
    echo "Error: vercel-deploy directory not found."
    exit 1
fi

# Create the zip file
echo "Creating zip file..."
cd vercel-deploy
zip -r ../nalamini-minimal-deployment.zip ./*
cd ..

echo "===== Package Created ====="
echo "The minimal deployment package has been created as 'nalamini-minimal-deployment.zip'"
echo ""
echo "To deploy this package:"
echo "1. Go to https://vercel.com/new"
echo "2. Select 'Upload' deployment option"
echo "3. Upload the zip file"
echo "4. Configure with these settings:"
echo "   - Framework Preset: Other"
echo "   - Build Command: (leave empty)"
echo "   - Output Directory: (leave empty)"
echo "   - Install Command: (leave empty)"
echo "5. Click 'Deploy'"