# Render Environment Variables Reference

## 🔧 Backend Environment Variables

Set these in Render Dashboard → Your Backend Service → Environment

| Variable | Value | Description |
|----------|-------|-------------|
| `PORT` | `10000` | Port for the server (Render sets this automatically, but you can override) |
| `MONGODB_URI` | `mongodb+srv://...` | MongoDB Atlas connection string |
| `JWT_SECRET` | `your-random-string` | Secret key for JWT tokens (generate with `npm run generate-secret`) |
| `NODE_ENV` | `production` | Environment mode |
| `CLIENT_URL` | `https://your-frontend.onrender.com` | Frontend URL for CORS (set after frontend is deployed) |

### Example Values:

```bash
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/arenax?retryWrites=true&w=majority
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2
NODE_ENV=production
CLIENT_URL=https://arenax-frontend.onrender.com
```

---

## 🎨 Frontend Environment Variables

Set these in Render Dashboard → Your Frontend Service → Environment

| Variable | Value | Description |
|----------|-------|-------------|
| `REACT_APP_API_URL` | `https://your-backend.onrender.com` | Backend API URL (no trailing slash) |

### Example Value:

```bash
REACT_APP_API_URL=https://arenax-backend.onrender.com
```

---

## 🔐 Generating JWT_SECRET

### Option 1: Using Node.js Script
```bash
npm run generate-secret
```

### Option 2: Using OpenSSL (Linux/Mac)
```bash
openssl rand -base64 64
```

### Option 3: Using PowerShell (Windows)
```powershell
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### Option 4: Online Generator
- Visit: https://randomkeygen.com/
- Use "CodeIgniter Encryption Keys" (256-bit)

---

## ⚠️ Important Notes

1. **Never commit secrets to GitHub**
   - All `.env` files are in `.gitignore`
   - Set variables in Render dashboard only

2. **Update CLIENT_URL after frontend deployment**
   - Backend needs frontend URL for CORS
   - Update and redeploy backend after frontend is live

3. **MongoDB URI Format**
   - Must include database name: `...mongodb.net/arenax?...`
   - Replace `<password>` with actual password
   - No spaces in connection string

4. **JWT_SECRET**
   - Must be at least 32 characters
   - Use random, unpredictable string
   - Different for each environment (dev/prod)

---

## 🔄 After Deployment

1. **Test Backend**: Visit `https://your-backend.onrender.com/api/leaderboard`
   - Should return JSON (empty array if no players)

2. **Test Frontend**: Visit `https://your-frontend.onrender.com`
   - Should load homepage

3. **Create Admin**: Use API or script
   ```bash
   curl -X POST https://your-backend.onrender.com/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@arenax.com","password":"SecurePass123!","name":"Admin"}'
   ```

4. **Verify CORS**: Check browser console for CORS errors
   - If errors, verify `CLIENT_URL` matches frontend URL exactly

---

## 🐛 Common Issues

### CORS Errors
- **Solution**: Verify `CLIENT_URL` in backend matches frontend URL exactly (including https://)

### MongoDB Connection Failed
- **Solution**: Check connection string, verify network access, check credentials

### Environment Variable Not Working
- **Solution**: Variables must be set in Render dashboard, not in code
- Frontend: Must start with `REACT_APP_` prefix
- Restart service after adding variables

### Build Fails
- **Solution**: Check build logs, verify all dependencies in `package.json`
- Ensure Node.js version is compatible

---

**Need help?** Check `DEPLOYMENT.md` for detailed troubleshooting.

