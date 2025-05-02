// api/feedback.js - Serverless API for handling feedback with DynamoDB
const AWS = require('aws-sdk');

// Configure AWS SDK
const dynamoDB = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const TABLE_NAME = 'feedback';

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    // GET request - retrieve feedback with optional filters
    if (req.method === 'GET') {
      const { projectName, sentiment, searchMethod, searchText } = req.query;
      
      // Start with basic params
      const params = {
        TableName: TABLE_NAME
      };
      
      // Apply filters if needed (would need to use FilterExpression for more complex filtering)
      // Note: This is a simplified example. For production, you would implement more efficient querying
      const { Items } = await dynamoDB.scan(params).promise();
      
      // Apply filters in memory (for simplicity)
      let filteredItems = Items || [];
      
      if (projectName) {
        filteredItems = filteredItems.filter(item => item.projectName === projectName);
      }
      
      if (sentiment) {
        filteredItems = filteredItems.filter(item => item.sentiment === sentiment);
      }
      
      if (searchMethod) {
        filteredItems = filteredItems.filter(item => item.searchMethod === searchMethod);
      }
      
      if (searchText) {
        const searchLower = searchText.toLowerCase();
        filteredItems = filteredItems.filter(item => {
          // Check all string fields in the item for the search text
          return Object.values(item).some(value => {
            // Only search string values
            if (typeof value === 'string') {
              return value.toLowerCase().includes(searchLower);
            }
            return false;
          });
        });
      }
      
      return res.status(200).json(filteredItems);
    }
    
    // POST request - add new feedback
    if (req.method === 'POST') {
      const feedback = req.body;
      
      // Validate required fields
      if (!feedback.id || !feedback.projectName || !feedback.sentiment) {
        return res.status(400).json({ 
          error: 'Missing required fields: id, projectName, sentiment' 
        });
      }
      
      // Store in DynamoDB
      const params = {
        TableName: TABLE_NAME,
        Item: feedback
      };
      
      await dynamoDB.put(params).promise();
      
      return res.status(201).json({ success: true });
    }

    // DELETE request - delete feedback
    if (req.method === 'DELETE') {
      const id = req.url.split('/').pop();
      
      if (!id) {
        return res.status(400).json({
          error: 'Missing feedback id'
        });
      }
      
      // Delete from DynamoDB
      const params = {
        TableName: TABLE_NAME,
        Key: { id }
      };
      
      await dynamoDB.delete(params).promise();
      
      return res.status(200).json({ success: true });
    }

    // PATCH request - update feedback
    if (req.method === 'PATCH') {
      const id = req.url.split('/').pop();
      const updates = req.body;
      
      if (!id) {
        return res.status(400).json({
          error: 'Missing feedback id'
        });
      }
      
      // Build update expression
      let updateExpression = 'set';
      let expressionAttributeNames = {};
      let expressionAttributeValues = {};
      
      for (const [key, value] of Object.entries(updates)) {
        updateExpression += ` #${key} = :${key},`;
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = value;
      }
      
      // Remove trailing comma
      updateExpression = updateExpression.slice(0, -1);
      
      // Update in DynamoDB
      const params = {
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'UPDATED_NEW'
      };
      
      await dynamoDB.update(params).promise();
      
      return res.status(200).json({ success: true });
    }
    
    // Handle unsupported methods
    return res.status(405).json({ error: 'Method not allowed' });
    
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}; 