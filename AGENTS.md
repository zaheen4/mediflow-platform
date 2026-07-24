# AGENTS.md — MediFlow Platform

## Project Overview
- **Name**: MediFlow Platform (medical equipment e-commerce)
- **Structure**: Monorepo with `frontend/` (React/Vite) and `backend/` (Express/MySQL)
- **GitHub**: https://github.com/zaheen4/mediflow-platform
- **Active branch**: `main`

## Tech Stack

### Frontend (`frontend/`)
- React 18, React Router v7, Vite 6
- Tailwind CSS v4 + DaisyUI v5 (beta)
- Sonner (toast notifications)
- axios (HTTP client)
- ESLint + Prettier (linting/formatting)

### Backend (`backend/`)
- Express 5, MySQL 2 (via `mysql` package)
- JWT authentication, bcrypt for password hashing
- helmet, express-rate-limit, cors (security middleware)
- Connection pooling via `db_connection.js`

## Code Style & Conventions
- **Indentation**: 4 spaces (no tabs)
- **Quotes**: Double quotes (Prettier `singleQuote: false`)
- **Semicolons**: Required
- **Print width**: 120 characters
- **Trailing commas**: ES5 style
- **No comments** unless explicitly requested
- **No emojis** in code or messages
- **Concise responses** — answer directly without preamble

## ESLint Rules
- `react/prop-types`: **off** (reduces noise)
- `react-refresh/only-export-components`: **warn** (accepted for context exports like `CartContext.jsx`)
- `prettier/prettier`: **warn**
- CSS minification warning from DaisyUI is **harmless** — ignore it

## Development Workflow
- **One-command dev**: `npm run dev` from project root starts both frontend and backend
- **Individual servers**: `npm run dev:frontend` or `npm run dev:backend` from root
- **Frontend**: runs on `http://localhost:5173`
- **Backend**: runs on `http://localhost:5000`
- **First-time setup**: `npm run install:all` from root installs all dependencies (also runs Husky `prepare` hook)
- **Build check**: Always run `npm run build` in `frontend/` before committing UI changes
- **Format**: Auto-formatted on commit via Husky + lint-staged (no manual `npm run format` needed)
- **Port conflicts**: If port 5173 is in use, kill the stale Vite process (`lsof -t -i:5173 | xargs kill`)

## Architecture Patterns

### Frontend
- **Global state**: `AuthContext` (user/session) and `CartContext` (cart items) in `src/context/`
- **Route guards**: `ProtectedRoute` component with optional `adminOnly` prop
- **Error handling**: `ErrorBoundary` wraps the entire app in `main.jsx`
- **Notifications**: Single `Toaster` in `main.jsx` — **never** render `Toaster` or call `toast()` inside `setState` callbacks (StrictMode double-invokes them)
- **HTTP**: Use `axios` consistently, base URL from `import.meta.env.VITE_API_BASE_URL`

### Backend
- **Entry point**: `app.js` — middleware order matters: `helmet` → `cors` → `rate-limit` → `express.json()` → routes → `notFoundMiddleware` → `errorMiddleware`
- **Routes**: Modular in `routes/` directory, exported as Express routers
- **Error handling**: `notFoundMiddleware` (404) must come **before** `errorMiddleware` (500)
- **Database**: Use `executeQuery` from `utils/db_utils.js` (connection pooling)

## Security Rules
- **Never commit `.env` files** — they are in `.gitignore`
- **CORS**: Restricted via `CORS_ORIGINS` env var (comma-separated origins)
- **Rate limiting**: 100 requests per 15-minute window
- **JWT**: Stored in localStorage (known limitation — not HttpOnly)
- **Passwords**: Always hashed with bcrypt (min 6 characters enforced)

## Git Workflow
- **Branch strategy**: Simple branch-per-feature on top of `main` (no `develop`/`release`/`hotfix` — overkill for solo dev)
- **When to branch**: UI redesigns, schema changes, refactors touching both frontend+backend, or anything that would break `main` if deployed mid-way. Simple bug fixes and small features can commit directly to `main`.
- **Branch naming**: `feat/<short-description>` or `fix/<short-description>`
- **Incremental commits** per feature/fix or phase
- **Commit messages**: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, etc.) enforced by commitlint
- **Pre-commit hooks**: Husky runs lint-staged (ESLint + Prettier on frontend files, Prettier on backend files)
- **Before merging a branch**: rebase on `main`, then `git merge --no-ff feat/xxx` (preserves branch context in history)
- **Never push** unless explicitly asked
- **todo/ folder**: Git-tracked roadmap — do not delete or ignore

## Known Issues & Gotchas
1. `react-refresh` warns on `CartContext.jsx` exports — **expected, accepted**
2. DaisyUI CSS minification warning (`Unexpected ")"`) — **harmless**
3. StrictMode double-mounts in dev — **never put side effects (like `toast()`) inside `setState` updater functions**
4. `sweetalert2` is installed but **not used** — Sonner is the notification system
5. `prop-types` is in `package.json` but **not used** — ESLint rule is off

## Environment Variables

### Backend (`.env`)
```
PORT=5000
CORS_ORIGINS=http://localhost:5173
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=mediflowdb
SECRET_KEY=<64-char-hex-string>
JWT_EXPIRATION=1h
```

### Frontend (`.env`)
```
VITE_API_BASE_URL=http://localhost:5000
```

## Project Structure
```
mediflow-platform/
├── frontend/
│   ├── src/
│   │   ├── components/Layout/   # Navbar, Footer, HomeLayout
│   │   ├── context/             # AuthContext, CartContext, ErrorBoundary
│   │   ├── pages/               # Route-level page components
│   │   ├── routes/router.jsx    # React Router config
│   │   ├── assets/              # Images, SVGs
│   │   ├── index.css            # Tailwind + custom styles
│   │   └── main.jsx             # Entry point (Toaster, providers)
│   ├── .prettierrc
│   ├── eslint.config.js
│   └── vite.config.js
├── backend/
│   ├── routes/                  # Modular Express routers
│   ├── middleware/              # errorMiddleware (404 + 500)
│   ├── utils/                   # db_utils, auth_utils
│   ├── app.js                   # Express entry point
│   ├── mediflowdb.sql           # Database schema + seed data
│   └── db_connection.js         # MySQL connection pool
├── todo/                        # Improvement roadmap (git-tracked)
├── screenshots/                 # Project screenshots
├── .gitignore
└── README.md
```

## Default Accounts
- **Admin**: Username `Admin99` (check SQL dump for password, or register new admin)
- **User**: Register via `/register` endpoint or UI

## Commands Reference
| Command | Directory | Description |
|---------|-----------|-------------|
| `npm run dev` | root | Start both frontend and backend |
| `npm run dev:frontend` | root | Start frontend only |
| `npm run dev:backend` | root | Start backend only |
| `npm run install:all` | root | Install all dependencies (root + frontend + backend) |
| `npm run build` | frontend/ | Production build |
| `npm run lint` | frontend/ | Run ESLint |
| `npm run format` | frontend/ | Run Prettier |
| `npm start` | backend/ | Start Express server |
