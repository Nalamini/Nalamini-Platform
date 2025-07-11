#!/bin/bash

# Script to help deploy the Nalamini Service Platform to Vercel

echo "===== Nalamini Service Platform Vercel Deployment Helper ====="
echo "This script will help you deploy your application to Vercel."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI not found. Would you like to install it? (y/n)"
    read install_vercel
    
    if [ "$install_vercel" = "y" ]; then
        echo "Installing Vercel CLI..."
        npm install -g vercel
    else
        echo "Please install Vercel CLI manually with: npm install -g vercel"
        exit 1
    fi
fi

# Login to Vercel if needed
echo "Checking Vercel login status..."
vercel whoami &> /dev/null
if [ $? -ne 0 ]; then
    echo "Please log in to Vercel:"
    vercel login
fi

# Verify environment variables
echo "Checking required environment variables..."

echo "Do you have a PostgreSQL database URL? (y/n)"
read has_db_url

if [ "$has_db_url" = "y" ]; then
    echo "Great! You'll need to add this as an environment variable during deployment."
else
    echo "You'll need to set up a PostgreSQL database before deployment."
    echo "Options include:"
    echo "1. Vercel Postgres (integrated with Vercel)"
    echo "2. Neon (free serverless Postgres)"
    echo "3. Railway (developer platform with Postgres)"
    echo "4. ElephantSQL (free cloud Postgres)"
    echo ""
    echo "Once you have your database, you'll need the DATABASE_URL during deployment."
fi

echo "Do you have Razorpay API credentials? (y/n)"
read has_razorpay

if [ "$has_razorpay" = "y" ]; then
    echo "Great! You'll need to add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET as environment variables."
else
    echo "You'll need Razorpay API credentials for payment functionality."
    echo "Create an account at https://razorpay.com/ if you haven't already."
fi

# Build the project
echo "Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "Build failed. Please fix the errors before deploying."
    exit 1
fi

# Configure for deployment
echo "Would you like to deploy now? (y/n)"
read deploy_now

if [ "$deploy_now" = "y" ]; then
    echo "Starting deployment process..."
    echo "You'll be prompted to set up your project and environment variables."
    
    # Deploy to Vercel
    vercel --prod
    
    echo "Deployment initiated! Once complete, your app will be available at the URL provided by Vercel."
    echo "Don't forget to set up these environment variables in the Vercel dashboard:"
    echo "- DATABASE_URL"
    echo "- RAZORPAY_KEY_ID"
    echo "- RAZORPAY_KEY_SECRET"
    echo "- NODE_ENV=production"
else
    echo "When you're ready to deploy, run:"
    echo "vercel --prod"
    echo ""
    echo "Don't forget to set these environment variables during deployment:"
    echo "- DATABASE_URL"
    echo "- RAZORPAY_KEY_ID"
    echo "- RAZORPAY_KEY_SECRET"
    echo "- NODE_ENV=production"
fi

echo "===== Deployment Preparation Complete ====="