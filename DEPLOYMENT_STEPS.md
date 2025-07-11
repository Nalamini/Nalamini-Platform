# Deploy Nalamini to www.nalamini.com - Complete Guide

## Current Situation
Your Hostgator shared hosting cannot run Node.js applications. The best solution is deploying to Vercel (free) and pointing your domain to it.

## Step-by-Step Instructions

### Method 1: Vercel Deployment (Recommended)

#### Part A: Prepare for Deployment
1. Create a GitHub account if you don't have one
2. Push this project to GitHub
3. Sign up at vercel.com using your GitHub account

#### Part B: Deploy to Vercel
1. In Vercel dashboard, click "New Project"
2. Import your GitHub repository
3. Vercel will automatically detect it's a Node.js project
4. Click "Deploy" - Vercel handles everything automatically

#### Part C: Connect Your Domain
1. In Vercel project settings, go to "Domains"
2. Add your domain: `nalamini.com` and `www.nalamini.com`
3. Vercel will show you DNS records to add

#### Part D: Update DNS in Hostgator
1. Login to Hostgator cPanel
2. Find "Zone Editor" or "DNS Zone Editor"
3. Replace existing records with:
   ```
   Type: A
   Name: @
   Points to: 76.76.19.61
   TTL: 14400

   Type: CNAME
   Name: www
   Points to: cname.vercel-dns.com
   TTL: 14400
   ```

#### Part E: Environment Variables
In Vercel dashboard, add these environment variables:
- `DATABASE_URL`: Your PostgreSQL connection string
- `YOUTUBE_API_KEY`: Your YouTube API key
- `YOUTUBE_CHANNEL_ID`: Your channel ID
- `RAZORPAY_KEY_ID`: Your Razorpay key
- `RAZORPAY_KEY_SECRET`: Your Razorpay secret

### Expected Timeline
- DNS propagation: 24-48 hours
- SSL certificate: Automatic (immediate)
- Your site will be live at www.nalamini.com

### Method 2: Alternative - Railway
If you prefer Railway.app:
1. Deploy to Railway instead of Vercel
2. Railway includes PostgreSQL database
3. Point DNS to Railway servers

## Database Migration
You'll need to:
1. Export your current database
2. Set up PostgreSQL on Vercel/Railway
3. Import your data

## Cost
- Vercel: Free for personal use
- Custom domain: You already own it
- Database: Free tier available

Would you like me to help you set up any of these steps?