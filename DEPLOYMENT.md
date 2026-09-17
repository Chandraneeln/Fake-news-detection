# Deploying Honest Eye to Vercel

This guide will help you deploy both the frontend and backend of Honest Eye to Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. [Vercel CLI](https://vercel.com/docs/cli) installed globally: `npm install -g vercel`
3. Google Cloud API key for the Gemini AI service
4. Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Prepare Your Environment Variables

### Backend Environment Variables
Create a `.env` file in the `backend` directory with:
```env
GOOGLE_API_KEY=your_google_api_key_here
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app
CORS_ORIGIN=https://your-frontend-url.vercel.app
PORT=5000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

### Frontend Environment Variables
Update `.env.production` in the root directory:
```env
VITE_API_URL=https://your-backend-url.vercel.app
VITE_APP_TITLE=Honest Eye
VITE_APP_VERSION=1.0.0
```

## Step 2: Deploy the Backend API

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy the backend:
   ```bash
   vercel --prod
   ```

4. Set up environment variables in Vercel dashboard:
   - Go to your Vercel dashboard
   - Select your backend project
   - Go to Settings → Environment Variables
   - Add the following variables:
     - `GOOGLE_API_KEY`: Your Google API key
     - `NODE_ENV`: `production`
     - `FRONTEND_URL`: Your frontend URL (will be set after frontend deployment)
     - `CORS_ORIGIN`: Your frontend URL (will be set after frontend deployment)

5. Note down your backend URL (e.g., `https://your-backend-url.vercel.app`)

## Step 3: Deploy the Frontend

1. Navigate back to the root directory:
   ```bash
   cd ..
   ```

2. Update the `.env.production` file with your actual backend URL:
   ```env
   VITE_API_URL=https://your-backend-url.vercel.app
   ```

3. Deploy the frontend:
   ```bash
   vercel --prod
   ```

4. Set up environment variables in Vercel dashboard:
   - Go to your Vercel dashboard
   - Select your frontend project
   - Go to Settings → Environment Variables
   - Add: `VITE_API_URL` with your backend URL

5. Note down your frontend URL (e.g., `https://your-frontend-url.vercel.app`)

## Step 4: Update Backend CORS Settings

1. Go back to your backend project in Vercel dashboard
2. Update the environment variables:
   - `FRONTEND_URL`: Set to your actual frontend URL
   - `CORS_ORIGIN`: Set to your actual frontend URL
3. Redeploy the backend by pushing a commit or using `vercel --prod` in the backend directory

## Step 5: Test Your Deployment

1. Visit your frontend URL
2. Try the analysis feature to ensure the frontend can communicate with the backend
3. Check the browser console for any errors

## Alternative: Deploy Using Git Integration

### For Backend:
1. Push your code to a Git repository
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Import Project"
4. Select your repository
5. Set the root directory to `backend`
6. Configure environment variables as mentioned above
7. Deploy

### For Frontend:
1. In the same repository, create a new Vercel project
2. Set the root directory to `.` (root)
3. Configure environment variables as mentioned above
4. Deploy

## Environment Variables Reference

### Backend Variables (Required)
- `GOOGLE_API_KEY`: Your Google Generative AI API key
- `NODE_ENV`: Set to `production`
- `FRONTEND_URL`: Your frontend Vercel URL
- `CORS_ORIGIN`: Your frontend Vercel URL (can be same as FRONTEND_URL)

### Frontend Variables (Required)
- `VITE_API_URL`: Your backend Vercel URL

### Optional Variables
- `RATE_LIMIT_MAX_REQUESTS`: API rate limit (default: 100)
- `LOG_LEVEL`: Logging level (default: info)
- `VITE_APP_TITLE`: App title (default: Honest Eye)
- `VITE_APP_VERSION`: App version (default: 1.0.0)

## Troubleshooting

### CORS Issues
- Ensure `FRONTEND_URL` and `CORS_ORIGIN` in backend match your actual frontend URL
- Redeploy backend after updating CORS settings

### API Connection Issues
- Verify `VITE_API_URL` in frontend points to correct backend URL
- Check if backend is deployed and accessible
- Ensure Google API key is correctly set in backend

### Build Issues
- Check build logs in Vercel dashboard
- Ensure all dependencies are listed in package.json
- Verify TypeScript compilation succeeds locally

## Custom Domain (Optional)

1. In Vercel dashboard, go to your project settings
2. Click on "Domains"
3. Add your custom domain
4. Update DNS settings as instructed by Vercel
5. Update environment variables to use your custom domain instead of vercel.app URLs

## Monitoring and Logs

- View logs in Vercel dashboard under "Functions" tab
- Monitor API usage and performance
- Set up alerts for errors or high usage

Your Honest Eye application should now be fully deployed and accessible worldwide!