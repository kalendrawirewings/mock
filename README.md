# AI Interview Platform

Full-stack application with authentication using Express sessions and Supabase PostgreSQL database.

## Project Structure

```
project/
├── frontend/          # React + TypeScript + Vite
└── backend/           # Express + Node.js + Supabase
```

## Backend Setup

### Technologies
- Express.js
- Supabase (PostgreSQL)
- Express Session (for authentication)
- bcryptjs (password hashing)

### Installation

```bash
cd backend
npm install
```

### Environment Variables

Create `.env` file in backend directory:

```
PORT=5000
NODE_ENV=development
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SESSION_SECRET=your_session_secret
```

### Database Setup

The users table is automatically created with the following schema:
- id (uuid, primary key)
- email (text, unique)
- password (text, hashed)
- name (text)
- created_at (timestamp)
- updated_at (timestamp)

### Running Backend

```bash
npm start        # Production
npm run dev      # Development (with nodemon)
```

Backend runs on: http://localhost:5000

## API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /api/auth/register` - Register new user
  - Body: `{ email, password, name }`

- `POST /api/auth/login` - Login user
  - Body: `{ email, password }`

- `POST /api/auth/logout` - Logout user

- `GET /api/auth/check` - Check authentication status

### User Routes (`/api/user`) - Protected

- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
  - Body: `{ name }`

## Frontend Setup

### Technologies
- React 18
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Axios

### Installation

```bash
cd frontend
npm install
```

### Running Frontend

```bash
npm run dev
```

Frontend runs on: http://localhost:5173

## Authentication Flow

1. User registration/login creates a session
2. Session is stored server-side with session ID in cookie
3. Protected routes check for valid session
4. Frontend uses AuthContext to manage authentication state
5. Axios interceptor redirects to login on 401 errors

## Protected Routes

All application routes require authentication except:
- `/login`
- `/signup`
- Policy pages (privacy, terms, refund, cookie)

## Features

- Session-based authentication
- Password hashing with bcryptjs
- Protected API routes with middleware
- Frontend route protection
- User profile management
- Automatic redirect to login for unauthenticated users

## Security Features

- Row Level Security (RLS) enabled on users table
- CORS configured for frontend origin
- HTTP-only cookies for session
- Password hashing before storage
- Session secret for encryption
