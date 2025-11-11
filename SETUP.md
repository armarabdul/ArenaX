# ArenaX Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm run install-all
```

### 2. Configure Environment

#### Backend Configuration
Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/arenax
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

#### Frontend Configuration
Create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000
```

### 3. Start MongoDB

**Local MongoDB:**
```bash
# Make sure MongoDB is running on your system
mongod
```

**MongoDB Atlas (Cloud):**
- Create account at https://www.mongodb.com/cloud/atlas
- Create a cluster
- Get connection string
- Update `MONGODB_URI` in `backend/.env`

### 4. Start the Application

**Development Mode (Both Frontend & Backend):**
```bash
npm run dev
```

**Or separately:**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

### 5. Initial Setup

#### Create Admin Account

Open a new terminal and run:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@arenax.com",
    "password": "admin123",
    "name": "Admin"
  }'
```

Or use Postman/Thunder Client:
- Method: POST
- URL: http://localhost:5000/api/auth/register
- Body (JSON):
```json
{
  "email": "admin@arenax.com",
  "password": "admin123",
  "name": "Admin"
}
```

#### Initialize Games

1. Login at http://localhost:3000/admin/login
2. Go to "Game Control" tab
3. Click "Initialize Games" button

Or via API (after getting token from login):
```bash
curl -X POST http://localhost:5000/api/game/initialize \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 6. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Dashboard**: http://localhost:3000/admin/dashboard (after login)

## Troubleshooting

### MongoDB Connection Error
- Check if MongoDB is running
- Verify connection string in `backend/.env`
- For Atlas, ensure IP whitelist includes your IP

### Port Already in Use
- Change `PORT` in `backend/.env`
- Update `REACT_APP_API_URL` in `frontend/.env` accordingly

### CORS Errors
- Ensure `CLIENT_URL` in backend `.env` matches your frontend URL
- Check that frontend is running on the correct port

### Socket.io Connection Issues
- Verify `REACT_APP_API_URL` in frontend `.env` matches backend URL
- Check browser console for connection errors

## Next Steps

1. ✅ Create admin account
2. ✅ Initialize games
3. ✅ Add players via admin dashboard
4. ✅ Start games and mark results
5. ✅ View live leaderboard

Enjoy managing ArenaX! 🎮

