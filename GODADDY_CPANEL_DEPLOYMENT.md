# Deployment Guide - ArenaX to GoDaddy/cPanel

This guide will walk you through deploying the ArenaX Event Manager to GoDaddy's cPanel hosting.

## ⚠️ Important Considerations

**cPanel Limitations:**
- Most GoDaddy cPanel hosting plans have **limited or no Node.js support**
- Your backend (Node.js/Express) may need to be hosted elsewhere
- Frontend (React) can be deployed as static files to cPanel

**Recommended Approach:**
- **Frontend**: Deploy to GoDaddy cPanel (static files)
- **Backend**: Host on a Node.js-friendly platform (Render, Railway, Heroku, or GoDaddy's Node.js hosting if available)

---

## 📋 Prerequisites

1. **GoDaddy cPanel Access** - Your hosting account credentials
2. **MongoDB Atlas Account** - Free cloud database (required)
3. **FTP/File Manager Access** - For uploading files
4. **Node.js Backend Hosting** - Separate hosting for backend (see options below)

---

## 🗄️ Step 1: Setup MongoDB Atlas (Required)

Since cPanel doesn't include MongoDB, you'll need MongoDB Atlas:

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

### 1.4 Get Connection String
1. Go to **Database** → **Connect**
2. Choose **Connect your application**
3. Copy the connection string
4. Replace `<password>` with your actual password
5. Replace `<dbname>` with `arenax`

**Example:**
```
mongodb+srv://username:password@cluster.mongodb.net/arenax?retryWrites=true&w=majority
```

---

## 🚀 Step 2: Deploy Backend (Node.js)

Since cPanel typically doesn't support Node.js well, you have these options:

### Option A: Use Render (Free) - Recommended
1. Follow the backend deployment section in `DEPLOYMENT.md`
2. Deploy backend to Render (free tier available)
3. Note the backend URL (e.g., `https://arenax-backend.onrender.com`)

### Option B: Use Railway (Free Trial)
1. Sign up at [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Deploy the `backend` folder
4. Set environment variables (see Step 4)

### Option C: Use GoDaddy Node.js Hosting (If Available)
If your GoDaddy plan includes Node.js support:
1. Check cPanel for "Node.js" or "Node.js Selector" app
2. Create a new Node.js application
3. Point it to your `backend` folder
4. Set the start command: `node server.js`
5. Configure environment variables

### Option D: Use Heroku (Free Tier Discontinued, Paid Only)
1. Sign up at [heroku.com](https://heroku.com)
2. Deploy backend using Heroku CLI or GitHub integration

**For this guide, we'll assume you're using Render or Railway for the backend.**

---

## 🎨 Step 3: Build Frontend Locally

Before uploading to cPanel, build the React app on your local machine:

### 3.1 Install Dependencies
```bash
cd frontend
npm install
```

### 3.2 Create Production Environment File
Create `frontend/.env.production`:
```env
REACT_APP_API_URL=https://your-backend-url.onrender.com
```
Replace `your-backend-url.onrender.com` with your actual backend URL.

### 3.3 Build the Frontend
```bash
npm run build
```

This creates a `frontend/build` folder with production-ready files.

---

## 📤 Step 4: Upload Frontend to cPanel

### 4.1 Access cPanel File Manager

1. **Login to GoDaddy**
   - Go to [godaddy.com](https://godaddy.com)
   - Login to your account
   - Go to **My Products** → **Web Hosting** → **Manage**

2. **Open cPanel**
   - Click **cPanel Admin**
   - Or go directly to: `https://yourdomain.com:2083`

3. **Open File Manager**
   - In cPanel, find **Files** section
   - Click **File Manager**

### 4.2 Navigate to Public HTML Directory

1. In File Manager, navigate to:
   - **`public_html`** (for main domain)
   - **`public_html/subdomain`** (for subdomain)
   - **`public_html/arenax`** (for subdirectory)

2. **Clear existing files** (if needed)
   - Select all files in the directory
   - Delete them (keep a backup if needed)

### 4.3 Upload Build Files

**Method 1: Using File Manager Upload**
1. Click **Upload** button in File Manager
2. Select all files from `frontend/build` folder
3. Upload them to your `public_html` directory
4. Extract any ZIP files if needed

**Method 2: Using FTP (Recommended for large files)**
1. Use FTP client (FileZilla, WinSCP, etc.)
2. Connect to your GoDaddy FTP server
3. Navigate to `public_html` directory
4. Upload all contents of `frontend/build` folder

**Files to upload:**
- `index.html`
- `static/` folder (contains JS, CSS, images)
- All other files from the `build` folder

### 4.4 Set File Permissions

1. Select `index.html`
2. Right-click → **Change Permissions**
3. Set to **644** (readable by all, writable by owner)

---

## ⚙️ Step 5: Configure .htaccess for React Router

React Router requires server configuration to handle client-side routing.

### 5.1 Create .htaccess File

1. In File Manager, navigate to your `public_html` directory
2. Click **+ File** or **New File**
3. Name it `.htaccess` (with the dot at the beginning)
4. Add this content:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Enable Gzip compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

5. Save the file
6. Set permissions to **644**

**Note:** If `.htaccess` doesn't work, you may need to:
- Enable mod_rewrite in cPanel
- Contact GoDaddy support to enable it
- Or use the `_redirects` file method (see below)

### 5.2 Alternative: Use _redirects File

If `.htaccess` doesn't work, the `_redirects` file should already be in your build. If not:

1. Create `_redirects` in `public_html`
2. Add: `/*    /index.html   200`
3. This works if your hosting supports it (like Netlify)

---

## 🔧 Step 6: Configure Backend Environment Variables

Set these in your backend hosting platform (Render, Railway, etc.):

### Backend Environment Variables

```
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/arenax?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-to-random-string
NODE_ENV=production
CLIENT_URL=https://yourdomain.com
```

**Important:**
- Replace `yourdomain.com` with your actual GoDaddy domain
- Generate a strong `JWT_SECRET` (see Step 7)
- Use your MongoDB Atlas connection string

### How to Set Environment Variables:

**On Render:**
1. Go to your backend service
2. Click **Environment** tab
3. Add each variable

**On Railway:**
1. Go to your project
2. Click **Variables** tab
3. Add each variable

---

## 🔐 Step 7: Generate JWT Secret

Generate a secure JWT secret for production:

### Option 1: Using Node.js (Recommended)
```bash
node generate-secret.js
```

### Option 2: Using PowerShell (Windows)
```powershell
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### Option 3: Using Online Generator
- Visit: https://randomkeygen.com/
- Use "CodeIgniter Encryption Keys" (256-bit)

Copy the generated secret and use it as `JWT_SECRET`.

---

## ✅ Step 8: Test Your Deployment

### 8.1 Test Frontend
1. Visit your domain: `https://yourdomain.com`
2. Check if the page loads
3. Open browser console (F12) and check for errors
4. Verify API calls are going to your backend URL

### 8.2 Test Backend
1. Visit: `https://your-backend-url.onrender.com/api/leaderboard`
2. Should return JSON data (or empty array if no games)

### 8.3 Test Connection
1. Try to login to admin dashboard
2. Check browser console for CORS errors
3. Verify API calls are working

---

## 🔄 Step 9: Create Admin Account

Once backend is deployed, create the first admin:

### Using cURL (from your computer)
```bash
curl -X POST https://your-backend-url.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@yourdomain.com","password":"YourSecurePassword123!","name":"Admin"}'
```

### Using Postman/Thunder Client
- Method: POST
- URL: `https://your-backend-url.onrender.com/api/auth/register`
- Body (JSON):
```json
{
  "email": "admin@yourdomain.com",
  "password": "YourSecurePassword123!",
  "name": "Admin"
}
```

### Using Browser Console
```javascript
fetch('https://your-backend-url.onrender.com/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@yourdomain.com',
    password: 'YourSecurePassword123!',
    name: 'Admin'
  })
})
.then(r => r.json())
.then(console.log);
```

---

## 🔄 Step 10: Update Frontend After Changes

When you make changes to your frontend:

1. **Build locally:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Upload new files:**
   - Delete old files in `public_html` (or just overwrite)
   - Upload new files from `frontend/build`

3. **Clear browser cache** to see changes

---

## 🐛 Troubleshooting

### Frontend Issues

**404 Errors on Page Refresh:**
- Ensure `.htaccess` file is in `public_html`
- Check that mod_rewrite is enabled
- Verify `.htaccess` syntax is correct

**API Calls Failing:**
- Check `REACT_APP_API_URL` in `.env.production`
- Rebuild frontend after changing environment variables
- Check browser console for CORS errors
- Verify backend URL is correct

**White Screen:**
- Check browser console for errors
- Verify all files uploaded correctly
- Check file permissions (should be 644)
- Ensure `index.html` exists in root

**Build Fails:**
- Check Node.js version (should be 14+)
- Delete `node_modules` and reinstall
- Check for missing dependencies

### Backend Issues

**CORS Errors:**
- Update `CLIENT_URL` in backend environment variables
- Ensure it matches your GoDaddy domain exactly
- Include `https://` in the URL

**MongoDB Connection Error:**
- Verify connection string is correct
- Check MongoDB Atlas network access (should allow 0.0.0.0/0)
- Verify database user credentials

**Service Won't Start:**
- Check backend hosting logs
- Verify all environment variables are set
- Check PORT is set correctly

### cPanel Specific Issues

**Can't Upload Files:**
- Check file size limits in cPanel
- Use FTP for large files
- Compress files if needed

**.htaccess Not Working:**
- Contact GoDaddy support to enable mod_rewrite
- Check if your hosting plan supports .htaccess
- Try using subdomain instead of subdirectory

**Slow Loading:**
- Enable Gzip compression (included in .htaccess)
- Optimize images before uploading
- Consider using a CDN

---

## 📝 Quick Deployment Checklist

- [ ] MongoDB Atlas setup complete
- [ ] Backend deployed to Node.js hosting (Render/Railway)
- [ ] Backend environment variables configured
- [ ] Frontend built locally (`npm run build`)
- [ ] Frontend files uploaded to cPanel `public_html`
- [ ] `.htaccess` file created and configured
- [ ] File permissions set correctly (644)
- [ ] Frontend loads at your domain
- [ ] Backend API accessible
- [ ] CORS configured correctly
- [ ] Admin account created
- [ ] Games initialized
- [ ] Full functionality tested

---

## 💡 Tips for GoDaddy/cPanel

1. **Use Subdomain for Testing:**
   - Create `test.yourdomain.com` subdomain
   - Deploy there first, then move to main domain

2. **File Upload Limits:**
   - cPanel may have file size limits
   - Use FTP for large uploads
   - Compress files if needed

3. **SSL Certificate:**
   - GoDaddy usually provides free SSL
   - Enable it in cPanel → SSL/TLS Status
   - Force HTTPS redirect in `.htaccess`

4. **Performance:**
   - Enable caching in `.htaccess`
   - Optimize images before upload
   - Consider CDN for static assets

5. **Backup:**
   - Always backup before making changes
   - Use cPanel Backup feature
   - Keep local copies of your build

---

## 🔒 Security Checklist

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Use strong passwords for admin accounts
- [ ] MongoDB Atlas: Restrict network access if possible
- [ ] Enable HTTPS (SSL certificate)
- [ ] Review CORS settings
- [ ] Don't commit `.env` files
- [ ] Keep dependencies updated

---

## 📞 Support Resources

- **GoDaddy Support:** [support.godaddy.com](https://support.godaddy.com)
- **cPanel Documentation:** [docs.cpanel.net](https://docs.cpanel.net)
- **MongoDB Atlas:** [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- **Render Support:** [render.com/docs](https://render.com/docs)

---

## 🎯 Alternative: Full cPanel Deployment (If Node.js Supported)

If your GoDaddy plan includes Node.js support:

1. **In cPanel, find "Node.js" or "Node.js Selector"**
2. **Create New Application:**
   - Application root: `backend`
   - Application URL: Choose subdomain or subdirectory
   - Application startup file: `server.js`
   - Application mode: Production

3. **Set Environment Variables:**
   - Use cPanel's environment variable interface
   - Add all required variables (see Step 6)

4. **Start Application:**
   - Click "Start" in Node.js app manager
   - Check logs for errors

5. **Update Frontend:**
   - Set `REACT_APP_API_URL` to your Node.js app URL
   - Rebuild and upload frontend

---

**Your ArenaX Event Manager should now be live on GoDaddy! 🎮🚀**

