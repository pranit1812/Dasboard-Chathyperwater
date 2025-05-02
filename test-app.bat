@echo off
echo Testing Feedback Dashboard application

rem Navigate to client directory
cd client

rem Install dependencies if needed
if not exist node_modules (
  echo Installing client dependencies...
  call npm install
)

rem Run development server
echo Starting the development server...
echo Once the server starts, you can test the application at http://localhost:5173
echo You can add test data using the 'Add New Feedback' form
call npm run dev

rem Note: Press Ctrl+C to stop the server 