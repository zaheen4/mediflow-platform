# MediFlow Platform

A full-stack medical equipment e-commerce platform built with React and Express. Users can browse equipment, manage carts, place orders, and view order history. Admins can manage equipment inventory through a dedicated dashboard.

## Features

- **User Authentication**: Registration, login, and JWT-based session management
- **Equipment Catalog**: Browse and search medical equipment with detailed descriptions
- **Shopping Cart**: Add, update, and remove items with persistent cart state
- **Order Management**: Place orders and view order history
- **Admin Dashboard**: CRUD operations for equipment inventory
- **Password Management**: Change password with visibility toggle
- **Responsive UI**: Mobile-friendly design with Tailwind CSS and DaisyUI
- **Toast Notifications**: Real-time feedback for user actions

## Tech Stack

### Frontend
- **React 18** with React Router v7
- **Vite 6** for fast development and building
- **Tailwind CSS v4** + **DaisyUI v5** for styling
- **Sonner** for toast notifications
- **axios** for HTTP requests
- **ESLint** + **Prettier** for code quality

### Backend
- **Express 5** REST API
- **MySQL** with connection pooling
- **JWT** for authentication
- **bcrypt** for password hashing
- **helmet** for security headers
- **express-rate-limit** for request throttling
- **cors** for cross-origin control

## Installation & Setup

### Prerequisites
- **Node.js 18+** and npm ([Download](https://nodejs.org/))
- **MySQL** running locally ([Download](https://www.mysql.com/))

### 1. Clone the Repository
```sh
git clone https://github.com/zaheen4/mediflow-platform.git
cd mediflow-platform
```

### 2. Install Dependencies
```sh
npm run install:all
```
This installs dependencies for the root, frontend, and backend in one command.

### 3. Set Up the Database
```sh
mysql -u root -p < backend/mediflowdb.sql
```

### 4. Configure Environment Variables

**Backend** — copy the template and fill in your values:
```sh
cp backend/.env.example backend/.env
```

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Backend server port | `5000` |
| `CORS_ORIGINS` | Allowed frontend origins (comma-separated) | `http://localhost:5173` |
| `DB_HOST` | MySQL host | `localhost` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | `your_password` |
| `DB_NAME` | Database name | `mediflowdb` |
| `SECRET_KEY` | JWT signing key (64-char hex) | `a1b2c3...` |
| `JWT_EXPIRATION` | Token expiry duration | `1h` |

**Frontend** — copy the template:
```sh
cp frontend/.env.example frontend/.env
```

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5000` |

### 5. Run the Application

**One-command startup** (recommended):
```sh
npm run dev
```

This starts both the backend (port 5000) and frontend (port 5173) simultaneously with color-coded output.

**Individual servers** (if needed):
```sh
npm run dev:backend   # Backend only
npm run dev:frontend  # Frontend only
```

## Available Scripts

| Command | Scope | Description |
|---------|-------|-------------|
| `npm run dev` | root | Start both frontend and backend |
| `npm run dev:frontend` | root | Start frontend only |
| `npm run dev:backend` | root | Start backend only |
| `npm run install:all` | root | Install all dependencies |
| `npm run build` | frontend | Production build |
| `npm run lint` | frontend | Run ESLint |
| `npm run format` | frontend | Format code with Prettier |
| `npm run preview` | frontend | Preview production build |
| `npm start` | backend | Start Express server |

## API Endpoints

All endpoints are prefixed with `http://localhost:5000`.

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/register` | No | Register a new user |
| `POST` | `/login` | No | Login and receive JWT token |
| `PUT` | `/change-password` | Yes | Change authenticated user's password |

**Register Request:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepass123",
  "role": "User"
}
```

**Login Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "role": "User",
  "username": "johndoe"
}
```

### Equipment (Public)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/equipment` | No | Get all equipment |
| `GET` | `/equipment/:id` | No | Get single equipment by ID |

### Equipment (Admin Only)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/add-equipment` | Admin | Add new equipment |
| `PUT` | `/modify-equipment/:id` | Admin | Update equipment |
| `DELETE` | `/delete-equipment/:id` | Admin | Delete equipment |

### Orders

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/create-order` | User | Place a new order |
| `GET` | `/my-orders` | User | Get authenticated user's orders |
| `GET` | `/all-orders` | Admin | Get all orders (all users) |

**Create Order Request:**
```json
{
  "items": [
    { "equipment_id": 1, "quantity": 2, "price": 150.00 },
    { "equipment_id": 3, "quantity": 1, "price": 200.00 }
  ],
  "totalAmount": 500.00
}
```

**Authentication**: Include `Authorization: Bearer <token>` header for protected endpoints.

## Project Structure

```
mediflow-platform/
├── frontend/
│   ├── src/
│   │   ├── components/Layout/   # Navbar, Footer, HomeLayout
│   │   ├── context/             # AuthContext, CartContext, ErrorBoundary
│   │   ├── pages/               # Route-level page components
│   │   ├── routes/router.jsx    # React Router configuration
│   │   ├── assets/              # Images, SVGs
│   │   ├── index.css            # Tailwind + custom styles
│   │   └── main.jsx             # Entry point (Toaster, providers)
│   ├── .prettierrc
│   ├── eslint.config.js
│   └── vite.config.js
├── backend/
│   ├── routes/                  # Modular Express routers
│   │   ├── auth_routes.js
│   │   ├── equipment_routes.js
│   │   └── order_routes.js
│   ├── middleware/              # errorMiddleware (404 + 500)
│   ├── utils/                   # db_utils, auth_utils
│   ├── app.js                   # Express entry point
│   ├── mediflowdb.sql           # Database schema + seed data
│   └── db_connection.js         # MySQL connection pool
├── todo/                        # Improvement roadmap (git-tracked)
├── screenshots/                 # Project screenshots
├── .gitignore
├── AGENTS.md                    # AI assistant project guidelines
└── README.md
```

## Security

- **Helmet**: Sets secure HTTP headers automatically
- **CORS**: Restricted to whitelisted origins via `CORS_ORIGINS` env var
- **Rate Limiting**: 100 requests per 15-minute window per IP
- **JWT Authentication**: Token-based auth with configurable expiry
- **Password Hashing**: bcrypt with salt rounds for secure storage
- **Input Validation**: Server-side validation on all endpoints

## Default Accounts

- **Admin**: Username `Admin99` (password set during database import — register a new admin or check the SQL dump)
- **User**: Register via `/register` endpoint or the UI

## Additional Notes

- MySQL must be running before starting the backend
- `.env` files are excluded from version control — use `.env.example` as templates
- If port 5173 is in use, kill the stale Vite process: `lsof -t -i:5173 | xargs kill`
- Run `npm run build` in `frontend/` before committing UI changes
- Run `npm run format` in `frontend/` before committing to ensure consistent code style
