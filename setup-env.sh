#!/bin/bash

# Create backend .env file
if [ ! -f "backend/.env" ]; then
  cat > backend/.env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/arenax
JWT_SECRET=arenax-super-secret-jwt-key-change-in-production-2024
NODE_ENV=development
CLIENT_URL=http://localhost:3000
EOF
  echo "✅ Created backend/.env"
else
  echo "⚠️  backend/.env already exists, skipping..."
fi

# Create frontend .env file
if [ ! -f "frontend/.env" ]; then
  cat > frontend/.env << EOF
REACT_APP_API_URL=http://localhost:5000
EOF
  echo "✅ Created frontend/.env"
else
  echo "⚠️  frontend/.env already exists, skipping..."
fi

echo ""
echo "📝 Environment files created successfully!"
echo ""
echo "⚠️  IMPORTANT: Update backend/.env with your MongoDB connection string if using MongoDB Atlas"
echo "⚠️  IMPORTANT: Change JWT_SECRET to a strong random string in production"
echo ""

