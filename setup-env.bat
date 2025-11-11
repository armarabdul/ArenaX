@echo off
REM Create backend .env file
if not exist "backend\.env" (
  (
    echo PORT=5000
    echo MONGODB_URI=mongodb://localhost:27017/arenax
    echo JWT_SECRET=arenax-super-secret-jwt-key-change-in-production-2024
    echo NODE_ENV=development
    echo CLIENT_URL=http://localhost:3000
  ) > backend\.env
  echo ✅ Created backend/.env
) else (
  echo ⚠️  backend/.env already exists, skipping...
)

REM Create frontend .env file
if not exist "frontend\.env" (
  (
    echo REACT_APP_API_URL=http://localhost:5000
  ) > frontend\.env
  echo ✅ Created frontend/.env
) else (
  echo ⚠️  frontend/.env already exists, skipping...
)

echo.
echo 📝 Environment files created successfully!
echo.
echo ⚠️  IMPORTANT: Update backend/.env with your MongoDB connection string if using MongoDB Atlas
echo ⚠️  IMPORTANT: Change JWT_SECRET to a strong random string in production
echo.

pause

