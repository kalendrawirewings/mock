# Setup Guide - AI Interview Platform

## What's Been Built

A full-stack application with:
- **Backend**: Express.js with session-based authentication
- **Database**: Supabase PostgreSQL with users table
- **Frontend**: React + TypeScript with protected routes
- **Authentication**: Login/Signup with session management

## Backend Structure

```
backend/
├── config/
│   └── db.js                    # Supabase connection
├── controllers/
│   ├── authController.js        # Login, register, logout, check auth
│   └── userController.js        # Profile management
├── routes/
│   ├── authRoutes.js           # /api/auth routes
│   └── userRoutes.js           # /api/user routes
├── middlewares/
│   └── authMiddleware.js       # Session authentication check
├── models/
│   └── User.js                 # User model with Supabase
├── .env                        # Environment variables
├── package.json
└── server.js                   # Express server with sessions
```

## Frontend Integration

```
frontend/src/
├── api/
│   ├── axiosInstance.js        # Axios with credentials
│   ├── authApi.js              # Auth API calls
│   └── userApi.js              # User API calls
├── context/
│   └── AuthContext.jsx         # Global auth state
├── hooks/
│   └── useAuth.js              # Auth hook
├── pages/
│   ├── Login.jsx               # Login page
│   └── Signup.jsx              # Signup page
└── components/
    └── ProtectedRoute.jsx      # Route protection wrapper
```

## How to Start

### 1. Start Backend

```bash
cd backend
npm start
```

Backend runs on http://localhost:5000

### 2. Start Frontend

```bash
cd frontend
npm run dev
```

Frontend runs on http://localhost:5173

## Authentication Flow

1. **Registration**: POST `/api/auth/register`
   - Creates user with hashed password
   - Creates session
   - Returns user data

2. **Login**: POST `/api/auth/login`
   - Validates credentials
   - Creates session
   - Returns user data

3. **Session Check**: GET `/api/auth/check`
   - Validates session
   - Returns current user

4. **Logout**: POST `/api/auth/logout`
   - Destroys session
   - Clears cookie

## Protected Routes

All routes except `/login`, `/signup`, and policy pages require authentication:
- `/` → Dashboard
- `/resume` → Resume upload
- `/interview` → Interview session
- `/feedback` → Feedback results
- `/history` → Interview history

## Database Schema

**users table**:
- `id` (uuid, primary key)
- `email` (text, unique)
- `password` (text, hashed with bcrypt)
- `name` (text)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

## API Endpoints

### Public Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/check` - Check auth status

### Protected Routes (require authentication)
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

## Testing the API

### Register a user:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","name":"John Doe"}' \
  -c cookies.txt
```

### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}' \
  -c cookies.txt
```

### Access protected route:
```bash
curl -X GET http://localhost:5000/api/user/profile \
  -b cookies.txt
```

## Security Features

- ✅ Passwords hashed with bcryptjs
- ✅ HTTP-only session cookies
- ✅ CORS configured for frontend
- ✅ Row Level Security on database
- ✅ Session-based authentication
- ✅ Protected routes on frontend and backend
- ✅ Automatic redirect to login on 401

## Current Status

✅ Backend server running on port 5000
✅ Frontend dev server running on port 5173
✅ Database table created with RLS
✅ Authentication fully integrated
✅ Protected routes configured
✅ API tested and working

## Next Steps

1. Visit http://localhost:5173
2. You'll be redirected to `/login`
3. Click "Sign up" to create an account
4. After registration, you'll be logged in automatically
5. Access all protected routes

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SESSION_SECRET=your_session_secret
```

### Frontend (.env)
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
