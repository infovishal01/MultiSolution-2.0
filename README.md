# MultiSolution 2.0

> **Production-Ready** On-Demand Home Services Marketplace

An on-demand home services marketplace (Urban Company-style) where:
- **Customers** can browse services, book professionals, track booking status, and cancel pending bookings
- **Professionals** can register with their skills/services and city, manage their profile and availability
- **Admins** can view all bookings, filter by status, assign workers, and verify professionals

**Status: All bugs fixed, security hardened, and production-ready with MongoDB Atlas integration**

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI Library |
| TypeScript | 5.9.3 | Type Safety |
| Vite | 7.3.1 | Build Tool |
| React Router | 7.18.1 | Routing |
| Tailwind CSS | 4.3.2 | Styling |
| Axios | 1.18.1 | HTTP Client |
| Framer Motion | 12.42.2 | Animations |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20+ | Runtime |
| Express | 5.2.1 | Web Framework |
| TypeScript | 6.0.3 | Type Safety |
| MongoDB | - | Database (Atlas configured) |
| Mongoose | 9.7.3 | ODM |
| JWT | 9.0.3 | Authentication |
| bcryptjs | 3.0.3 | Password Hashing |

### Security
| Technology | Purpose |
|------------|---------|
| Helmet | Security Headers |
| express-rate-limit | Rate Limiting |
| express-mongo-sanitize | NoSQL Injection Protection |
| hpp | HTTP Parameter Pollution Protection |
| xss-clean | XSS Protection |
| Winston | Production Logging |

---

## Features
- Customer: Browse services, book professionals, track status, cancel bookings
- Professional: Register with skills, manage profile and availability
- Admin: View all bookings, filter by status, assign workers, verify professionals
- Auth: JWT-based with httpOnly cookies, role-based access control

---

## Getting Started

### Backend
```bash
cd multisolution-server
npm install
npm run dev  # starts on http://localhost:5000
```

**MongoDB is already configured with your connection string.**

### Frontend
```bash
cd ..
npm install
npm run dev  # starts on http://localhost:5173
```

---

## Configuration

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://infovishalkumar01_db_user:FACNXr7epX4ZqPsu@cluster0.n1no7sj.mongodb.net/
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

---

## Production Deployment

### Docker (Recommended)
```bash
docker-compose up -d --build
```

### Manual
```bash
# Backend
cd multisolution-server
npm install --production
npm run build
npm start

# Frontend
cd ..
npm run build
npx serve -s dist -l 3000
```

---

## API Endpoints

### Auth
- POST `/api/auth/register` - Register
- POST `/api/auth/login` - Login
- POST `/api/auth/logout` - Logout
- GET `/api/auth/me` - Current user

### Bookings
- POST `/api/bookings` - Create booking
- GET `/api/bookings/mine` - My bookings
- GET `/api/bookings` - All bookings (Admin)
- PATCH `/api/bookings/:id/status` - Update status (Admin)
- DELETE `/api/bookings/:id` - Cancel booking

### Workers
- GET `/api/workers` - Search workers
- POST `/api/workers` - Create profile (Worker)
- GET `/api/workers/me/profile` - My profile (Worker)
- PATCH `/api/workers/:id/verify` - Verify worker (Admin)

---

## Security Features
- JWT Authentication with httpOnly cookies
- Password hashing (bcrypt)
- Role-based access control
- Input validation & sanitization
- Security headers (Helmet)
- Rate limiting (100 req/15min)
- NoSQL injection protection
- XSS protection
- Production logging (Winston)

---

## Documentation
- [Production Deployment Guide](PRODUCTION_DEPLOYMENT.md)
- [Changes Summary](CHANGES_SUMMARY.md)

---

**MultiSolution 2.0 - Production Ready**
