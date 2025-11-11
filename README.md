# ArenaX Event Manager

A full-stack web application for hosting the ARENA X multi-game competition. Built with React, Node.js, Express, and MongoDB.

## 🚀 Features

- **Admin Dashboard**: Secure login system for managing matches and results
- **Player Management**: Registration, profile tracking, and statistics
- **Game Control Panel**: Assign players to games and mark win/lose results
- **Live Leaderboard**: Auto-refreshing leaderboard with real-time updates
- **Public Pages**: Rules, game info, and leaderboard display for public viewing

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Framer Motion (animations)
- React Router (navigation)
- Axios (API calls)
- Socket.io Client (real-time updates)

### Backend
- Node.js
- Express.js
- MongoDB (via Mongoose)
- Socket.io (real-time leaderboard)
- JWT (authentication)
- Bcrypt (password hashing)

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Setup Steps

1. **Clone the repository**
   ```bash
   cd ArenaX
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```
   Or install separately:
   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Configure environment variables**

   Create `backend/.env` file:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/arenax
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

   Create `frontend/.env` file:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

4. **Start MongoDB**
   - If using local MongoDB, make sure it's running
   - If using MongoDB Atlas, update the connection string in `.env`

5. **Run the application**

   Development mode (runs both frontend and backend):
   ```bash
   npm run dev
   ```

   Or run separately:
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🔐 Initial Setup

### Create Admin Account

Before logging in, you need to create an admin account. You can do this via API:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@arenax.com",
    "password": "your-password",
    "name": "Admin Name"
  }'
```

Or use Postman/Thunder Client to make the request.

### Initialize Games

After starting the server, initialize the 10 games by logging into the admin dashboard and clicking "Initialize Games" in the Game Control tab, or via API:

```bash
curl -X POST http://localhost:5000/api/game/initialize \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📁 Project Structure

```
ArenaX/
├── backend/
│   ├── models/
│   │   ├── Player.js
│   │   ├── Game.js
│   │   └── Admin.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── player.js
│   │   ├── game.js
│   │   ├── leaderboard.js
│   │   └── admin.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Admin/
│   │   │   ├── Public/
│   │   │   └── Shared/
│   │   ├── context/
│   │   ├── utils/
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
└── README.md
```

## 🎮 Game System

### Coin System
- Each player starts with **10 coins**
- Games have an entry cost (1-2 coins)
- Winners get their entry coins refunded + points
- Losers lose their entry coins

### Scoring
- Single-player games: **3 points** per win
- Faceoff games: **5 points** per win
- Leaderboard ranked by total points

### Games
1. Match the Soda (Single, 1 coin, 3 pts)
2. Guess the Meme (Single, 1 coin, 3 pts)
3. Flag Race (Single, 1 coin, 3 pts)
4. Speed Typing (Single, 1 coin, 3 pts)
5. Memory Match (Single, 1 coin, 3 pts)
6. Math Challenge (Single, 1 coin, 3 pts)
7. Word Puzzle (Single, 1 coin, 3 pts)
8. Reaction Test (Single, 1 coin, 3 pts)
9. Tic Tac Toe (Faceoff, 2 coins, 5 pts)
10. Rock Paper Scissors (Faceoff, 2 coins, 5 pts)

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register admin (initial setup)
- `POST /api/auth/login` - Admin login

### Players
- `GET /api/player` - Get all players
- `GET /api/player/:id` - Get player by ID (admin only)
- `POST /api/player/add` - Add new player (admin only)
- `PUT /api/player/update/:id` - Update player (admin only)
- `DELETE /api/player/:id` - Delete player (admin only)

### Games
- `GET /api/game` - Get all games
- `GET /api/game/:id` - Get game by ID
- `POST /api/game/start` - Start game with players (admin only)
- `PUT /api/game/result` - Mark game results (admin only)
- `POST /api/game/initialize` - Initialize all games (admin only)

### Leaderboard
- `GET /api/leaderboard` - Get sorted leaderboard

### Admin
- `GET /api/admin/stats` - Get dashboard statistics (admin only)
- `PUT /api/admin/reset` - Reset leaderboard (admin only)

## 🚢 Deployment

### Quick Deploy to Render

**See detailed guides:**
- `QUICK_DEPLOY.md` - Fast 5-step deployment guide
- `DEPLOYMENT.md` - Comprehensive deployment instructions
- `DEPLOY_CHECKLIST.md` - Pre-deployment checklist

### Quick Steps:

1. **Setup MongoDB Atlas** (5 min)
   - Create free cluster
   - Configure network access
   - Get connection string

2. **Deploy Backend to Render** (10 min)
   - New Web Service
   - Build: `cd backend && npm install`
   - Start: `cd backend && node server.js`
   - Set environment variables

3. **Deploy Frontend to Render** (10 min)
   - New Static Site
   - Build: `cd frontend && npm install && npm run build`
   - Publish: `frontend/build`
   - Set `REACT_APP_API_URL`

4. **Update Environment Variables**
   - Backend: Update `CLIENT_URL` to frontend URL
   - Frontend: Update `REACT_APP_API_URL` to backend URL

5. **Create Admin & Initialize**
   - Create admin via API
   - Login and initialize games

**Full instructions**: See `DEPLOYMENT.md`

## 🎨 Design

- **Theme Colors**: Neon Blue (#00BFFF) and Electric Purple (#9B30FF)
- **Fonts**: Orbitron (headings), Poppins (body), Bebas Neue (accents)
- **Style**: Futuristic, gaming-inspired UI with neon glow effects

## 📝 License

ISC

## 👥 Contributors

[Add your name here]

---

**Built with ❤️ for ArenaX Event**

