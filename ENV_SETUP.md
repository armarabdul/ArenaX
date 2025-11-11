# Environment Variables Setup

## Quick Setup (Automated)

### Option 1: Using Node.js Script (Recommended)
```bash
npm run setup-env
```

### Option 2: Using Batch Script (Windows)
```bash
setup-env.bat
```

### Option 3: Using Shell Script (Linux/Mac)
```bash
chmod +x setup-env.sh
./setup-env.sh
```

## Manual Setup

If the automated scripts don't work, create the files manually:

### 1. Create `backend/.env`

Create a new file `backend/.env` with the following content:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/arenax
JWT_SECRET=arenax-super-secret-jwt-key-change-in-production-2024
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### 2. Create `frontend/.env`

Create a new file `frontend/.env` with the following content:

```env
REACT_APP_API_URL=http://localhost:5000
```

## Environment Variables Explained

### Backend Variables (`backend/.env`)

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Port number for the backend server | `5000` | Yes |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/arenax` | Yes |
| `JWT_SECRET` | Secret key for JWT token signing | (change in production) | Yes |
| `NODE_ENV` | Environment mode | `development` | Optional |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:3000` | Yes |

### Frontend Variables (`frontend/.env`)

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:5000` | Yes |

## Production Configuration

### For MongoDB Atlas (Cloud Database)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/arenax`)
4. Update `MONGODB_URI` in `backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/arenax?retryWrites=true&w=majority
   ```

### For Production Deployment

1. **Change JWT_SECRET**: Use a strong, random string
   ```bash
   # Generate a random secret (Linux/Mac)
   openssl rand -base64 32
   
   # Or use an online generator
   ```

2. **Update CLIENT_URL**: Set to your deployed frontend URL
   ```env
   CLIENT_URL=https://your-frontend-domain.com
   ```

3. **Update REACT_APP_API_URL**: Set to your deployed backend URL
   ```env
   REACT_APP_API_URL=https://your-backend-domain.com
   ```

4. **Set NODE_ENV**:
   ```env
   NODE_ENV=production
   ```

## Verification

After creating the files, verify they exist:

```bash
# Check backend .env
cat backend/.env

# Check frontend .env
cat frontend/.env
```

Or on Windows:
```cmd
type backend\.env
type frontend\.env
```

## Troubleshooting

### File Already Exists
If the script says the file already exists, you can:
- Keep the existing file (if it's configured correctly)
- Delete it and run the script again
- Manually edit the existing file

### Permission Errors
- Make sure you have write permissions in the project directory
- On Linux/Mac, you may need `sudo` (not recommended)

### MongoDB Connection Issues
- Verify MongoDB is running (local) or cluster is active (Atlas)
- Check connection string format
- Ensure IP whitelist includes your IP (for Atlas)

## Security Notes

⚠️ **IMPORTANT:**
- Never commit `.env` files to version control (they're in `.gitignore`)
- Use different `JWT_SECRET` for production
- Keep MongoDB credentials secure
- Don't share `.env` files publicly

## Next Steps

After setting up environment variables:
1. ✅ Install dependencies: `npm run install-all`
2. ✅ Start MongoDB (local or Atlas)
3. ✅ Run the app: `npm run dev`
4. ✅ Create admin account (see SETUP.md)

