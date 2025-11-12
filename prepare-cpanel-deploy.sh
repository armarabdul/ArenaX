#!/bin/bash

echo "========================================"
echo "ArenaX - Prepare for cPanel Deployment"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org"
    exit 1
fi

echo "[1/4] Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi

echo ""
echo "[2/4] Checking for .env.production..."
if [ ! -f .env.production ]; then
    echo "WARNING: .env.production not found!"
    echo "Creating template..."
    echo "REACT_APP_API_URL=https://your-backend-url.onrender.com" > .env.production
    echo ""
    echo "Please edit frontend/.env.production and set your backend URL"
    echo "Then run this script again."
    exit 1
fi

echo ""
echo "[3/4] Building frontend for production..."
npm run build
if [ $? -ne 0 ]; then
    echo "ERROR: Build failed"
    exit 1
fi

echo ""
echo "[4/4] Preparing files..."
cd build

# Create a zip file for easy upload
echo "Creating deployment package..."
zip -r ../../arenax-frontend-build.zip . -q

cd ../..

echo ""
echo "========================================"
echo "Build Complete!"
echo "========================================"
echo ""
echo "Your production build is ready in: frontend/build/"
echo "A ZIP file has been created: arenax-frontend-build.zip"
echo ""
echo "Next steps:"
echo "1. Upload all files from frontend/build/ to your cPanel public_html directory"
echo "2. Or upload the ZIP file and extract it in cPanel"
echo "3. Create .htaccess file in public_html (see GODADDY_CPANEL_DEPLOYMENT.md)"
echo ""

