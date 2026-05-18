# Add .env.example Templates

## Goal
Create `.env.example` files for both frontend and backend so new developers know what environment variables are needed without exposing real values.

## Files to Create
- `backend/.env.example`
- `.env.example` (frontend root)

## Steps

1. Create `backend/.env.example`:
```
# Server Configuration
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=mediflowdb

# JWT Configuration
SECRET_KEY=your_generated_secret_key
JWT_EXPIRATION=1h
```

2. Create `.env.example` in the project root (frontend):
```
# Backend API URL
VITE_API_BASE_URL=http://localhost:5000
```

3. Ensure both `.env` files (not `.env.example`) are in `.gitignore` — they already are.

## Verification
- `git status` should show the two new `.env.example` files as untracked
- `.env` files should NOT appear in `git status`
