# Feedback Dashboard - Client

This is the frontend and API part of the Feedback Dashboard application, optimized for Vercel deployment.

## Development

### Standard Development (Vercel API routes)

For standard development using the built-in Vercel serverless API:

```
npm install
npm run dev
```

This will start the development server at http://localhost:5173 and use the local API routes.

### Express Backend Development

If you want to use the separate Express backend:

1. Start the Express server from the project root:
   ```
   cd ../server
   npm install
   npm run dev
   ```

2. Start the client with the Express API URL:
   ```
   npm run dev:express
   ```

This will configure the frontend to use the Express backend at http://localhost:3001/api/feedback.

## Building for Production

```
npm run build
```

## Scripts

- `npm run dev` - Start the development server
- `npm run dev:express` - Start development with Express backend
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally
- `npm run vercel-build` - Build for Vercel deployment

## API Routes

- `/api/feedback` - GET and POST endpoints for feedback data

## Environment Variables

- `VITE_API_URL` - Custom API URL (defaults to '/api/feedback' if not set)
