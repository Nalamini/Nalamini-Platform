#!/bin/bash

# Deployment script for Nalamini Service Platform
# This script helps with common deployment tasks

echo "===== Nalamini Service Platform Deployment Helper ====="
echo "This script will help you deploy the application."

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Function to display deployment options
show_options() {
  echo ""
  echo "Choose a deployment platform:"
  echo "1) Render.com"
  echo "2) Vercel"
  echo "3) Heroku"
  echo "4) Exit"
  echo ""
}

# Build the application
build_app() {
  echo "Building the application..."
  npm run build
  if [ $? -eq 0 ]; then
    echo "Build successful!"
  else
    echo "Build failed. Please check the error logs."
    exit 1
  fi
}

# Deploy to Render.com
deploy_to_render() {
  echo "Preparing for Render.com deployment..."
  
  if [ ! -f "render.yaml" ]; then
    echo "render.yaml not found. Creating one..."
    cat > render.yaml << EOF
services:
  - type: web
    name: nalamini-service-platform
    env: node
    plan: free
    buildCommand: npm run build
    startCommand: node server.js
    healthCheckPath: /api/health
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5000
      - key: DATABASE_URL
        sync: false
      - key: RAZORPAY_KEY_ID
        sync: false
      - key: RAZORPAY_KEY_SECRET
        sync: false
EOF
  fi
  
  echo "========================================"
  echo "Instructions for Render.com deployment:"
  echo "1. Go to your Render dashboard: https://dashboard.render.com/"
  echo "2. Create a new Web Service"
  echo "3. Connect your repository"
  echo "4. Configure using the Node.js environment"
  echo "5. Set the build command to: npm run build"
  echo "6. Set the start command to: node server.js"
  echo "7. Add your environment variables"
  echo "8. Deploy your service"
  echo "========================================"
}

# Deploy to Vercel
deploy_to_vercel() {
  echo "Preparing for Vercel deployment..."
  
  if [ ! -f "vercel.json" ]; then
    echo "vercel.json not found. Creating one..."
    cat > vercel.json << EOF
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
EOF
  fi
  
  if command_exists vercel; then
    echo "Vercel CLI detected!"
    echo "Would you like to deploy now? (y/n)"
    read deploy_now
    
    if [ "$deploy_now" = "y" ]; then
      vercel
    else
      echo "========================================"
      echo "Instructions for Vercel deployment:"
      echo "1. Install Vercel CLI: npm i -g vercel"
      echo "2. Log in to Vercel: vercel login"
      echo "3. Deploy the app: vercel"
      echo "4. Follow the prompts to complete deployment"
      echo "========================================"
    fi
  else
    echo "Vercel CLI not found."
    echo "========================================"
    echo "Instructions for Vercel deployment:"
    echo "1. Install Vercel CLI: npm i -g vercel"
    echo "2. Log in to Vercel: vercel login"
    echo "3. Deploy the app: vercel"
    echo "4. Follow the prompts to complete deployment"
    echo "========================================"
  fi
}

# Deploy to Heroku
deploy_to_heroku() {
  echo "Preparing for Heroku deployment..."
  
  if [ ! -f "Procfile" ]; then
    echo "Procfile not found. Creating one..."
    echo "web: node server.js" > Procfile
  fi
  
  if command_exists heroku; then
    echo "Heroku CLI detected!"
    echo "Would you like to deploy now? (y/n)"
    read deploy_now
    
    if [ "$deploy_now" = "y" ]; then
      echo "Enter a name for your Heroku app (leave blank for random name):"
      read app_name
      
      if [ -z "$app_name" ]; then
        heroku create
      else
        heroku create "$app_name"
      fi
      
      echo "Adding PostgreSQL addon..."
      heroku addons:create heroku-postgresql:hobby-dev
      
      echo "Setting environment variables..."
      heroku config:set NODE_ENV=production
      
      echo "Pushing to Heroku..."
      git push heroku main
    else
      echo "========================================"
      echo "Instructions for Heroku deployment:"
      echo "1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli"
      echo "2. Log in to Heroku: heroku login"
      echo "3. Create a new app: heroku create"
      echo "4. Add PostgreSQL: heroku addons:create heroku-postgresql:hobby-dev"
      echo "5. Set environment variables: heroku config:set KEY=VALUE"
      echo "6. Deploy the app: git push heroku main"
      echo "========================================"
    fi
  else
    echo "Heroku CLI not found."
    echo "========================================"
    echo "Instructions for Heroku deployment:"
    echo "1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli"
    echo "2. Log in to Heroku: heroku login"
    echo "3. Create a new app: heroku create"
    echo "4. Add PostgreSQL: heroku addons:create heroku-postgresql:hobby-dev"
    echo "5. Set environment variables: heroku config:set KEY=VALUE"
    echo "6. Deploy the app: git push heroku main"
    echo "========================================"
  fi
}

# Main script execution
build_app

while true; do
  show_options
  read -p "Enter your choice (1-4): " choice
  
  case $choice in
    1)
      deploy_to_render
      ;;
    2)
      deploy_to_vercel
      ;;
    3)
      deploy_to_heroku
      ;;
    4)
      echo "Exiting deployment helper. Good luck with your deployment!"
      exit 0
      ;;
    *)
      echo "Invalid option. Please try again."
      ;;
  esac
  
  echo ""
  read -p "Press Enter to continue..."
done