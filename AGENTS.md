# AGENTS.md — MediFlow Platform

Medical equipment e-commerce. Monorepo: `frontend/` (React/Vite, ESM) + `backend/` (Express/MySQL, CommonJS).

## Commands

| What | How |
|------|-----|
| Dev both | `npm run dev` (root) |
| Dev frontend | `npm run dev:frontend` (root) → `localhost:5173` |
| Dev backend | `npm run dev:backend` (root) → `localhost:5000` |
| Install all | `npm run install:all` (root) |
| Frontend build | `npm run build` (frontend/) |
| Frontend lint | `npm run lint` (frontend/) |
| Frontend test | `npm test` (frontend/ — vitest) |
| Backend lint | `npm run lint` (backend/) |
| Backend test | `npm test` (backend/ — jest + supertest) |
| Format (auto on commit) | Prettier via Husky + lint-staged |

## Git & PR Workflow

- **Branch**: `feat/<desc>` or `fix/<desc>` from `main`. Branch for anything that would break `main` mid-way (schema changes, cross-stack refactors, UI redesigns). Small fixes → commit directly to `main`.
- **Always use PRs** for merges: `git push -u origin feat/xxx` then `gh pr create` then `gh pr merge --merge` (not squash).
- **Before PR**: rebase on `main`.
- **Commit messages**: Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`, etc.) — enforced by commitlint + husky.
- **Never push unless** branch is ready for PR or explicitly asked.

## Architecture

### Frontend
- `src/main.jsx` — entry, wraps app with providers (Auth, Cart, Toaster, ErrorBoundary)
- `src/routes/router.jsx` — lazy-loaded routes, `ProtectedRoute` (optional `adminOnly`)
- `src/context/` — `AuthContext`, `CartContext` (global state)
- HTTP via `axios`, base URL from `import.meta.env.VITE_API_BASE_URL`
- **`toast()` never inside `setState` updaters** (StrictMode double-invokes in dev)
- Single `<Toaster>` in `main.jsx` — never render another

### Backend
- `app.js` — middleware order: `helmet` → `cors` → `rate-limit` → `express.json()` → routes → `notFoundMiddleware` → `errorMiddleware`
- Routes in `routes/` as Express routers. Error types in `utils/errors.js`.
- DB via `utils/db_utils.js` (`executeQuery`, `beginTransaction`, `queryWithConnection`, `commitTransaction`, `rollbackTransaction`)
- Auth: `verifyToken` in `utils/auth_utils.js` (throws `UnauthorizedError`), `requireAdmin` in `middleware/auth.js` (throws `ForbiddenError`)

## Known Gotchas

- `react-refresh` warns on `CartContext.jsx` exports — **expected, accepted**
- DaisyUI CSS minification `Unexpected ")"` — **harmless**
- `sweetalert2` removed — use Sonner for notifications
- `prop-types` in deps but **not used** — ESLint `react/prop-types` is off
- Port 5173 conflict: `lsof -t -i:5173 | xargs kill`
- `.env` files in `.gitignore` — use `.env.example` as template

## Env

Backend `.env`: `PORT`, `CORS_ORIGINS`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `SECRET_KEY` (64-char hex), `JWT_EXPIRATION`
Frontend `.env`: `VITE_API_BASE_URL`
