# MediFlow Platform — Development Roadmap

## Legend
- Each phase builds on the previous one
- Items within a phase are unordered (pick any)
- Phases 3 and 4 can be parallelized

---

## Phase 1: Security & Critical Bugs

### 1.1 Fix Admin Role Self-Registration
- **Problem**: `/register` endpoint accepts `role` from the client — attacker can register as Admin
- **Fix**: Force `role` to `"User"` server-side; remove role from request body entirely
- **File**: `backend/routes/auth_routes.js`

### 1.2 Add Server-Side Price & Stock Verification
- **Problem**: Orders trust client-supplied `price` and `totalAmount`; no stock check
- **Fix**: Look up equipment prices from DB, calculate totals server-side, verify stock availability, decrement stock on order
- **Files**: `backend/routes/order_routes.js`

### 1.3 Wrap Order Creation in Transaction
- **Problem**: `orders` + `order_items` inserts are not atomic — partial writes if a later insert fails
- **Fix**: Use MySQL `START TRANSACTION` / `COMMIT` / `ROLLBACK`
- **File**: `backend/routes/order_routes.js`

### 1.4 Fix OrderHistory.jsx
- **Problem 1**: Hardcoded `http://localhost:5000/api/orders` — breaks in non-local envs
- **Problem 2**: Reads token from `localStorage.getItem("token")` — should parse `localStorage.getItem("user")`
- **Fix**: Use `VITE_API_BASE_URL` env var; read token from AuthContext
- **File**: `frontend/src/pages/Orders/OrderHistory.jsx`

### 1.5 Use JWT_EXPIRATION Environment Variable
- **Problem**: `auth_utils.js` hardcodes `"1h"`, ignores `process.env.JWT_EXPIRATION`
- **Fix**: Read from env var with `"1h"` as fallback
- **File**: `backend/utils/auth_utils.js`

### 1.6 Add Request Body Size Limit
- **Problem**: `express.json()` called with no `{ limit }` — large payloads can exhaust memory
- **Fix**: `express.json({ limit: "10kb" })`
- **File**: `backend/app.js`

### 1.7 Add Database Indexes
- **Problem**: Missing indexes on FK columns — slow JOINs at scale
- **Fix**: Add indexes: `orders.user_id`, `order_items.order_id`, `order_items.equipment_id`
- **File**: `backend/mediflowdb.sql`

### 1.8 Add Frontend 404 Catch-All Route
- **Problem**: Unknown paths render an empty shell with navbar/footer but no content
- **Fix**: Add wildcard route `<Route path="*" element={<NotFound />} />`
- **Files**: `frontend/src/routes/router.jsx`, new `frontend/src/pages/NotFound.jsx`

---

## Phase 2: Core Architecture

### 2.1 Centralized API Client
- **What**: Single axios instance in `frontend/src/services/api.js`
  - Base URL from `VITE_API_BASE_URL`
  - Auth interceptor: auto-attach Bearer token from AuthContext
  - 401 interceptor: auto-logout on expired token
  - Consistent error handling
- **Files affected**: All frontend pages (remove scattered axios calls)

### 2.2 Input Validation Library (Backend)
- **What**: Install `express-validator` or `zod`; create validation middleware for all routes
- **Why**: Replace ad-hoc manual validation with declarative schemas
- **Files affected**: All `backend/routes/*.js`

### 2.3 Custom Error Classes
- **What**: Create `AppError`, `NotFoundError`, `ValidationError` in `backend/utils/errors.js`
- **Why**: Consistent error response format; stop leaking `error.message` to clients
- **Files**: New `backend/utils/errors.js`, update `backend/middleware/errorMiddleware.js`, update all routes

### 2.4 Reusable Admin Middleware
- **What**: Extract inline `req.user.role !== "Admin"` checks into `requireAdmin` middleware
- **File**: New `backend/middleware/auth.js` alongside existing `errorMiddleware.js`

### 2.5 Structured Logging (Backend)
- **What**: Install `pino` (or `winston`) + `pino-http` for request logging
- **Why**: Replace `console.log`/`console.error` with JSON-structured, level-based logging
- **Files**: New `backend/utils/logger.js`, update `backend/app.js` and all routes

### 2.6 Loading & Disabled States on All Forms
- **What**: Login, Register, Cart/Checkout, Change Password buttons should show spinner + disable during API calls
- **Why**: Prevent double-submit and give user feedback
- **Files affected**: All frontend form pages

### 2.7 Frontend Form Validation
- **What**: Match backend validation rules on the frontend (password min 6 chars, username 3-50 chars, email format)
- **Files affected**: Login, Register, Profile pages

---

## Phase 3: Testing

### 3.1 Backend API Tests
- **Framework**: `jest` + `supertest`
- **Coverage**: All 9 endpoints — auth flows, equipment CRUD, order creation, auth guards, error cases
- **Infra**: Test database or in-memory SQLite, test scripts in `backend/package.json`

### 3.2 Frontend Unit Tests
- **Framework**: `vitest` + `@testing-library/react` + `@testing-library/jest-dom`
- **Coverage**: AuthContext, CartContext, ProtectedRoute, form pages, Navbar, error boundary
- **Infra**: Test scripts in `frontend/package.json`, coverage config

### 3.3 CI Integration
- **What**: Run tests in Phase 4 CI pipeline
- **Prereq**: Phase 3.1 + 3.2 completed

---

## Phase 4: Infrastructure & DevOps

### 4.1 Docker Setup
- **Backend**: `backend/Dockerfile` (Node.js + app)
- **Frontend**: `frontend/Dockerfile` (multi-stage: build with node, serve with nginx)
- **Orchestration**: `docker-compose.yml` with MySQL + backend + frontend services
- **Extras**: `.dockerignore`, build arguments for env vars

### 4.2 CI/CD (GitHub Actions)
- **Workflow**: `.github/workflows/ci.yml`
  - Lint → Test → Build on every PR and push to main
  - Optional: deploy step
- **Prereq**: Phase 3 testing infra

### 4.3 Health Check Endpoint
- **What**: `GET /health` returning `{ status: "ok", db: "connected", uptime: 12345 }`
- **File**: New `backend/routes/health_routes.js`

### 4.4 Environment Validation
- **What**: Backend startup validates required vars (`SECRET_KEY`, `DB_HOST`, etc.) with clear error messages
- **Tool**: `envalid` or custom function
- **File**: `backend/app.js`

### 4.5 EditorConfig
- **What**: `.editorconfig` at project root for cross-editor consistency
- **Settings**: 4-space indent, UTF-8, LF line endings

### 4.6 Node.js Version Pinning
- **What**: `.nvmrc` with Node 20 (or 22). Add `engines` field to all `package.json` files.

### 4.7 LICENSE File
- **What**: Add MIT license (or whichever applies) as `LICENSE` at project root

### 4.8 Cleanup Unused Dependencies
- **Frontend**: Remove `sweetalert2`, `localforage`, `match-sorter`, `sort-by`, `prop-types`
- **Files**: `frontend/package.json`

### 4.9 Update `.gitignore`
- **Add**: `coverage/`, `.eslintcache`, `*.tgz`, `Thumbs.db`

---

## Phase 5: Features & UX

### 5.1 Product Detail Page
- **Route**: `/equipment/:id`
- **What**: Full description, larger image, price, stock indicator, add-to-cart button, reviews placeholder
- **Files**: New `frontend/src/pages/Equipment/EquipmentDetail.jsx`, update router

### 5.2 Pagination (Server + Client)
- **Backend**: Add `?page=1&limit=20` params to `GET /equipment` and `GET /all-orders`
- **Frontend**: Pagination controls on Shop and OrderHistory pages

### 5.3 Equipment Search & Filter
- **Backend**: `?search=term&category=X` params on `GET /equipment`
- **Frontend**: Search bar + category dropdown on Shop page

### 5.4 Equipment Categories
- **Backend**: New `categories` table, FK on `equipment`, CRUD endpoints for admin
- **Frontend**: Category management in AdminDashboard

### 5.5 Admin Order Management
- **Backend**: `PUT /orders/:id/status` to update order status
- **Frontend**: Admin can mark orders as Completed/Cancelled from order list

### 5.6 User Profile Update
- **Backend**: `GET /users/me` + `PUT /users/me`
- **Frontend**: Edit username/email in Profile page

### 5.7 Dark Mode
- **What**: DaisyUI theme toggle (`data-theme="dark"` / `"light"`), persist preference in localStorage
- **Files**: `frontend/src/components/Layout/Navbar.jsx`, `frontend/index.html`

### 5.8 Code Splitting
- **What**: Lazy-load route-level components with `React.lazy` + `Suspense`
- **Files**: `frontend/src/routes/router.jsx`

### 5.9 Per-Route Error Boundaries
- **What**: Add `errorElement` to React Router v7 config
- **Files**: `frontend/src/routes/router.jsx`

---

## Phase 6: Polish

### 6.1 API Documentation
- **What**: OpenAPI/Swagger spec via `swagger-jsdoc` + `swagger-ui-express`
- **Files**: New `backend/docs/` or inline JSDoc on routes

### 6.2 Accessibility
- **What**: `aria-labels`, `role` attributes, `alt` text on images, skip-to-content link, keyboard nav
- **Files**: All frontend pages

### 6.3 SEO
- **What**: Open Graph meta tags (`og:title`, `og:description`, `og:image`), `robots.txt`, `sitemap.xml`
- **Files**: `frontend/index.html`, new `frontend/public/robots.txt`, `frontend/public/sitemap.xml`

### 6.4 Soft Deletes
- **What**: Add `deleted_at` TIMESTAMP columns instead of hard `DELETE`
- **Backend**: Update all CRUD routes to use `WHERE deleted_at IS NULL`
- **Files**: `backend/mediflowdb.sql`, all CRUD routes

### 6.5 Audit Logging
- **What**: New `audit_log` table recording user actions (login, order creation, admin operations)
- **Backend**: Middleware to log actions
- **Files**: New `backend/routes/audit.js` or inline in existing routes

### 6.6 Migrate `mysql` to `mysql2`
- **What**: Replace `mysql` package with `mysql2` (native promises, better security, actively maintained)
- **Files**: `backend/db_connection.js`, `backend/utils/db_utils.js`, `backend/package.json`

---

## Quick Reference: File Impact Map

| File | Phase(s) |
|------|----------|
| `backend/auth_routes.js` | 1.1, 2.2, 2.3, 2.5 |
| `backend/equipment_routes.js` | 2.2, 2.3, 2.5 |
| `backend/order_routes.js` | 1.2, 1.3, 2.2, 2.3, 2.5, 5.5 |
| `backend/utils/auth_utils.js` | 1.5 |
| `backend/utils/db_utils.js` | 6.6 |
| `backend/middleware/errorMiddleware.js` | 2.3 |
| `backend/middleware/` (new) | 2.4 (auth middleware) |
| `backend/utils/logger.js` (new) | 2.5 |
| `backend/utils/errors.js` (new) | 2.3 |
| `backend/app.js` | 1.6, 2.5, 4.4 |
| `backend/mediflowdb.sql` | 1.7, 5.4, 6.4, 6.5 |
| `backend/package.json` | 2.5, 4.6, 6.6 |
| `frontend/OrderHistory.jsx` | 1.4 |
| `frontend/router.jsx` | 1.8, 5.1, 5.8, 5.9 |
| `frontend/pages/NotFound.jsx` (new) | 1.8 |
| `frontend/services/api.js` (new) | 2.1 |
| All frontend pages | 2.1, 2.6, 2.7 |
| `frontend/package.json` | 3.2, 4.8 |
| `.github/workflows/ci.yml` (new) | 4.2 |
| `backend/Dockerfile` (new) | 4.1 |
| `frontend/Dockerfile` (new) | 4.1 |
| `docker-compose.yml` (new) | 4.1 |
| `backend/routes/health_routes.js` (new) | 4.3 |
| `.editorconfig` (new) | 4.5 |
| `.nvmrc` (new) | 4.6 |
| `LICENSE` (new) | 4.7 |
| `.gitignore` | 4.9 |
