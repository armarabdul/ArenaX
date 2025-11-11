# ArenaX Quick Start Guide

## 🚀 Complete Setup in 5 Steps

### Step 1: Install Dependencies
```bash
npm run install-all
```

### Step 2: Setup Environment Variables
```bash
npm run setup-env
```

### Step 3: Start MongoDB
- **Local MongoDB**: Make sure MongoDB is running
- **MongoDB Atlas**: Update `backend/.env` with your connection string

### Step 4: Start Backend Server
```bash
cd backend
npm run dev
```
Keep this terminal running!

### Step 5: Create Admin Accounts
Open a **new terminal** and run:
```bash
npm run create-admins
```

This will create 10 admin accounts:
- admin1@arenax.com through admin10@arenax.com
- Password: `Admin123!` (change after first login!)

## 🎮 Start Using ArenaX

### 6. Start Frontend (Optional - in another terminal)
```bash
cd frontend
npm start
```

Or use the dev script to run both:
```bash
npm run dev
```

### 7. Login to Admin Dashboard
1. Go to: http://localhost:3000/admin/login
2. Use any admin credentials (e.g., admin1@arenax.com / Admin123!)
3. Click "Login"

### 8. Initialize Games
1. In Admin Dashboard, go to "Game Control" tab
2. Click "Initialize Games" button
3. All 10 games will be created

### 9. Start Managing!
- Add players in "Player Management" tab
- Assign players to games in "Game Control" tab
- Mark results and watch the leaderboard update in real-time!

## 📋 Admin Credentials

| Email | Password |
|-------|----------|
| admin1@arenax.com | Admin123! |
| admin2@arenax.com | Admin123! |
| admin3@arenax.com | Admin123! |
| admin4@arenax.com | Admin123! |
| admin5@arenax.com | Admin123! |
| admin6@arenax.com | Admin123! |
| admin7@arenax.com | Admin123! |
| admin8@arenax.com | Admin123! |
| admin9@arenax.com | Admin123! |
| admin10@arenax.com | Admin123! |

**⚠️ Change passwords after first login!**

## 🔧 Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify `backend/.env` file exists and has correct MongoDB URI
- Check if port 5000 is available

### Can't create admins
- Make sure backend server is running first
- Check if MongoDB is connected
- Verify API URL in script matches your backend URL

### Frontend won't connect
- Ensure backend is running on port 5000
- Check `frontend/.env` has correct `REACT_APP_API_URL`
- Clear browser cache and restart

## 📚 More Information

- **Full Setup Guide**: See `SETUP.md`
- **Environment Variables**: See `ENV_SETUP.md`
- **Admin Credentials**: See `ADMIN_CREDENTIALS.md`
- **API Documentation**: See `README.md`

---

**Ready to compete? Let's go! 🎮🏆**

