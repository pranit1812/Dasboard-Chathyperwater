// Mock API for local development using Vite
import { feedbackStore } from './data.js';

// This file is used by Vite dev server to handle API requests
export default function handler(req) {
  // Implement API route handlers
  const { url, method } = req;
  
  // GET /api/feedback
  if (url === '/api/feedback' && method === 'GET') {
    // Return all feedback data
    return new Response(JSON.stringify(feedbackStore), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
  
  // POST /api/feedback
  if (url === '/api/feedback' && method === 'POST') {
    try {
      // Parse the request body
      const feedback = JSON.parse(req.body);
      
      // Validate required fields
      if (!feedback.id || !feedback.projectName || !feedback.sentiment) {
        return new Response(JSON.stringify({
          success: false,
          message: 'Missing required fields: id, projectName, sentiment'
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
      
      // Add to store
      feedbackStore.push(feedback);
      
      return new Response(JSON.stringify({ success: true }), {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Invalid JSON payload'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  }
  
  // DELETE /api/feedback/:id
  if (url.startsWith('/api/feedback/') && method === 'DELETE') {
    // Extract ID from URL
    const id = url.split('/').pop();
    
    // Find index of item to delete
    const index = feedbackStore.findIndex(item => item.id === id);
    
    if (index === -1) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Feedback not found'
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // Remove from store
    feedbackStore.splice(index, 1);
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
  
  // PATCH /api/feedback/:id
  if (url.startsWith('/api/feedback/') && method === 'PATCH') {
    try {
      // Extract ID from URL
      const id = url.split('/').pop();
      
      // Find index of item to update
      const index = feedbackStore.findIndex(item => item.id === id);
      
      if (index === -1) {
        return new Response(JSON.stringify({
          success: false,
          message: 'Feedback not found'
        }), {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
      
      // Parse the request body
      const updates = JSON.parse(req.body);
      
      // Update the feedback
      feedbackStore[index] = {
        ...feedbackStore[index],
        ...updates
      };
      
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Invalid JSON payload'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  }
  
  // Handle OPTIONS requests for CORS
  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }
  
  // For all other routes, return 404
  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
} 