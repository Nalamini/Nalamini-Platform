# Standalone API Deployment for Vercel

This guide provides instructions for deploying a minimal API to Vercel, completely bypassing the package.json path issue by using a standalone serverless function approach.

## How This Approach Works

Our standalone API deployment:

1. Creates a completely independent API in the `api` folder with its own package.json
2. Uses a `.vercelignore` file to exclude everything except the API and configuration
3. Configures Vercel to skip any build process
4. Deploys just a minimal API endpoint to verify connectivity

## Required Files

We've set up all the necessary files:

1. `api/index.js` - A minimal serverless function
2. `api/package.json` - A minimal package.json file just for the API
3. `vercel.json` - Configuration that disables build steps
4. `.vercelignore` - Tells Vercel to ignore everything except the API

## Deployment Process

### 1. Run the deployment script

```
./deploy-to-vercel.sh
```

The script will:
- Check that all required files exist
- Deploy to Vercel with the `VERCEL_FORCE_NO_BUILD=1` environment variable
- Skip any build processes that might cause path issues

### 2. Environment Variables

After deployment, add these environment variables in the Vercel dashboard:
- `DATABASE_URL`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `NODE_ENV=production`
- `VERCEL_FORCE_NO_BUILD=1`

### 3. Verification

Once deployed, the base URL of your Vercel deployment should return a simple JSON response from the API.

## Future Expansion

This is a minimal deployment to verify connectivity. Once you have this working:

1. Add database connectivity to the API
2. Gradually expand the API functionality
3. Consider a more complete deployment strategy for the full application

## Troubleshooting

If you encounter issues:

1. **Verify Deployment Config**: Check that `buildCommand: false` is set in vercel.json
2. **Check Build Environment**: Make sure `VERCEL_FORCE_NO_BUILD=1` is set
3. **Inspect Deployment Logs**: Look for any error messages in the Vercel dashboard

## Support and Next Steps

After your minimal API is successfully deployed, you can:

1. Update the API to include basic database functionality
2. Add authentication endpoints
3. Consider deploying the frontend to a separate service like Netlify or GitHub Pages
4. Work towards a complete solution for deploying both frontend and backend