# Deployment Guide

## Frontend on Vercel

Build settings:
- Framework preset: `Vite`
- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`

Environment variables:
- `VITE_API_URL=https://your-render-backend.onrender.com/api`
- `VITE_FILE_BASE_URL=https://your-render-backend.onrender.com`

## Backend on Render

Create a new Web Service with:
- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`

Environment variables:
- `NODE_ENV=production`
- `PORT=5000`
- `CLIENT_URL=https://your-vercel-frontend.vercel.app`
- `MONGO_URI=<mongodb-atlas-uri>`
- `JWT_SECRET=<strong-secret>`
- `JWT_EXPIRES_IN=7d`
- `EMAIL_HOST=<smtp-host>`
- `EMAIL_PORT=587`
- `EMAIL_SECURE=false`
- `EMAIL_USER=<smtp-user>`
- `EMAIL_PASS=<smtp-password>`
- `EMAIL_FROM="NCC Cadet Management System Pro <no-reply@yourdomain.com>"`

## MongoDB Atlas

1. Create a cluster and database user.
2. Whitelist Render outbound IP ranges or use `0.0.0.0/0` during testing.
3. Copy the SRV connection string into `MONGO_URI`.

## Post Deploy

1. Seed initial data if needed with `npm run seed --workspace server`.
2. Update `CLIENT_URL` and Vercel env vars to match the deployed URLs.
3. Verify login, file upload, PDF export, email reset, and PWA install flow.
