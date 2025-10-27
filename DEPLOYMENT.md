# TradeBinder Frontend - Railway Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the TradeBinder frontend application to Railway.

## Prerequisites

1. Railway account (create at [railway.app](https://railway.app))
2. Git repository connected to GitHub/GitLab/Bitbucket
3. Backend API deployed and accessible (for API URL configuration)

## Quick Start

1. Push your code to GitHub
2. Connect your GitHub repo to Railway
3. Configure environment variables
4. Deploy!

## Detailed Deployment Steps

### Step 1: Prepare Your Repository

Ensure your code is committed and pushed to your Git repository:

```bash
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### Step 2: Connect to Railway

1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Authorize Railway to access your GitHub account
5. Select your repository

### Step 3: Configure Build Settings

Railway will automatically detect the Node.js project and use the `railway.toml` configuration.

The configuration includes:
- **Builder**: Nixpacks (automatic)
- **Build Command**: `npm run build`
- **Start Command**: `npm run serve`

### Step 4: Set Environment Variables

In the Railway dashboard:

1. Navigate to your project
2. Click on "Variables" tab
3. Add the following variables:

```
REACT_APP_API_URL=<your-backend-api-url>
REACT_APP_API_TIMEOUT=10000
REACT_APP_ENV=production
REACT_APP_NAME=TradeBinder
REACT_APP_VERSION=1.0.0
```

**Important**: Replace `<your-backend-api-url>` with your actual backend API URL (e.g., `https://your-backend.railway.app/api`)

### Step 5: Deploy

1. Railway will automatically trigger a deployment when you connect the repo
2. The build process will:
   - Install dependencies (`npm install`)
   - Build the React app (`npm run build`)
   - Start the Express server (`npm run serve`)
3. Monitor the deployment logs in the dashboard

### Step 6: Access Your App

After successful deployment:
1. Go to the "Settings" tab
2. Find your app's URL (e.g., `your-app-name.railway.app`)
3. Click to view your deployed app

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `https://api.example.com/api` |
| `REACT_APP_API_TIMEOUT` | Request timeout in ms | `10000` |
| `REACT_APP_ENV` | Environment mode | `production` or `development` |
| `REACT_APP_NAME` | Application name | `TradeBinder` |
| `REACT_APP_VERSION` | Application version | `1.0.0` |

## Project Structure for Deployment

```
/
├── railway.toml          # Railway configuration
├── server.js             # Express server for production
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── postcss.config.js     # PostCSS configuration
├── public/               # Static assets
└── src/                  # React source code
```

## Build Process

The deployment build process:

1. **Install Dependencies**: `npm install`
2. **Build React App**: `npm run build` 
   - Creates optimized production bundle in `/build`
   - Includes code splitting, minification, tree shaking
3. **Start Server**: `npm run serve`
   - Starts Express server on PORT (provided by Railway)
   - Serves static files from `/build`
   - Handles client-side routing (SPA fallback)

## Server Configuration

The Express server (`server.js`) handles:

- Serving static files from the build directory
- Handling all routes (SPA fallback to `index.html`)
- Reading `PORT` from environment variables
- Logging server startup information

## Troubleshooting

### Build Fails

**Issue**: Build command fails
**Solution**: 
- Check deployment logs for specific errors
- Ensure all dependencies are in `package.json`
- Verify TypeScript compilation errors

### Environment Variables Not Working

**Issue**: Variables not accessible in the app
**Solution**:
- All React environment variables must start with `REACT_APP_`
- Redeploy after adding new variables
- Clear browser cache if issues persist

### API Connection Issues

**Issue**: API calls fail
**Solution**:
- Verify `REACT_APP_API_URL` is set correctly
- Check backend is deployed and accessible
- Review CORS settings on backend
- Check browser console for detailed errors

### Routing Issues

**Issue**: Direct URL access returns 404
**Solution**:
- Server configuration handles SPA routing
- All routes fallback to `index.html`
- Verify `server.js` is running correctly

### Port Issues

**Issue**: Port conflicts
**Solution**:
- Railway provides PORT automatically via env variable
- Server listens on `process.env.PORT || 3000`
- No manual port configuration needed

## Monitoring and Logs

### View Logs

1. Navigate to your project in Railway dashboard
2. Click on "Deployments"
3. Select the latest deployment
4. View build and runtime logs

### Common Log Messages

- `🚀 Server is running on port XXXX` - Server started successfully
- `📁 Serving files from: /build` - Static files being served
- `🌍 API URL: ...` - API URL configuration logged

### Monitor Performance

- CPU and Memory usage in Railway dashboard
- Response times and error rates
- Set up alerts for deployment failures

## Continuous Deployment

Railway automatically deploys when you push to your connected branch:

1. Push to `main` branch (or configured branch)
2. Railway detects changes
3. Triggers new build
4. Deploys automatically if build succeeds

To configure:
1. Go to Settings → Source
2. Select the branch to deploy from
3. Enable auto-deploy (default: enabled)

## Custom Domain Setup

1. In Railway dashboard, go to Settings
2. Click "Add Custom Domain"
3. Enter your domain (e.g., `tradebinder.com`)
4. Railway provides DNS records
5. Update your DNS provider with the records
6. Wait for DNS propagation
7. SSL certificate is automatically provisioned

## Updating Your Deployment

To update the deployed application:

1. Make code changes
2. Commit changes:
   ```bash
   git add .
   git commit -m "Update feature X"
   git push origin main
   ```
3. Railway automatically triggers new deployment
4. Monitor the build in the dashboard

## Rollback

To rollback to a previous deployment:

1. Go to Deployments in Railway dashboard
2. Find the previous successful deployment
3. Click "Redeploy"
4. This restores the previous version

## Additional Resources

- [Railway Documentation](https://docs.railway.app/)
- [Nixpacks Documentation](https://nixpacks.com/docs)
- [React Deployment Guide](https://create-react-app.dev/docs/deployment/)
- [Express Deployment](https://expressjs.com/en/advanced/best-practice-production.html)

## Support

For issues specific to this project:
1. Check deployment logs in Railway dashboard
2. Review browser console for client-side errors
3. Verify environment variables are set correctly
4. Check backend API is accessible

For Railway support:
- [Railway Discord](https://discord.gg/railway)
- [Railway Docs](https://docs.railway.app)
