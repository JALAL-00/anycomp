# Render Deployment Checklist

## ✅ Pre-Deployment (Completed)
- [x] Database created on Neon.tech
- [x] Environment variables prepared
- [x] Code configured for production
- [x] Code pushed to GitHub

## 🚀 Deploy Backend on Render

### Step 1: Create Web Service
1. Go to https://render.com
2. Sign in or create account
3. Click **"New +"** → **"Web Service"**

### Step 2: Connect Repository
1. Click **"Connect account"** to link GitHub
2. Find and select your repository: `JALAL-00/anycomp`
3. Click **"Connect"**

### Step 3: Configure Service

**Basic Configuration:**
```
Name: anycomp-backend
Region: Singapore (or closest to you)
Branch: main
Root Directory: backend          ⚠️ CRITICAL - Don't forget this!
Runtime: Node
```

**Build & Start Commands:**
```
Build Command: npm install && npm run build
Start Command: npm start
```

**Instance Type:**
```
Free
```

### Step 4: Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these variables (you already have them, just verify):

| Key | Value |
|-----|-------|
| `PORT` | `10000` |
| `NODE_ENV` | `production` |
| `DB_HOST` | `ep-frosty-smoke-a1g5k66d-pooler.ap-southeast-1.aws.neon.tech` |
| `DB_PORT` | `5432` |
| `DB_USERNAME` | `neondb_owner` |
| `DB_PASSWORD` | `npg_MG2YwSUc9Orv` |
| `DB_DATABASE` | `neondb` |
| `JWT_SECRET` | `e4a7b1f3c9d8e2f6a1b5c8d7e6f4a2b9c0d3e8f1a7b6c5d4e3f2a1b0c9d8e7f6` |

### Step 5: Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Watch the logs for any errors

### Step 6: Verify Deployment

Once deployed, you'll see:
- ✅ "Live" status
- Your backend URL (e.g., `https://anycomp-backend.onrender.com`)

**Test the API:**

Open in browser:
```
https://your-backend-url.onrender.com/api
```

You should see a response (might be a 404 or basic message).

**Test login endpoint:**
```bash
curl -X POST https://your-backend-url.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@stcomp.com","password":"AdminPassword123"}'
```

You should get a JWT token back.

### Step 7: Copy Backend URL
**IMPORTANT**: Copy your backend URL - you'll need it for frontend deployment!

Example: `https://anycomp-backend.onrender.com`

---

## 📋 What to Watch For

### During Build:
- ✅ npm install completes
- ✅ TypeScript compilation succeeds
- ✅ Migrations run successfully

### During Startup:
- ✅ Database connection established
- ✅ Admin user created
- ✅ Server starts on port 10000

### Common Issues:

**Build fails:**
- Check the logs in Render dashboard
- Verify all files are pushed to GitHub
- Ensure `backend` is set as root directory

**Database connection fails:**
- Double-check all DB environment variables
- Ensure Neon database is active
- Verify SSL is enabled (already in code)

**Migrations fail:**
- Check if migrations folder exists in dist
- Verify TypeORM configuration
- Check database permissions

---

## 🎯 Next Steps

After backend is deployed:
1. ✅ Copy your backend URL
2. ➡️ Deploy frontend on Vercel (see DEPLOYMENT.md)
3. ➡️ Configure frontend with backend URL
4. ➡️ Test end-to-end functionality

---

## 💡 Tips

- **First request may be slow**: Free tier services sleep after inactivity
- **Check logs often**: Render dashboard → Your Service → Logs
- **Auto-deploy**: Enable auto-deploy from GitHub for automatic updates
- **Custom domain**: You can add a custom domain in Render settings

---

## 🆘 Need Help?

If deployment fails:
1. Check the **Logs** tab in Render dashboard
2. Verify all environment variables are set correctly
3. Ensure GitHub repository is up to date
4. Check that `backend` is set as root directory

---

**Your Backend URL will be**: `https://anycomp-backend-XXXX.onrender.com`

Save this URL - you'll need it for the frontend deployment!
