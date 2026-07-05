# MultiSolution

An on-demand home services marketplace (Urban Company–style): customers book
verified professionals — electricians, plumbers, cleaners, and more —
professionals manage their availability, and admins oversee all bookings.

Monorepo layout:

```
MultiSolution-2.0-main/
├── src/                     # Frontend — React + TypeScript + Vite + Tailwind CSS v4
└── multisolution-server/    # Backend — Node.js + Express + TypeScript + MongoDB (Mongoose)
```

## Features

- **Customers**: browse services, book a professional, track booking status, cancel pending bookings.
- **Professionals**: register with their skills/services and city, manage their profile.
- **Admins**: view every booking, filter by status, assign/update status.
- **Auth**: JWT-based, stored in an httpOnly cookie, with role-based route protection on both frontend and backend.

## Getting started

### 1. Backend

```bash
cd multisolution-server
cp .env.example .env   # then fill in MONGO_URI and JWT_SECRET
npm install
npm run dev             # starts on http://localhost:5000
```

Required environment variables (`multisolution-server/.env`):

| Variable      | Description                                                |
|---------------|--------------------------------------------------------------|
| `PORT`        | Port the API listens on (default `5000`)                    |
| `MONGO_URI`   | MongoDB connection string (local or MongoDB Atlas)           |
| `JWT_SECRET`  | Long random string used to sign auth tokens                  |
| `CLIENT_URL`  | URL of the frontend, used for CORS (default `http://localhost:5173`) |

### 2. Frontend

```bash
cd ..                    # back to the repo root
cp .env.example .env     # defaults to http://localhost:5000, adjust if needed
npm install
npm run dev              # starts on http://localhost:5173
```

### 3. Creating an admin user

New sign-ups are always created as `customer` or `worker`. To promote an
account to `admin`, update it directly in MongoDB:

```js
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```

## API overview

| Method | Route                       | Access        | Description                     |
|--------|------------------------------|---------------|----------------------------------|
| POST   | `/api/auth/register`         | Public        | Create a customer/worker account |
| POST   | `/api/auth/login`             | Public        | Log in                           |
| POST   | `/api/auth/logout`            | Public        | Log out                          |
| GET    | `/api/auth/me`                 | Logged in     | Current user profile             |
| POST   | `/api/bookings`                | Public        | Create a booking                 |
| GET    | `/api/bookings/mine`           | Logged in     | Your own bookings                |
| GET    | `/api/bookings`                | Admin         | All bookings (optional `?status=`)|
| PATCH  | `/api/bookings/:id/status`     | Admin         | Update status / assign a worker  |
| DELETE | `/api/bookings/:id`            | Owner/Admin   | Cancel a booking                 |
| GET    | `/api/workers`                 | Public        | Search available workers          |
| POST   | `/api/workers`                 | Logged in     | Create your worker profile        |
| GET    | `/api/workers/me/profile`      | Logged in     | Your own worker profile           |
| PATCH  | `/api/workers/me/profile`      | Logged in     | Update your worker profile        |
| PATCH  | `/api/workers/:id/verify`      | Admin         | Verify a worker                   |

## Deploying

- **Frontend** → Vercel / Netlify (build command `npm run build`, output `dist/`).
- **Backend** → Render / Railway (build command `npm run build`, start command `npm start`). Set the environment variables listed above in the hosting dashboard, and point `CLIENT_URL` at your deployed frontend URL.

## Tech stack

- React 19, React Router 7, Tailwind CSS 4, Axios, Framer Motion
- Node.js, Express 5, TypeScript, Mongoose 9, JWT auth (bcryptjs, jsonwebtoken)
