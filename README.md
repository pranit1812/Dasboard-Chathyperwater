# Feedback Dashboard

A modern dashboard application for visualizing user feedback data with filtering capabilities and sentiment distribution charts.

## Features

- Display feedback entries in a sortable table
- Filter feedback by project, sentiment, and search method
- Search through feedback content with text search
- Visualize sentiment distribution with a pie chart
- Responsive design that works on desktop and mobile
- DynamoDB integration for persistent data storage

## Technologies Used

- React with Vite for frontend
- Tailwind CSS for styling
- Chart.js for data visualization
- AWS DynamoDB for data storage
- Vercel serverless functions for API

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- AWS account (for DynamoDB)

### Local Development

1. Clone this repository
2. Install dependencies:
   ```
   npm run install:all
   ```
3. Start the development server:
   ```
   npm run dev
   ```
   
   Or for Windows users:
   ```
   .\test-app.bat
   ```

4. Open your browser to `http://localhost:5173`

## DynamoDB Setup

1. Create a DynamoDB table named `feedback` in your AWS account with the following schema:
   - Partition key: `id` (String)

2. Create a user with programmatic access and the following permissions:
   - `dynamodb:GetItem`
   - `dynamodb:PutItem`
   - `dynamodb:Scan`
   - `dynamodb:Query`
   - `dynamodb:UpdateItem`
   - `dynamodb:DeleteItem`

3. Set the following environment variables in your Vercel project:
   - `AWS_REGION`: The AWS region where your DynamoDB table is located (e.g., 'us-east-1')
   - `AWS_ACCESS_KEY_ID`: Your AWS access key ID
   - `AWS_SECRET_ACCESS_KEY`: Your AWS secret access key

## Deployment to Vercel

### Automatic Deployment

For Windows users, run:
```
.\deploy-to-vercel.bat
```

This script will:
1. Check for Vercel CLI and install it if needed
2. Clean previous build files
3. Build the application
4. Deploy to Vercel

### Manual Deployment

1. Navigate to the client directory:
   ```
   cd client
   ```

2. Build the app:
   ```
   npm run build
   ```

3. Deploy to Vercel:
   ```
   vercel --prod
   ```

## API Usage

### GET Feedback
`GET /api/feedback`

Optional query parameters:
- `projectName`: Filter by project name
- `sentiment`: Filter by sentiment ("up", "down", "comment")
- `searchMethod`: Filter by search method
- `searchText`: Search by content

### POST Feedback
`POST /api/feedback`

Request body:
```json
{
  "id": "resp-123",
  "projectName": "Project Name",
  "query": "How do I implement feature X?",
  "answer": "You can use...",
  "sentiment": "up",
  "user.id": "user-001",
  "user.email": "user@example.com",
  "searchMethod": "local",
  "commentText": "Great response!"
}
```

Required fields:
- `id`: Unique identifier
- `projectName`: Project name
- `sentiment`: One of "up", "down", or "comment"

## Project Structure

- `client/` - Frontend React application
  - `src/components/` - React components
  - `src/api/` - API client and mock implementation
  - `src/assets/` - Static assets
- `api/` - Serverless API functions
  - `feedback.js` - DynamoDB integration
- `public/` - Public static files

## Customization

To customize:
1. Edit the initial data in `client/src/api/mockApi.js` (for local development)
2. Modify the color scheme in the Tailwind configuration

## ✅ Completed Features

- API endpoints for submitting and retrieving feedback
- Filtering capabilities by project, sentiment, and search method
- Modern UI with custom color scheme based on specification
- Sentiment distribution visualization with Chart.js
- Responsive design for all screen sizes
- **NEW**: Vercel deployment ready with serverless API functions

## Tech Stack

- **Frontend**: React with Tailwind CSS
- **Backend**: Vercel Serverless Functions
- **Charts**: Chart.js
- **Storage**: In-Memory (array)
- **Deployment**: Ready for Vercel

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation and Development

1. Clone the repository
   ```
   git clone <repository-url>
   cd feedback-dashboard
   ```

2. Install client dependencies
   ```
   cd client
   npm install
   ```

3. Start the development server
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Vercel Deployment (Recommended)

This project is set up for easy deployment to Vercel with both frontend and API routes in a single deployment:

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

See [client/README-VERCEL.md](./client/README-VERCEL.md) for more details on Vercel deployment.

## Local Development

For local development with separate frontend and backend:

1. Start the backend (from project root):
   ```
   cd server
   npm install
   npm run dev
   ```

2. In another terminal, start the frontend (edit API_URL in client/src/App.jsx to point to http://localhost:3001/api/feedback):
   ```
   cd client
   npm run dev
   ```

## Project Structure

The project follows a structure optimized for Vercel deployment:

```
feedback-dashboard/
├── client/             # React frontend + API routes
│   ├── api/            # Vercel API routes
│   │   ├── feedback.js # API endpoint
│   │   └── data.js     # Data store
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FeedbackTable.jsx
│   │   │   ├── SentimentChart.jsx
│   │   │   ├── FilterControls.jsx
│   │   │   └── Layout.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vercel.json     # Vercel configuration
│   └── package.json
├── server/             # Optional Express backend (for local dev)
│   └── index.js
├── package.json        # Root package.json
├── README.md
├── spec.md
└── tasks.md
```

## API Usage

### Submit Feedback

POST `/api/feedback`

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

### Retrieve Feedback

GET `/api/feedback`

Optional query parameters:
- `projectName`: Filter by project
- `sentiment`: Filter by sentiment ("up", "down", "comment")
- `searchMethod`: Filter by search method

## Deployment

This application can be deployed to Vercel, Render, or Netlify with minimal configuration.

### Environment Variables

- `PORT`: Server port (default: 3001)
- `APP_FEEDBACK_API_URL`: API endpoint URL for production

## Project Structure

See [spec.md](./spec.md) for detailed project structure and specifications.

## Development Roadmap

See [tasks.md](./tasks.md) for a breakdown of project tasks and their status.

## License

MIT 