# Deploying Nalamini Service Platform to Vercel

This guide provides step-by-step instructions for deploying the Nalamini Service Platform to Vercel, including solutions for common path issues.

## Prerequisites

Before deploying, ensure you have:

1. A Vercel account (sign up at https://vercel.com)
2. A PostgreSQL database (options below)
3. Razorpay API credentials (if using payment features)

## Database Options

You'll need a PostgreSQL database accessible from the internet. Here are some options:

- **Vercel Postgres**: Integrated with Vercel, easy setup
- **Neon**: Serverless PostgreSQL with a generous free tier (https://neon.tech)
- **Railway**: Developer platform with PostgreSQL (https://railway.app)
- **ElephantSQL**: PostgreSQL as a service with a free tier (https://www.elephantsql.com)
- **Supabase**: PostgreSQL with additional features (https://supabase.com)

## Simplified Deployment (Recommended)

We've created a simplified deployment approach to avoid path issues:

1. Make sure you have these files ready:
   - `api/server.js` - Serverless function entry point
   - `vercel.json` - Simple configuration file

2. Run our deployment script:
   ```
   chmod +x deploy-to-vercel.sh
   ./deploy-to-vercel.sh
   ```

3. Follow the prompts to deploy to Vercel

4. After deployment, add these environment variables in the Vercel dashboard:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `RAZORPAY_KEY_ID`: Your Razorpay API key ID
   - `RAZORPAY_KEY_SECRET`: Your Razorpay API key secret
   - `NODE_ENV`: production

## Path Issues and Solutions

If you encounter a "/vercel/path0/package.json" error or similar path issues:

1. **Use our simplified approach**: We've created a serverless function approach that avoids complex path dependencies.

2. **Directory structure**: Our approach uses a special `api` folder that Vercel recognizes for serverless functions.

3. **Configuration simplification**: We've simplified the `vercel.json` file to avoid complex path handling.

4. **Robust server entry point**: The `api/server.js` file is designed to find your server code regardless of the directory structure.

## Alternative Deployment Methods

### Using the Vercel Dashboard 

1. Push your code to a GitHub, GitLab, or Bitbucket repository
2. Log in to your Vercel account
3. Click "Add New..." → "Project"
4. Select your repository
5. Configure your project:
   - **Framework Preset**: Other
   - **Root Directory**: ./
   - **Build Command**: (leave empty - we'll handle this in our serverless function)
   - **Output Directory**: (leave empty)
   - **Install Command**: npm ci
6. Add environment variables mentioned above
7. Click "Deploy"

### Using the Vercel CLI

1. Install the Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Log in to Vercel:
   ```
   vercel login
   ```

3. Deploy with:
   ```
   vercel --prod
   ```

## Post-Deployment Steps

After successful deployment:

1. Open your deployed app's URL
2. Verify that the `/api/health` endpoint returns a successful response
3. If the database is newly created, run migrations using the Vercel CLI:
   ```
   vercel env pull .env  # Pull environment variables
   npm run db:push      # Run migration
   ```

## Troubleshooting Path Issues

If you continue to experience path issues:

1. **Check Vercel logs**: Look for detailed error messages about file paths

2. **Verify file structure**:
   - The `api/server.js` file should be at the root of your `api` directory
   - The `vercel.json` file should be at the root of your project

3. **Try alternative configurations**:
   - Use the Vercel UI to set a specific root directory
   - If using a monorepo, specify the project directory

4. **Inspect environment**:
   - Use `console.log` statements in your serverless function to print:
     - `__dirname`
     - `process.cwd()`
     - `fs.readdirSync('.')` (to see available files)

## Getting Help

If you continue to experience issues:

1. Check Vercel's documentation: https://vercel.com/docs
2. Review the application logs in the Vercel dashboard
3. Contact Vercel support if the issue is platform-related