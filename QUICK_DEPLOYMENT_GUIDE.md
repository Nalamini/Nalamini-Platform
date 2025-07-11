# Deploy Nalamini to www.nalamini.com - Quick Steps

## 1. GitHub Setup (5 minutes)
1. Go to github.com and create account
2. Create new repository named "nalamini-platform"
3. Upload all project files OR connect from Replit

## 2. Vercel Deployment (3 minutes)
1. Go to vercel.com 
2. Sign up with GitHub account
3. Click "New Project"
4. Import your repository
5. Click "Deploy" (Vercel auto-configures)

## 3. Environment Variables (2 minutes)
In Vercel project settings, add:
- DATABASE_URL (your PostgreSQL connection)
- YOUTUBE_API_KEY 
- YOUTUBE_CHANNEL_ID
- RAZORPAY_KEY_ID
- RAZORPAY_KEY_SECRET

## 4. Custom Domain Setup (5 minutes)
1. In Vercel dashboard → Domains
2. Add: nalamini.com and www.nalamini.com
3. Copy the DNS records Vercel shows

## 5. Update Hostgator DNS (5 minutes)
In Hostgator cPanel → Zone Editor:
- Delete existing A records
- Add new A record: @ → 76.76.19.61
- Add CNAME: www → cname.vercel-dns.com

## 6. Wait for Propagation (24-48 hours)
Your site will be live at www.nalamini.com

## Total Time: 20 minutes setup + DNS propagation

Ready to start? I can help with any step.