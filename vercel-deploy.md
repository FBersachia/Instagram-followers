# Vercel Deployment Guide - Instagram Follower Tracker

This guide provides step-by-step instructions for deploying the Instagram Follower Tracker application to Vercel.

## Prerequisites

- [x ] Vercel account (https://vercel.com)
- [ x] GitHub repository with the latest code
- [ ] MySQL database (PlanetScale, Railway, or other MySQL provider)
- [ ] Domain name (optional, for custom domain)

## 1. Database Setup

### Option A: PlanetScale (Recommended)

- [ ] Create PlanetScale account (https://planetscale.com)
- [ ] Create new database
- [ ] Run migrations:
  ```bash
  # Connect to PlanetScale database
  mysql -h <host> -u <username> -p<password> <database>

  # Run all migration files in order
  source migrations/schema.sql
  source migrations/add_users_table.sql
  ```
- [ ] Note down connection string

### Option B: Railway MySQL

- [ ] Create Railway account (https://railway.app)
- [ ] Create new MySQL service
- [ ] Run migrations using the connection details
- [ ] Note down connection string

### Option C: Other MySQL Provider

- [ ] Set up MySQL database with your provider
- [ ] Run all migration files
- [ ] Note down connection string

## 2. Backend API Deployment

### Prepare Backend for Vercel

- [ ] Create `vercel.json` in project root:
  ```json
  {
    "version": 2,
    "builds": [
      {
        "src": "src/api.ts",
        "use": "@vercel/node"
      }
    ],
    "routes": [
      {
        "src": "/api/(.*)",
        "dest": "src/api.ts"
      },
      {
        "src": "/health",
        "dest": "src/api.ts"
      }
    ]
  }
  ```

- [ ] Update `package.json` to include build script:
  ```json
  {
    "scripts": {
      "build": "tsc",
      "vercel-build": "npm run build"
    }
  }
  ```

### Deploy Backend

- [ ] Go to Vercel Dashboard
- [ ] Click "Add New Project"
- [ ] Import GitHub repository
- [ ] Configure project:
  - Framework Preset: `Other`
  - Root Directory: `./` (project root)
  - Build Command: `npm run build`
  - Output Directory: `dist`

### Set Environment Variables (Backend)

- [ ] In Vercel project settings, add environment variables:
  ```
  DB_HOST=<your-database-host>
  DB_USER=francisco
  DB_PASSWORD=mce775Mysql
  DB_NAME=seguidores
  DB_PORT=3306
  JWT_SECRET=fbersachia_seguidores_secret_key_2025
  JWT_EXPIRES_IN=7d
  NODE_ENV=production
  ENABLE_FILE_LOGGING=false
  ```

- [ ] Deploy backend
- [ ] Note the deployment URL (e.g., `https://your-backend.vercel.app`)
- [ ] Test health endpoint: `https://your-backend.vercel.app/health`

## 3. Frontend Deployment

### Update Frontend Configuration

- [ ] Update `frontend/.env.production`:
  ```env
  VITE_API_URL=https://your-backend.vercel.app/api
  VITE_APP_NAME=Instagram Follower Tracker
  ```

### Deploy Frontend

- [ ] Go to Vercel Dashboard
- [ ] Click "Add New Project"
- [ ] Import GitHub repository (or use same repo with different root directory)
- [ ] Configure project:
  - Framework Preset: `Vite`
  - Root Directory: `frontend`
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Install Command: `npm install`

### Set Environment Variables (Frontend)

- [ ] In Vercel project settings, add environment variables:
  ```
  VITE_API_URL=https://your-backend.vercel.app/api
  VITE_APP_NAME=Instagram Follower Tracker
  ```

- [ ] Deploy frontend
- [ ] Note the deployment URL (e.g., `https://your-app.vercel.app`)

## 4. CORS Configuration

- [ ] Update `src/server.ts` to allow frontend domain:
  ```typescript
  const corsOptions = {
    origin: [
      'http://localhost:5173',
      'https://your-app.vercel.app'  // Add your Vercel frontend URL
    ],
    credentials: true,
  };
  ```

- [ ] Commit and push changes
- [ ] Vercel will auto-deploy

## 5. Database User Setup

- [ ] Connect to production database
- [ ] Verify user exists or create one:
  ```sql
  SELECT * FROM users WHERE username = 'fbersachia';
  ```
- [ ] If user doesn't exist, run:
  ```sql
  INSERT INTO users (username, password_hash)
  VALUES ('fbersachia', '$2b$10$40bRmpMv1Z.E1TOQZLqKdeiGyaIUlajXSMq4Pw9.VMHXQ6CQNPiAS');
  ```

## 6. Testing Deployment

### Backend Tests

- [ ] Test health endpoint:
  ```bash
  curl https://your-backend.vercel.app/health
  ```

- [ ] Test login endpoint:
  ```bash
  curl -X POST https://your-backend.vercel.app/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"fbersachia","password":"mce775Followers"}'
  ```

- [ ] Test protected endpoint (with token from login):
  ```bash
  curl https://your-backend.vercel.app/api/stats \
    -H "Authorization: Bearer <your-token>"
  ```

### Frontend Tests

- [ ] Visit frontend URL: `https://your-app.vercel.app`
- [ ] Test login flow with credentials:
  - Username: `fbersachia`
  - Password: `mce775Followers`
- [ ] Test navigation between pages
- [ ] Test logout functionality
- [ ] Test file upload functionality
- [ ] Test whitelist management
- [ ] Test non-followers view
- [ ] Test ex-followers view
- [ ] Test responsive design on mobile

## 7. Custom Domain (Optional)

### Add Custom Domain to Frontend

- [ ] Go to Vercel project settings
- [ ] Navigate to "Domains"
- [ ] Add your custom domain
- [ ] Update DNS records as instructed by Vercel
- [ ] Wait for DNS propagation
- [ ] Update CORS in backend with new domain

### Add Custom Domain to Backend (Optional)

- [ ] Go to Vercel backend project settings
- [ ] Navigate to "Domains"
- [ ] Add API subdomain (e.g., `api.yourdomain.com`)
- [ ] Update DNS records
- [ ] Update frontend `VITE_API_URL` environment variable
- [ ] Redeploy frontend

## 8. Monitoring and Logs

- [ ] Set up Vercel Analytics (Project Settings > Analytics)
- [ ] Monitor deployment logs in Vercel Dashboard
- [ ] Set up error tracking (optional: Sentry, LogRocket)
- [ ] Monitor database performance

## 9. Security Checklist

- [ ] Verify all environment variables are set correctly
- [ ] Ensure JWT_SECRET is strong and unique
- [ ] Verify database connection uses SSL
- [ ] Check CORS configuration allows only your domains
- [ ] Verify user passwords are hashed in database
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Review Vercel security headers
- [ ] Set up rate limiting (if needed)

## 10. Post-Deployment Tasks

- [ ] Update README.md with production URLs
- [ ] Document deployment process
- [ ] Set up continuous deployment (auto-deploy on push to main)
- [ ] Create deployment notifications (Slack, Discord, etc.)
- [ ] Set up backup strategy for database
- [ ] Plan for database migrations on production
- [ ] Document rollback procedure
- [ ] Share production URL with stakeholders

## Troubleshooting

### Backend Issues

**Problem**: API returns 500 errors
- Check Vercel function logs
- Verify environment variables are set
- Check database connection
- Verify database migrations ran successfully

**Problem**: Database connection timeout
- Check database firewall rules
- Verify connection string format
- Ensure database is accessible from Vercel IPs

### Frontend Issues

**Problem**: Cannot login / API calls fail
- Check `VITE_API_URL` environment variable
- Verify backend is deployed and accessible
- Check browser console for CORS errors
- Verify backend CORS configuration

**Problem**: White screen / Build fails
- Check Vercel build logs
- Verify all dependencies are in `package.json`
- Test build locally: `npm run build`
- Check for TypeScript errors

## Rollback Procedure

If deployment fails:

1. [ ] Go to Vercel project
2. [ ] Click "Deployments" tab
3. [ ] Find last working deployment
4. [ ] Click "..." menu > "Promote to Production"
5. [ ] Investigate and fix issue
6. [ ] Redeploy when ready

## Useful Commands

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from CLI
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs <deployment-url>

# Pull environment variables locally
vercel env pull
```

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Node.js Runtime](https://vercel.com/docs/runtimes#official-runtimes/node-js)
- [PlanetScale Documentation](https://planetscale.com/docs)
- [Railway Documentation](https://docs.railway.app)

## Support

For deployment issues:
- Check Vercel status: https://www.vercel-status.com/
- Vercel support: https://vercel.com/support
- Community: https://github.com/vercel/vercel/discussions
