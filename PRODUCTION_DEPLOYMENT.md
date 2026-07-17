# MultiSolution 2.0 - Production Deployment Guide

## Overview

This guide provides instructions for deploying MultiSolution 2.0 to production. The application consists of:
- **Backend**: Node.js + Express + TypeScript + MongoDB (Mongoose)
- **Frontend**: React + TypeScript + Vite + Tailwind CSS v4

## Prerequisites

Before deploying, ensure you have the following:

1. **Node.js** v18+ (LTS recommended)
2. **npm** or **yarn**
3. **MongoDB Atlas** account (or self-hosted MongoDB)
4. **Docker** (optional, for containerized deployment)
5. **Production Environment**: Vercel, Netlify, Render, Railway, AWS, etc.

## Environment Configuration

### Backend Environment Variables (.env.production)

```env
# Server Configuration
NODE_ENV=production
PORT=5000

# MongoDB Atlas Connection String
MONGO_URI=mongodb+srv://infovishalkumar01_db_user:FACNXr7epX4ZqPsu@cluster0.n1no7sj.mongodb.net/

# JWT Secret - Generate a strong, unique secret
# Run: openssl rand -base64 32
JWT_SECRET=your_strong_jwt_secret_key_here

# Frontend URL for CORS (comma-separated for multiple origins)
CLIENT_URL=https://your-production-frontend.com

# Rate Limiting (optional)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
```

### Frontend Environment Variables (.env)

```env
VITE_API_URL=https://your-production-backend.com
```

## Deployment Options

### Option 1: Docker (Recommended)

1. **Build and run the backend:**
   ```bash
   cd multisolution-server
   docker build -t multisolution-backend .
   docker run -d -p 5000:5000 --env-file .env.production multisolution-backend
   ```

2. **Using Docker Compose:**
   ```bash
   docker-compose up -d --build
   ```

3. **View logs:**
   ```bash
   docker logs -f multisolution-backend
   ```

### Option 2: Render / Railway

1. **Create a new Web Service**
2. **Connect your GitHub repository**
3. **Set environment variables** in the dashboard:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `MONGO_URI=mongodb+srv://infovishalkumar01_db_user:FACNXr7epX4ZqPsu@cluster0.n1no7sj.mongodb.net/`
   - `JWT_SECRET=your_strong_jwt_secret`
   - `CLIENT_URL=https://your-frontend-url.com`
4. **Set build command:** `npm run build`
5. **Set start command:** `npm start`
6. **Deploy**

### Option 3: Manual Deployment

#### Backend

```bash
# Install dependencies
cd multisolution-server
npm install --production

# Build TypeScript
npm run build

# Start the server
npm start
```

Use **PM2** for process management:
```bash
npm install -g pm2
pm2 start dist/server.js --name multisolution-backend
pm2 save
pm2 startup
```

#### Frontend

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Serve the dist folder with any static file server
npx serve -s dist -l 3000
```

## Security Best Practices

### 1. HTTPS
- Always use HTTPS in production
- Obtain SSL certificates from Let's Encrypt (free) or your hosting provider

### 2. Environment Variables
- Never commit `.env` files to version control
- Use `.env.example` for documentation
- Store secrets in your deployment platform's secret manager

### 3. Database Security
- Use MongoDB Atlas with IP whitelisting
- Create database users with minimal required privileges
- Enable encryption at rest
- Regularly back up your database

### 4. Application Security
- Keep all dependencies updated
- Run `npm audit` regularly
- Use the security middleware included in the app (helmet, rate limiting, etc.)

### 5. Monitoring
- Set up monitoring for your backend (UptimeRobot, Sentry, etc.)
- Monitor logs in `multisolution-server/logs/`
- Set up alerts for errors

## Creating an Admin User

New sign-ups are always created as `customer` or `worker`. To promote an account to `admin`:

1. **Using MongoDB Shell:**
   ```javascript
   use your-database-name
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { role: "admin" } }
   )
   ```

2. **Using MongoDB Compass:**
   - Find the user document
   - Update the `role` field to `"admin"`

## API Endpoints

### Health Check
- `GET /api/health` - Check if the API is running

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user profile

### Bookings
- `POST /api/bookings` - Create a new booking (public)
- `GET /api/bookings/mine` - Get user's bookings (authenticated)
- `GET /api/bookings` - Get all bookings (admin only)
- `GET /api/bookings/:id` - Get booking by ID (admin or owner)
- `PATCH /api/bookings/:id/status` - Update booking status (admin only)
- `DELETE /api/bookings/:id` - Cancel booking (owner or admin)

### Workers
- `GET /api/workers` - Search available workers (public)
- `GET /api/workers/:id` - Get worker by ID (public)
- `POST /api/workers` - Create worker profile (authenticated worker)
- `GET /api/workers/me/profile` - Get my worker profile (authenticated worker)
- `PATCH /api/workers/me/profile` - Update my worker profile (authenticated worker)
- `PATCH /api/workers/:id/verify` - Verify worker (admin only)

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Verify the connection string
   - Check IP whitelisting in MongoDB Atlas
   - Ensure your network allows outbound connections to MongoDB

2. **CORS Errors**
   - Ensure `CLIENT_URL` is set correctly
   - For development, allow multiple origins with comma separation

3. **JWT Token Issues**
   - Verify `JWT_SECRET` is the same across all instances
   - Ensure cookies are properly configured (httpOnly, secure in production)

4. **Build Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check TypeScript versions match

### Debug Mode

To enable debug logging:
```bash
NODE_ENV=development npm start
```

## Monitoring and Maintenance

### Logs
- Backend logs: `multisolution-server/logs/`
- Combined log: `combined.log`
- Error log: `error.log`

### Backups
- Regularly backup your MongoDB database
- Backup your environment variables
- Keep your deployment configuration under version control

### Updates
- Regularly update dependencies
- Test updates in a staging environment before production
- Monitor for security vulnerabilities

## Support

For issues or questions:
- Check the logs first
- Verify environment variables
- Test in development mode
- Create a minimal reproduction if filing a bug report

---

**Note**: This deployment guide assumes you have the necessary permissions and access to the MongoDB database and deployment platforms. Adjust configurations according to your specific infrastructure and security requirements.
