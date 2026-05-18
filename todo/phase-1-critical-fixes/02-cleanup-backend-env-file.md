# Cleanup Backend .env File

## Goal
Remove leftover Flask configuration variables from the backend `.env` and ensure only Node.js/Express relevant variables exist.

## Files to Touch
- `backend/.env`

## Current State
The `.env` contains Flask-specific variables that are irrelevant:
```
# Flask App Configuration
SECRET_KEY=...
FLASK_DEBUG=True

# JWT Configuration
#JWT_EXPIRATION_DELTA=3600
```

## Steps

1. Replace the entire contents of `backend/.env` with:
```
# Server Configuration
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=mediflowdb

# JWT Configuration
SECRET_KEY=7637c4854c715f3a1a9470ea8535b0b2cce84c67e0025c76ebb90f09d297a6ce
JWT_EXPIRATION=1h
```

2. Remove any comments referencing Flask.

## Verification
- The file should contain only Node.js/Express relevant environment variables
- Backend should still start normally with `node backend/app.js`
