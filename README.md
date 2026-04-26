# NCC Cadet Management System Pro

Production-style MERN stack application for cadet administration, camp workflows, attendance, achievements, study materials, notifications, leaderboard tracking, digital ID support, PDF reporting, and PWA delivery.

## Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios, Framer Motion, Recharts, React Icons, PWA
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, Multer, Nodemailer
- Security: Helmet, rate limiting, Mongo sanitization, validation middleware, RBAC, audit logging

## Folder Structure

```text
.
|-- client/
|   |-- public/
|   |-- src/
|   |   |-- api/
|   |   |-- components/
|   |   |-- context/
|   |   |-- pages/
|   |   |-- routes/
|   |   `-- styles/
|-- server/
|   |-- config/
|   |-- controllers/
|   |-- middlewares/
|   |-- models/
|   |-- routes/
|   |-- scripts/
|   |-- services/
|   |-- uploads/
|   `-- utils/
|-- docs/
|   |-- api.md
|   `-- deployment.md
|-- .env.example
`-- package.json
```

## Features

- JWT authentication with forgot/reset password flow
- Admin and cadet role separation
- Admin approval for cadet registrations
- Admin dashboard with KPI cards, analytics charts, audit logs, and CRUD operations
- Cadet dashboard with camp applications, achievement uploads, QR attendance pass, leaderboard, recommendations, and PDF reports
- Study material management, notifications, announcements, and timeline views
- Mobile-first premium glassmorphism UI with dark/light mode and installable PWA support

## Local Setup

1. Copy `.env.example` to `.env`
2. Copy `server/.env.example` to `server/.env`
3. Copy `client/.env.example` to `client/.env`
4. Install dependencies:

```bash
npm install
npm install --workspace server
npm install --workspace client
```

5. Start MongoDB locally or point `MONGO_URI` to Atlas
6. Seed starter data:

```bash
npm run seed
```

Default seed accounts:
- Admin: `admin@nccpro.com` / `Admin@123`
- Cadet: `cadet@nccpro.com` / `Cadet@123`

7. Run the app:

```bash
npm run dev
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:5000`

## API Docs

See [docs/api.md](docs/api.md)

## Deployment

See [docs/deployment.md](docs/deployment.md)

## Notes

- Public registration is cadet-first. The very first admin can bootstrap the platform before any admin exists.
- File uploads are stored locally in `server/uploads` by default.
- For production, use managed SMTP and MongoDB Atlas, and serve uploads from persistent object storage if needed.
