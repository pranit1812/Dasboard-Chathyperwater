# Feedback Dashboard - Vercel Deployment Guide

This application is configured for deployment on Vercel with both the frontend and backend API routes in the same project.

## Deployment Steps

1. Install the Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Log in to Vercel:
   ```
   vercel login
   ```

3. Deploy from the client directory:
   ```
   cd client
   vercel
   ```

4. For production deployment:
   ```
   vercel --prod
   ```

## How It Works

- The frontend is a React application built with Vite
- API routes are located in the `/api` directory
- Data is stored in-memory (Note: since Vercel functions are stateless, data will reset on each deployment)

## Environment Variables

No environment variables are required for basic deployment.

## Limitations

- Since this uses in-memory storage, data will not persist between function invocations
- For production use, consider adding a database like MongoDB Atlas, Supabase, or Firebase

## Testing API Endpoints

Once deployed, you can test the API endpoints:

- GET: `https://your-vercel-app.vercel.app/api/feedback`
- POST: `https://your-vercel-app.vercel.app/api/feedback` with JSON body

Example POST body:
```json
{
  "id": "resp-123",
  "projectName": "Project XYZ",
  "query": "How do I implement X?",
  "answer": "Do Y...",
  "sentiment": "up",
  "user.id": "user-001",
  "user.email": "user@example.com",
  "searchMethod": "local",
  "commentText": "Great response!"
}
``` 