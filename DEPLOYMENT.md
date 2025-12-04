# AnyComp Deployment Guide

## Overview
This guide will help you deploy the AnyComp application to production using:
- **Database**: Neon.tech (PostgreSQL)
- **Backend**: Render.com
- **Frontend**: Vercel

---

## ✅ Step 1: Database Deployment (Neon.tech) - COMPLETED

You've already completed this step! Your database details:

```
Connection String: postgresql://neondb_owner:npg_MG2YwSUc9Orv@ep-frosty-smoke-a1g5k66d-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

Database Details:
- Host: ep-frosty-smoke-a1g5k66d-pooler.ap-southeast-1.aws.neon.tech
- User: neondb_owner
- Password: npg_MG2YwSUc9Orv
- Database: neondb
- Port: 5432
```

---

## 🚀 Step 2: Backend Deployment (Render.com)

### Prerequisites
1. Push your latest code to GitHub
2. Make sure all changes are committed

### Deployment Steps

#### Option A: Using Render Dashboard (Recommended)

1. **Go to Render.com** and sign in
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service:**

   **Basic Settings:**
   - **Name**: `anycomp-backend`
   - **Region**: Singapore (or closest to your users)
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend` ⚠️ **IMPORTANT!**
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

   **Environment Variables** (Click "Advanced" → "Add Environment Variable"):
   
   You've already set these, but here's the complete list for reference:
   
   ```
   PORT=10000
   NODE_ENV=production
   DB_HOST=ep-frosty-smoke-a1g5k66d-pooler.ap-southeast-1.aws.neon.tech
   DB_PORT=5432
   DB_USERNAME=neondb_owner
   DB_PASSWORD=npg_MG2YwSUc9Orv
   DB_DATABASE=neondb
   JWT_SECRET=e4a7b1f3c9d8e2f6a1b5c8d7e6f4a2b9c0d3e8f1a7b6c5d4e3f2a1b0c9d8e7f6
   ```

5. **Click "Create Web Service"**
6. **Wait for deployment** (this may take 5-10 minutes)
7. **Copy your Backend URL** (e.g., `https://anycomp-backend.onrender.com`)

#### Option B: Using render.yaml Blueprint

1. In Render Dashboard, click "New +" → "Blueprint"
2. Connect your repository
3. Render will detect the `render.yaml` file
4. Add the environment variables manually (they're marked as `sync: false` for security)
5. Click "Apply"

### Verify Backend Deployment

Once deployed, test your backend:

```bash
# Check if the API is running
curl https://your-backend-url.onrender.com/api

# Test login endpoint
curl -X POST https://your-backend-url.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@stcomp.com","password":"AdminPassword123"}'
```

### Common Issues & Solutions

**Issue 1: Build fails with TypeScript errors**
- Solution: Make sure all TypeScript files compile locally first: `npm run build`

**Issue 2: Migration errors**
- Solution: Check the logs in Render dashboard. The migrations should run automatically after build.

**Issue 3: Database connection fails**
- Solution: Verify all DB environment variables are correct, especially DB_HOST

**Issue 4: Port binding errors**
- Solution: Ensure PORT is set to 10000 in environment variables

---

## 🌐 Step 3: Frontend Deployment (Vercel)

### Prerequisites
1. Backend must be deployed and running
2. Have your backend URL ready

### Deployment Steps

1. **Go to Vercel.com** and sign in
2. **Click "Add New..." → "Project"**
3. **Import your GitHub repository**
4. **Configure Project:**

   **Framework Settings:**
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: Click "Edit" → Select `frontend`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

   **Environment Variables:**
   
   Add this variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
   ```
   
   ⚠️ **IMPORTANT**: Replace `your-backend-url.onrender.com` with your actual Render backend URL!

5. **Click "Deploy"**
6. **Wait for deployment** (usually 2-3 minutes)
7. **Copy your Frontend URL** (e.g., `https://anycomp.vercel.app`)

### Verify Frontend Deployment

1. Open your Vercel URL in a browser
2. Try to login with: `admin@stcomp.com` / `AdminPassword123`
3. Check if the specialists page loads
4. Test creating a new specialist

---

## 🔍 Step 4: Final Verification

### Backend Checks
- [ ] Backend URL is accessible
- [ ] API endpoints respond correctly
- [ ] Database connection is working
- [ ] Migrations ran successfully
- [ ] Admin user was created

### Frontend Checks
- [ ] Frontend loads without errors
- [ ] Can login successfully
- [ ] Can view specialists list
- [ ] Can create/edit specialists
- [ ] Images upload (note: will be lost on Render restart - see note below)

### Integration Checks
- [ ] Frontend can communicate with backend
- [ ] Authentication works end-to-end
- [ ] CORS is configured correctly

---

## 📝 Important Notes

### Image Uploads on Render Free Tier
⚠️ **Important**: On Render's free tier, the filesystem is ephemeral. This means:
- Images uploaded will work temporarily
- Images will be **deleted when the server restarts** (which happens frequently on free tier)
- This is expected behavior for this architecture

**Solutions for Production:**
1. Upgrade to Render paid tier with persistent disk
2. Use cloud storage (AWS S3, Cloudinary, etc.)
3. For the interview, explain this is a known limitation of the free tier

### Free Tier Limitations
- **Render**: Services spin down after 15 minutes of inactivity (first request may be slow)
- **Neon**: 10GB storage limit, 100 hours of compute per month
- **Vercel**: Unlimited deployments, bandwidth limits apply

### Monitoring Your Deployment
- **Render Logs**: Dashboard → Your Service → Logs
- **Vercel Logs**: Dashboard → Your Project → Deployments → View Function Logs
- **Neon Monitoring**: Dashboard → Your Project → Monitoring

---

## 🔧 Troubleshooting

### Backend won't start
1. Check Render logs for errors
2. Verify all environment variables are set
3. Ensure database is accessible from Render's IP
4. Check if migrations completed successfully

### Frontend can't connect to backend
1. Verify `NEXT_PUBLIC_API_URL` is correct
2. Check CORS settings in backend
3. Ensure backend is running and accessible
4. Check browser console for errors

### Database connection issues
1. Verify Neon database is active
2. Check connection string format
3. Ensure SSL is enabled (already configured in code)
4. Verify IP allowlist in Neon (should allow all by default)

---

## 🎯 Quick Commands Reference

### Local Development
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

### Testing Production Build Locally
```bash
# Backend
cd backend
npm run build
NODE_ENV=production npm start

# Frontend
cd frontend
npm run build
npm start
```

### Redeploying
- **Render**: Push to GitHub → Auto-deploys (if enabled) or click "Manual Deploy"
- **Vercel**: Push to GitHub → Auto-deploys

---

## 📞 Support

If you encounter issues:
1. Check the logs in respective platforms
2. Verify environment variables
3. Ensure all services are running
4. Check network connectivity between services

---

## ✨ Success Checklist

- [x] Database deployed on Neon
- [x] Environment variables configured in Render
- [ ] Backend deployed on Render
- [ ] Backend URL obtained
- [ ] Frontend deployed on Vercel
- [ ] Frontend configured with backend URL
- [ ] End-to-end testing completed
- [ ] Application is live and functional

---

**Good luck with your deployment! 🚀**
