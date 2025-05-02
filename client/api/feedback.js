import { feedbackStore } from './data.js';

export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Handle GET request - Return feedback data with optional filters
  if (req.method === 'GET') {
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
    
    return res.status(200).json(filteredFeedback);
  }

  // Handle POST request - Add new feedback
  if (req.method === 'POST') {
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
    
    return res.status(201).json({ success: true });
  }

  // Handle DELETE request - Delete feedback
  if (req.method === 'DELETE') {
    const id = req.url.split('/').pop();
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Missing feedback id'
      });
    }
    
    const index = feedbackStore.findIndex(item => item.id === id);
    
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }
    
    // Remove from store
    feedbackStore.splice(index, 1);
    
    return res.status(200).json({ success: true });
  }

  // Handle PATCH request - Update feedback
  if (req.method === 'PATCH') {
    const id = req.url.split('/').pop();
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Missing feedback id'
      });
    }
    
    const index = feedbackStore.findIndex(item => item.id === id);
    
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }
    
    // Update the feedback
    feedbackStore[index] = {
      ...feedbackStore[index],
      ...req.body
    };
    
    return res.status(200).json({ success: true });
  }

  // Handle unsupported methods
  return res.status(405).json({ error: 'Method not allowed' });
} 