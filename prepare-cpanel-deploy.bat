@echo off
echo ========================================
echo ArenaX - Prepare for cPanel Deployment
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo [1/4] Installing frontend dependencies...
cd frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [2/4] Checking for .env.production...
if not exist .env.production (
    echo WARNING: .env.production not found!
    echo Creating template...
    (
        echo REACT_APP_API_URL=https://your-backend-url.onrender.com
    ) > .env.production
    echo.
    echo Please edit frontend\.env.production and set your backend URL
    echo Then run this script again.
    pause
    exit /b 1
)

echo.
echo [3/4] Building frontend for production...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo [4/4] Preparing files...
cd build

REM Create a zip file for easy upload
echo Creating deployment package...
powershell -Command "Compress-Archive -Path * -DestinationPath ..\..\arenax-frontend-build.zip -Force"

cd ..\..

echo.
echo ========================================
echo Build Complete!
echo ========================================
echo.
echo Your production build is ready in: frontend\build\
echo A ZIP file has been created: arenax-frontend-build.zip
echo.
echo Next steps:
echo 1. Upload all files from frontend\build\ to your cPanel public_html directory
echo 2. Or upload the ZIP file and extract it in cPanel
echo 3. Create .htaccess file in public_html (see GODADDY_CPANEL_DEPLOYMENT.md)
echo.
pause

