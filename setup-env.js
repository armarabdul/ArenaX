const fs = require('fs');
const path = require('path');

// Backend .env content
const backendEnv = `PORT=5000
MONGODB_URI=mongodb://localhost:27017/arenax
JWT_SECRET=arenax-super-secret-jwt-key-change-in-production-2024
NODE_ENV=development
CLIENT_URL=http://localhost:3000
`;

// Frontend .env content
const frontendEnv = `REACT_APP_API_URL=http://localhost:5000
`;

// Create backend .env
const backendEnvPath = path.join(__dirname, 'backend', '.env');
if (!fs.existsSync(backendEnvPath)) {
  fs.writeFileSync(backendEnvPath, backendEnv);
  console.log('✅ Created backend/.env');
} else {
  console.log('⚠️  backend/.env already exists, skipping...');
}

// Create frontend .env
const frontendEnvPath = path.join(__dirname, 'frontend', '.env');
if (!fs.existsSync(frontendEnvPath)) {
  fs.writeFileSync(frontendEnvPath, frontendEnv);
  console.log('✅ Created frontend/.env');
} else {
  console.log('⚠️  frontend/.env already exists, skipping...');
}

console.log('\n📝 Environment files created successfully!');
console.log('\n⚠️  IMPORTANT: Update backend/.env with your MongoDB connection string if using MongoDB Atlas');
console.log('⚠️  IMPORTANT: Change JWT_SECRET to a strong random string in production\n');

