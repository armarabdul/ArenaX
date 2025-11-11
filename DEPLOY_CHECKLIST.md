# Pre-Deployment Checklist

## ✅ Before Deploying

### Code Preparation
- [ ] All code committed to GitHub
- [ ] `.env` files are in `.gitignore` (not committed)
- [ ] `package.json` files have all dependencies
- [ ] No hardcoded localhost URLs in production code
- [ ] Environment variables use `process.env`

### Backend Checklist
- [ ] `backend/server.js` uses `process.env.PORT`
- [ ] MongoDB connection string ready
- [ ] JWT_SECRET ready (strong random string)
- [ ] CORS configured for production domain
- [ ] All routes tested locally

### Frontend Checklist
- [ ] `REACT_APP_API_URL` uses environment variable
- [ ] Build script works (`npm run build`)
- [ ] No console errors in production build
- [ ] All API calls use relative paths or env variable

### Database Checklist
- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] Network access configured
- [ ] Connection string copied

### Security Checklist
- [ ] Strong JWT_SECRET generated
- [ ] Strong admin passwords planned
- [ ] No sensitive data in code
- [ ] CORS properly configured

---

## 🚀 Deployment Steps

1. [ ] Deploy backend to Render
2. [ ] Deploy frontend to Render
3. [ ] Set environment variables
4. [ ] Test backend API endpoints
5. [ ] Test frontend connection to backend
6. [ ] Create admin account
7. [ ] Initialize games
8. [ ] Test full functionality

---

## 🧪 Post-Deployment Testing

- [ ] Frontend loads correctly
- [ ] Can login to admin dashboard
- [ ] Can add/edit players
- [ ] Can start games
- [ ] Can mark results
- [ ] Leaderboard updates
- [ ] Public pages accessible
- [ ] Real-time updates work (Socket.io)

---

## 📝 Notes

- Free tier services spin down after inactivity
- First request after spin-down may take 30+ seconds
- Consider paid plans for production use
- Monitor MongoDB Atlas usage (512MB free limit)

