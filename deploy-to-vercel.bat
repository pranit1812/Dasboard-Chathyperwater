@echo off
echo Deploying Feedback Dashboard to Vercel

rem Check if Vercel CLI is installed
where vercel >nul 2>nul
if %ERRORLEVEL% neq 0 (
  echo Vercel CLI not found. Installing...
  call npm install -g vercel
)

rem Navigate to client directory
cd client

rem Clean previous build if exists
if exist dist (
  echo Cleaning previous build...
  rmdir /s /q dist
)

rem Build the app
echo Building the application...
call npm run build

rem Deploy to Vercel
echo Deploying to Vercel...
echo.
echo NOTE: If you haven't logged in to Vercel, you'll be prompted to do so.
echo If this is your first deployment, you'll need to configure your project.
echo.
echo Press any key to continue with deployment...
pause >nul

vercel --prod

echo.
echo Deployment process completed.
echo If deployment was successful, your app should now be available online. 