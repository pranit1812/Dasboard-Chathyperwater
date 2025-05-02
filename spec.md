# 📝 Feedback Dashboard Specification

## ✅ Goal

Build a simple web application that:
* Collects feedback via POST requests to `/api/feedback`
* Displays feedback entries in a filterable dashboard table
* Allows filtering by `projectName`, `sentiment`, and `searchMethod`
* Shows a sentiment distribution pie chart
* Uses custom color palette for consistent styling
* Is deployable with minimal configuration

## 🛠 Tech Stack

| Layer      | Technology                        |
| ---------- | --------------------------------- |
| Frontend   | React + Tailwind CSS              |
| Backend    | Node.js (Express.js)              |
| Charting   | Chart.js                          |
| Storage    | In-Memory (array only)            |
| Deployment | Vercel or Render (no DB required) |

## 🎨 Color Scheme

The application will use the following Tailwind-compatible hex values:
* `#0F172A` (Deep Navy) — Background color
* `#22D3EE` (Cyan) — Primary accent color
* `#3B82F6` (Blue) — Secondary accent color
* `#A855F7` (Purple) — Highlight color
* `#FACC15` (Yellow) — Sentiment: "comment"
* `#22C55E` (Green) — Sentiment: "thumbs up"
* `#EF4444` (Red) — Sentiment: "thumbs down"
* `#E2E8F0` (Light Gray) — Text and table backgrounds

## 📦 Project Structure

```
feedback-dashboard/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── FeedbackTable.jsx
│   │   ├── SentimentChart.jsx
│   │   ├── FilterControls.jsx
│   │   └── Layout.jsx
│   ├── api/
│   │   └── index.js
│   ├── utils/
│   │   └── helpers.js
│   ├── App.jsx
│   └── main.jsx
├── server/
│   └── index.js
├── tailwind.config.js
├── package.json
└── README.md
```

## 📤 API Specification

### POST `/api/feedback`

#### Request Headers:
* `Content-Type: application/json`

#### Request Body:
```json
{
  "id": "resp-123",
  "projectName": "Project XYZ",
  "query": "How do I implement X?",
  "answer": "Do Y...",
  "sentiment": "up", // or "down", or "comment"
  "user.id": "user-001",
  "user.email": "user@example.com",
  "searchMethod": "local",
  "commentText": "optional"
}
```

#### Response:
```json
{ "success": true }
```

### GET `/api/feedback`

#### Query Parameters (optional):
* `projectName`: Filter by project name
* `sentiment`: Filter by sentiment value
* `searchMethod`: Filter by search method

#### Response:
```json
[
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
  },
  // More feedback entries...
]
```

## 💻 Frontend Components

### Dashboard Page
* Main container with filtering options and data display
* Responsive layout for desktop and mobile

### FeedbackTable
* Sortable columns
* Pagination (if needed)
* Row highlighting based on sentiment
* Details expansion for full feedback content

### SentimentChart
* Pie chart showing distribution of feedback sentiments
* Updates dynamically based on applied filters
* Uses sentiment-specific colors

### FilterControls
* Dropdown for project name selection
* Toggle buttons for sentiment types
* Dropdown for search methods
* Text search input

## 🧠 Implementation Details

### Backend
* Use in-memory array to store feedback: `let feedbackStore = []`
* Implement validation for incoming feedback
* Add filtering logic to GET endpoint

### Frontend
* Use React hooks for state management
* Implement debounced search functionality
* Use Tailwind CSS for styling
* Fetch data on mount and when filters change

## 🚀 Deployment Specifications

* No database or authentication required
* Environment variable: `APP_FEEDBACK_API_URL` for API endpoint
* Deployable to Vercel, Render, or Netlify
* Single repository deployment preferred 