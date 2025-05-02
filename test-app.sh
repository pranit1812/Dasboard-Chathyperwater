#!/bin/bash

# Navigate to client directory
cd client

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing client dependencies..."
  npm install
fi

# Run development server
echo "Starting the development server..."
echo "Once the server starts, you can test the application at http://localhost:5173"
echo "You can add test data using the 'Add New Feedback' form"
npm run dev

# Note: Press Ctrl+C to stop the server 