#!/bin/bash

# This is a simple build script for Vercel that doesn't rely on npm commands
# It manually creates the dist directory and copies necessary files

echo "Starting manual build process for Vercel deployment..."

# Create dist directory if it doesn't exist
mkdir -p dist

# Copy client files to dist
echo "Copying client files..."
cp -r client/* dist/

# Copy server files to dist
echo "Copying server file..."
cp server.js dist/

# Copy package.json to dist
echo "Copying package.json..."
cp package.json dist/

echo "Manual build completed successfully!"