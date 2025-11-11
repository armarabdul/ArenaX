# Deployment Guide - ArenaX to Render

This guide will walk you through deploying the ArenaX Event Manager to Render.

## 📋 Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **Render Account** - Sign up at [render.com](https://render.com)
3. **MongoDB Atlas Account** - For cloud database (or use Render's MongoDB)
4. **Environment Variables** - Ready to configure

---

## 🗄️ Step 1: Setup MongoDB Atlas (Database)

### 1.1 Create MongoDB Atlas Account
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (Free tier: M0)

### 1.2 Configure Database Access
1. Go to **Database Access** → **Add New Database User**
2. Create username and password (save these!)
3. Set privileges: **Read and write to any database**

### 1.3 Configure Network Access
1. Go to **Network Access** → **Add IP Address**
2. Click **Allow Access from Anywhere** (0.0.0.0/0)
   - Or add Render's IP ranges if you prefer

### 1.4 Get Connection String
1. Go to **Database** → **Connect**
2. Choose **Connect your application**
3. Copy the connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/arenax?retryWrites=true&w=majority`
4. Replace `<password>` with your actual password
5. Replace `<dbname>` with `arenax` (or your preferred database name)

---

## 🚀 Step 2: Deploy Backend to Render

### 2.1 Prepare Backend for Deployment

1. **Create `render.yaml` (optional but recommended)**
   - See the file below for configuration

2. **Update `backend/server.js`** (if needed)
   - Ensure it listens on `process.env.PORT`

3. **Create `backend/start.sh`** (startup script)
   ```bash
   #!/bin/bash
   node server.js
   ```

### 2.2 Deploy Backend Service

1. **Go to Render Dashboard**
   - Visit [dashboard.render.com](https://dashboard.render.com)
   - Click **New +** → **Web Service**

2. **Connect Repository**
   - Connect your GitHub account
   - Select the ArenaX repository
   - Choose the branch (usually `main` or `master`)

3. **Configure Service**
   - **Name**: `arenax-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && node server.js`
   - **Plan**: Free (or choose paid for better performance)

4. **Set Environment Variables**
   Click **Environment** tab and add:
   ```
   PORT=10000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/arenax?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-change-this-to-random-string
   NODE_ENV=production
   CLIENT_URL=https://your-frontend-url.onrender.com
   ```

5. **Deploy**
   - Click **Create Web Service**
   - Wait for deployment to complete
   - Note the URL: `https://arenax-backend.onrender.com` (or your custom domain)

---

## 🎨 Step 3: Deploy Frontend to Render

### 3.1 Prepare Frontend for Deployment

1. **Update API URL**
   - The frontend should use environment variables (already configured)
   - Create `frontend/.env.production`:
   ```
   REACT_APP_API_URL=https://arenax-backend.onrender.com
   ```

2. **Build Script Check**
   - Ensure `package.json` has build script (already present)

### 3.2 Deploy Frontend Service

1. **Go to Render Dashboard**
   - Click **New +** → **Static Site**

2. **Connect Repository**
   - Select the same GitHub repository
   - Choose the branch

3. **Configure Static Site**
   - **Name**: `arenax-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/build`
   - **Environment Variables**:
     ```
     REACT_APP_API_URL=https://arenax-backend.onrender.com
     ```

4. **Deploy**
   - Click **Create Static Site**
   - Wait for build and deployment
   - Note the URL: `https://arenax-frontend.onrender.com`

---

## ⚙️ Step 4: Update Environment Variables

### Backend Environment Variables (Update CLIENT_URL)
After frontend is deployed, update backend environment variable:
1. Go to backend service → **Environment**
2. Update `CLIENT_URL` to your frontend URL:
   ```
   CLIENT_URL=https://arenax-frontend.onrender.com
   ```
3. **Redeploy** the backend service

### Frontend Environment Variables (Update API URL)
1. Go to frontend service → **Environment**
2. Ensure `REACT_APP_API_URL` matches your backend URL:
   ```
   REACT_APP_API_URL=https://arenax-backend.onrender.com
   ```
3. **Redeploy** the frontend service

---

## 🔧 Step 5: Post-Deployment Setup

### 5.1 Create Admin Account
Once backend is deployed, create the first admin:

**Option 1: Using Render Shell**
1. Go to backend service → **Shell**
2. Run:
   ```bash
   curl -X POST https://arenax-backend.onrender.com/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@arenax.com","password":"YourSecurePassword123!","name":"Admin"}'
   ```

**Option 2: Using Postman/Thunder Client**
- Method: POST
- URL: `https://arenax-backend.onrender.com/api/auth/register`
- Body (JSON):
  ```json
  {
    "email": "admin@arenax.com",
    "password": "YourSecurePassword123!",
    "name": "Admin"
  }
  ```

### 5.2 Initialize Games
1. Login to admin dashboard
2. Go to **Game Control** tab
3. Click **Initialize Default Games**

Or create admins using the script:
```bash
# Update create-admins.js with your Render backend URL
API_URL=https://arenax-backend.onrender.com node create-admins.js
```

---

## 📝 Step 6: Create render.yaml (Optional but Recommended)

Create `render.yaml` in the root directory:

```yaml
services:
  # Backend Service
  - type: web
    name: arenax-backend
    env: node
    plan: free
    buildCommand: cd backend && npm install
    startCommand: cd backend && node server.js
    envVars:
      - key: PORT
        value: 10000
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        sync: false  # Set manually in Render dashboard
      - key: JWT_SECRET
        sync: false  # Set manually in Render dashboard
      - key: CLIENT_URL
        sync: false  # Set manually after frontend is deployed

  # Frontend Service
  - type: web
    name: arenax-frontend
    env: static
    buildCommand: cd frontend && npm install && npm run build
    staticPublishPath: frontend/build
    envVars:
      - key: REACT_APP_API_URL
        sync: false  # Set manually in Render dashboard
```

**Note**: For static sites, you might need to use the Static Site type in Render dashboard instead of web service.

---

## 🔐 Step 7: Security Checklist

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Use strong passwords for admin accounts
- [ ] MongoDB Atlas: Restrict network access if possible
- [ ] Enable HTTPS (automatic on Render)
- [ ] Review and update CORS settings
- [ ] Don't commit `.env` files to GitHub

---

## 🐛 Troubleshooting

### Backend Issues

**Service won't start:**
- Check logs in Render dashboard
- Verify MongoDB connection string is correct
- Ensure PORT environment variable is set
- Check that all dependencies are in `package.json`

**MongoDB Connection Error:**
- Verify connection string format
- Check network access in MongoDB Atlas
- Ensure IP whitelist includes Render's IPs (or 0.0.0.0/0)

**CORS Errors:**
- Update `CLIENT_URL` in backend environment variables
- Check backend `server.js` CORS configuration

### Frontend Issues

**API calls failing:**
- Verify `REACT_APP_API_URL` is set correctly
- Check backend URL is accessible
- Ensure backend CORS allows frontend domain

**Build fails:**
- Check Node.js version compatibility
- Verify all dependencies are in `package.json`
- Check build logs for specific errors

**404 on refresh:**
- For React Router, you may need to configure redirects
- Create `frontend/public/_redirects`:
  ```
  /*    /index.html   200
  ```

---

## 📊 Step 8: Monitoring

### Render Dashboard
- Monitor service health
- View logs in real-time
- Check deployment history
- Set up alerts (paid plans)

### MongoDB Atlas
- Monitor database usage
- Check connection metrics
- Set up alerts for storage/performance

---

## 🔄 Step 9: Continuous Deployment

Render automatically deploys when you push to your connected branch:
1. Push changes to GitHub
2. Render detects changes
3. Automatically rebuilds and redeploys
4. Check deployment status in dashboard

---

## 💰 Cost Estimation (Free Tier)

- **Backend**: Free (with limitations)
  - 750 hours/month
  - Spins down after 15 minutes of inactivity
  - First request after spin-down takes ~30 seconds
  
- **Frontend**: Free
  - Unlimited static site hosting
  - CDN included

- **MongoDB Atlas**: Free (M0 tier)
  - 512 MB storage
  - Shared CPU/RAM

**Note**: For production with high traffic, consider paid plans.

---

## 🎯 Quick Deployment Checklist

- [ ] MongoDB Atlas setup complete
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Render
- [ ] Environment variables configured
- [ ] Admin account created
- [ ] Games initialized
- [ ] Test login and functionality
- [ ] Update CORS settings
- [ ] Test public pages
- [ ] Verify real-time updates work

---

## 📞 Support

If you encounter issues:
1. Check Render logs
2. Check MongoDB Atlas logs
3. Verify environment variables
4. Test API endpoints directly
5. Check Render status page

---

**Your ArenaX Event Manager should now be live! 🎮🚀**

