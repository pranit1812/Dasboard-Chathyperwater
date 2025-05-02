const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// In-memory data store
let feedbackStore = [];

// Routes
app.get('/api/feedback', (req, res) => {
  const { projectName, sentiment, searchMethod } = req.query;
  
  // Filter the feedback based on query parameters
  let filteredFeedback = [...feedbackStore];
  
  if (projectName) {
    filteredFeedback = filteredFeedback.filter(
      feedback => feedback.projectName === projectName
    );
  }
  
  if (sentiment) {
    filteredFeedback = filteredFeedback.filter(
      feedback => feedback.sentiment === sentiment
    );
  }
  
  if (searchMethod) {
    filteredFeedback = filteredFeedback.filter(
      feedback => feedback.searchMethod === searchMethod
    );
  }
  
  res.json(filteredFeedback);
});

app.post('/api/feedback', (req, res) => {
  const feedback = req.body;
  
  // Validate required fields
  if (!feedback.id || !feedback.projectName || !feedback.sentiment) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing required fields: id, projectName, sentiment' 
    });
  }
  
  // Add to store
  feedbackStore.push(feedback);
  
  res.status(201).json({ success: true });
});

// Seed some initial data for testing
feedbackStore = [
  {
    id: 'resp-001',
    projectName: 'Project Alpha',
    query: 'How do I implement feature X?',
    answer: 'You can use the following approach...',
    sentiment: 'up',
    'user.id': 'user-001',
    'user.email': 'user1@example.com',
    searchMethod: 'local',
    commentText: 'Great response!'
  },
  {
    id: 'resp-002',
    projectName: 'Project Beta',
    query: 'Why isn\'t feature Y working?',
    answer: 'There seems to be an issue with...',
    sentiment: 'down',
    'user.id': 'user-002',
    'user.email': 'user2@example.com',
    searchMethod: 'api',
    commentText: 'This didn\'t solve my problem'
  },
  {
    id: 'resp-003',
    projectName: 'Project Alpha',
    query: 'Can you explain how Z works?',
    answer: 'Z is a functionality that...',
    sentiment: 'comment',
    'user.id': 'user-003',
    'user.email': 'user3@example.com',
    searchMethod: 'local',
    commentText: 'I need more details'
  }
];

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 