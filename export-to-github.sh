#!/bin/bash

# Script to export the project to GitHub for deployment
# This is useful for platforms like Vercel that work with GitHub repositories

echo "===== Export to GitHub Helper ====="
echo "This script will help you export your project to GitHub for deployment."

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "Error: git is not installed. Please install git first."
    exit 1
fi

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "GitHub CLI is not installed. Would you like to use basic git commands instead? (y/n)"
    read use_basic_git
    
    if [ "$use_basic_git" != "y" ]; then
        echo "Aborted. Please install GitHub CLI or select to use basic git commands."
        exit 1
    fi
fi

# Function to create a new GitHub repository
create_github_repo() {
    local repo_name=$1
    local is_private=$2
    
    if command -v gh &> /dev/null; then
        # Using GitHub CLI
        if [ "$is_private" = "y" ]; then
            gh repo create "$repo_name" --private
        else
            gh repo create "$repo_name" --public
        fi
    else
        # Using basic git
        echo "Please create a new repository on GitHub named '$repo_name'."
        echo "Once created, enter the repository URL (e.g., https://github.com/username/$repo_name.git):"
        read repo_url
        
        if [ -z "$repo_url" ]; then
            echo "No repository URL provided. Aborted."
            exit 1
        fi
        
        git remote add origin "$repo_url"
    fi
}

# Initialize git if not already
if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
fi

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo "Creating .gitignore file..."
    cat > .gitignore << EOF
# Node.js
node_modules/
npm-debug.log
yarn-debug.log
yarn-error.log

# Build output
dist/
build/
.cache/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Editor directories and files
.idea/
.vscode/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# OS files
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Debug
.pnpm-debug.log*

# Temporary files
tmp/
temp/

# Coverage directory
coverage/

# Dependency directory
.pnp/
.pnp.js

# Uploads directory (user content)
uploads/

# Prevent sensitive files from leaking
*.pem
*.key
EOF
fi

# Ask for repository name
echo "Enter a name for your GitHub repository:"
read repo_name

if [ -z "$repo_name" ]; then
    repo_name="nalamini-service-platform"
    echo "Using default name: $repo_name"
fi

# Ask if repository should be private
echo "Should the repository be private? (y/n)"
read is_private

# Add all files
echo "Adding files to git..."
git add .

# Commit changes
echo "Enter a commit message (default: 'Initial commit for deployment'):"
read commit_message

if [ -z "$commit_message" ]; then
    commit_message="Initial commit for deployment"
fi

git commit -m "$commit_message"

# Create repository on GitHub
echo "Creating GitHub repository..."
create_github_repo "$repo_name" "$is_private"

# Push to GitHub
echo "Pushing to GitHub..."
git push -u origin main || git push -u origin master

echo "===== Export Completed ====="
echo "Your project has been exported to GitHub and is ready for deployment."
echo "Repository: $repo_name"
echo "You can now connect this repository to your deployment platform of choice."