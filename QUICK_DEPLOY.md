# Quick Deploy Guide - Render

## 🚀 Fast Track Deployment (5 Steps)

### Step 1: MongoDB Atlas Setup (5 minutes)
1. Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster (M0)
3. Database Access → Add user (save credentials)
4. Network Access → Allow from anywhere (0.0.0.0/0)
5. Get connection string: Database → Connect → Connect your application
   - Replace `<password>` and `<dbname>`
   - Example: `mongodb+srv://user:pass@cluster.mongodb.net/arenax?retryWrites=true&w=majority`

### Step 2: Deploy Backend (10 minutes)
1. Go to [dashboard.render.com](https://dashboard.render.com)
2. **New +** → **Web Service**
3. Connect GitHub repo
4. Settings:
   - **Name**: `arenax-backend`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && node server.js`
   - **Plan**: Free
5. Environment Variables:
   ```
   PORT=10000
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=generate-random-string-here
   NODE_ENV=production
   CLIENT_URL=https://arenax-frontend.onrender.com
   ```
6. **Create Web Service**
7. Wait for deployment, copy the URL

### Step 3: Deploy Frontend (10 minutes)
1. **New +** → **Static Site**
2. Connect same GitHub repo
3. Settings:
   - **Name**: `arenax-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/build`
4. Environment Variables:
   ```
   REACT_APP_API_URL=https://arenax-backend.onrender.com
   ```
5. **Create Static Site**
6. Wait for deployment, copy the URL

### Step 4: Update Backend CLIENT_URL
1. Go to backend service → **Environment**
2. Update `CLIENT_URL` to your frontend URL
3. **Save Changes** (auto-redeploys)

### Step 5: Create Admin & Initialize
1. Create admin via API:
   ```bash
   curl -X POST https://your-backend-url.onrender.com/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@arenax.com","password":"Admin123!","name":"Admin"}'
   ```
2. Login at: `https://your-frontend-url.onrender.com/admin/login`
3. Initialize games in dashboard

---

## ✅ Done! Your site is live!

**Frontend**: `https://arenax-frontend.onrender.com`  
**Backend**: `https://arenax-backend.onrender.com`

---

## 🔑 Important Notes

- **Free tier spins down** after 15 min inactivity (first request takes ~30s)
- **Generate strong JWT_SECRET**: Use `openssl rand -base64 32` or online generator
- **MongoDB Atlas**: Free tier has 512MB storage limit
- **HTTPS**: Automatic on Render (no setup needed)

---

See `DEPLOYMENT.md` for detailed instructions and troubleshooting.

