# Deploying to Vercel

This guide will help you deploy your Wealth Manager application to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Account**: Your code should be in a GitHub repository
3. **Vercel CLI** (optional): `npm i -g vercel`

## Deployment Steps

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository containing your Wealth Manager project

3. **Configure Project Settings**
   - **Framework Preset**: Select "Other"
   - **Root Directory**: Leave as `/` (root)
   - **Build Command**: Leave empty (Vercel will auto-detect)
   - **Output Directory**: Leave empty
   - **Install Command**: `npm run install:all`

4. **Environment Variables** (if needed)
   - Add any environment variables in the Vercel dashboard
   - For this project, no additional environment variables are required

5. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your application

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Follow the prompts**
   - Link to existing project or create new
   - Confirm deployment settings
   - Wait for build and deployment

## Project Structure for Vercel

The deployment is configured with the following structure:

```
├── vercel.json          # Vercel configuration
├── client/             # Next.js frontend
├── server/             # Express.js backend
└── package.json        # Root package.json
```

## Configuration Files

### vercel.json
- Routes API calls to the server
- Routes all other requests to the Next.js client
- Handles both frontend and backend builds

### client/next.config.mjs
- Configured for standalone output
- Optimized for Vercel deployment

### server/package.json
- Includes start script for production
- All dependencies properly configured

## Important Notes

1. **Excel File**: The Excel file (`server/data/Sample Portfolio Dataset for Assignment.xlsx`) will be included in the deployment and parsed at runtime.

2. **API Routes**: All API calls will be routed to `/api/*` and handled by the Express.js server.

3. **CORS**: The server is configured with CORS enabled for cross-origin requests.

4. **Environment**: The application will run in production mode on Vercel.

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check that all dependencies are properly listed in package.json files
   - Ensure the Excel file exists in `server/data/`
   - Verify Node.js version compatibility

2. **API Errors**
   - Check that the server is properly configured in vercel.json
   - Verify that API routes are correctly defined

3. **File Not Found**
   - Ensure the Excel file is committed to the repository
   - Check file paths in the server code

### Debugging

1. **Check Build Logs**
   - Go to your Vercel dashboard
   - Click on the latest deployment
   - Check the build logs for errors

2. **Test Locally**
   ```bash
   npm run install:all
   npm run dev
   ```

3. **Check Function Logs**
   - In Vercel dashboard, go to Functions tab
   - Check serverless function logs for API errors

## Post-Deployment

After successful deployment:

1. **Test the Application**
   - Visit your Vercel URL
   - Test all features: holdings, allocation, performance, summary

2. **Monitor Performance**
   - Use Vercel Analytics to monitor performance
   - Check function execution times

3. **Set up Custom Domain** (Optional)
   - In Vercel dashboard, go to Settings → Domains
   - Add your custom domain

## Environment Variables

If you need to add environment variables later:

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add any required environment variables
4. Redeploy the application

## Updating the Deployment

To update your deployed application:

1. Make your changes locally
2. Commit and push to GitHub
3. Vercel will automatically redeploy (if auto-deploy is enabled)
4. Or manually trigger a new deployment from the Vercel dashboard 