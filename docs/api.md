# NCC Cadet Management System Pro API

Base URL: `http://localhost:5000/api`

Authentication:
- Protected endpoints require `Authorization: Bearer <jwt>`
- Roles: `Admin`, `Cadet`

## Auth

`POST /auth/register`
- Public cadet registration
- The first-ever admin can bootstrap by posting `role: "Admin"` when no admin exists yet

Request:
```json
{
  "name": "Arjun Mehta",
  "email": "cadet@nccpro.com",
  "password": "Cadet@123",
  "phone": "9999999999",
  "wing": "Army Wing",
  "rank": "Cadet Sergeant",
  "address": "Pune",
  "role": "Cadet"
}
```

`POST /auth/login`
```json
{
  "email": "cadet@nccpro.com",
  "password": "Cadet@123"
}
```

`POST /auth/forgot-password`
```json
{
  "email": "cadet@nccpro.com"
}
```

`POST /auth/reset-password/:token`
```json
{
  "password": "NewStrongPass123"
}
```

`GET /auth/me`

## Admin

`GET /admin/dashboard`
- Returns KPI stats, attendance chart series, camp participation series, and recent audit logs

## Users

`GET /users/dashboard`
- Cadet dashboard payload including recommendations, leaderboard, attendance, achievements, and notifications

`PUT /users/profile`
- Multipart form-data
- Fields: `name`, `rank`, `wing`, `phone`, `address`, `profileImage`

`GET /users/leaderboard`

`GET /users/digital-id`

`GET /users/timeline`

`GET /users/performance-report`
- Returns PDF blob

`GET /users/cadets?search=&status=&page=1&limit=10`

`PATCH /users/cadets/:id/review`
```json
{
  "status": "Approved"
}
```

`PUT /users/cadets/:id`

`DELETE /users/cadets/:id`

## Camps

`GET /camps?search=&status=&page=1&limit=10`

`POST /camps`
```json
{
  "title": "National Leadership Camp",
  "description": "Field leadership training",
  "location": "Pune",
  "startDate": "2026-05-01",
  "endDate": "2026-05-05",
  "capacity": 50,
  "status": "Upcoming"
}
```

`PUT /camps/:id`

`DELETE /camps/:id`

`POST /camps/:id/apply`

`PATCH /camps/:id/applicants/:cadetId`
```json
{
  "status": "Approved"
}
```

## Attendance

`GET /attendance?cadet=<id>&page=1&limit=10`

`POST /attendance`
```json
{
  "cadet": "mongoObjectId",
  "date": "2026-04-23T00:00:00.000Z",
  "status": "Present",
  "remarks": "On time"
}
```

`GET /attendance/qr`

`POST /attendance/scan`
```json
{
  "qrToken": "cadetId:timestamp",
  "date": "2026-04-23T00:00:00.000Z"
}
```

## Achievements

`GET /achievements?status=Pending&page=1&limit=10`

`POST /achievements`
- Multipart form-data
- Fields: `title`, `description`, `certificate`

`PATCH /achievements/:id/review`
```json
{
  "status": "Approved"
}
```

## Materials

`GET /materials?page=1&limit=10`

`POST /materials`
- Multipart form-data
- Fields: `title`, `category`, `visibility`, `file`

`DELETE /materials/:id`

## Notifications

`GET /notifications?page=1&limit=10`

`POST /notifications`
```json
{
  "title": "Camp briefing at 0700",
  "message": "All cadets report in full uniform.",
  "type": "Announcement"
}
```

`PATCH /notifications/:id/read`
