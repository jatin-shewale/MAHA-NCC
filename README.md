# CadetVerse AI — Geo Intelligent NCC Management & Cadet Social Network

CadetVerse AI (Codename: **NCC Command Nexus**) is a production-grade digital ecosystem designed to modernize the National Cadet Corps (NCC) operations. It combines Enterprise Resource Planning (ERP), geo-fenced attendance tracking, and a social achievement network into a unified "defense-grade" platform.

## 🚀 Key Features

### 1. Command Dashboard
- **ANO Command Center**: Real-time analytics on unit strength, attendance trends, and achievement pipelines.
- **Cadet Operational Dossier**: Personal performance metrics, drill proficiency, and service history.

### 2. Smart Geo-Attendance
- **GPS-Fenced Check-in**: Parade validation within a specific radius of the parade ground.
- **Anti-Spoofing**: Validates device integrity and GPS accuracy.
- **Confidence Scoring**: Advanced algorithms to ensure attendance authenticity.

### 3. Social Achievement Network
- **LinkedIn for Cadets**: A professional feed to showcase certificates, camp medals, and firing scores.
- **ANO Moderation**: All achievements require officer verification before becoming public, ensuring unit discipline.

### 4. Digital Identity System
- **Dynamic NCC ID**: QR-verified digital identity card with service details.
- **Dossier Management**: Full service book digitizing enrollment, ranks, and measurements.

### 5. AI Command Copilot
- **Neural Assistant**: AI-driven training guidance for B & C certificate syllabus.
- **Operational Intelligence**: Ask about drill positions, weapon training, or camp eligibility.

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Recharts, Leaflet.
- **Backend**: Node.js, Express, MongoDB Atlas, Socket.io.
- **State Management**: Zustand.
- **Security**: JWT, RBAC (Role-Based Access Control), Helmet, Bcrypt.

---

## 📂 Project Structure

```bash
cadetverse-ai/
├── client/          # Vite + React Frontend
│   ├── src/
│   │   ├── components/  # Atomic components & Backgrounds
│   │   ├── pages/       # Feature-specific pages
│   │   └── store/       # Zustand state management
│
├── server/          # Node.js + Express Backend
│   ├── models/      # Mongoose Schemas
│   ├── controllers/ # Business Logic
│   ├── routes/      # RESTful Endpoints
│   └── scripts/     # Seeding & Data Utils
```

---

## 🏁 Getting Started

### 1. Prerequisites
- MongoDB Atlas account (or local MongoDB).
- Node.js (v18+).

### 2. Environment Setup
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
CLIENT_URLS=http://localhost:5173,https://your-frontend.vercel.app,https://*.vercel.app
```

Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_FILE_BASE_URL=http://localhost:5000
```

### 3. Installation
```bash
# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 4. Seed Data
```bash
cd server
npm run seed
```

### 5. Run Development Servers
```bash
# Start Backend
cd server && npm run dev

# Start Frontend
cd client && npm run dev
```

## Deployment

### Backend on Render
- Use the included `render.yaml` from the repo root, or create a Web Service with:
- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/api/health`
- Required environment variables:
  - `NODE_ENV=production`
  - `MONGO_URI`
  - `JWT_SECRET`
  - `JWT_EXPIRES_IN=7d`
  - `CLIENT_URLS=https://your-frontend.vercel.app,https://*.vercel.app`
  - `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_SECURE`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM`
  - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` if you move uploads to Cloudinary

### Frontend on Vercel
- Set the project root to `client`
- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`
- Add environment variables:
  - `VITE_API_URL=https://your-render-service.onrender.com/api`
  - `VITE_FILE_BASE_URL=https://your-render-service.onrender.com`
- `client/vercel.json` is included so React Router routes resolve correctly on refresh

### Important note about uploads
- The backend currently stores uploaded files in `server/uploads`
- That storage is not durable on Render by default, so uploaded profile images, certificates, and PDFs can disappear after redeploys or restarts
- For production, move uploads to Cloudinary or attach persistent storage before relying on file uploads

---

## 🛡️ Security Protocol
- **RBAC**: Strict role enforcement (Cadet vs. ANO).
- **Data Integrity**: GPS validation and MODERATION_FLOW for all social activity.
- **Encrypted Comms**: JWT-based session management.

---

**Jai Hind!** Developed for the National Cadet Corps Digital Mission.
