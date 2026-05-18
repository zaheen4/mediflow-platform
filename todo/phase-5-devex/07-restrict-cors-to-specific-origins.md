# Restrict CORS to Specific Origins

## Goal
Currently `cors()` allows all origins (`*`). Restrict it to the frontend's URL in production while allowing localhost in development.

## Files to Touch
- `backend/app.js`
- `backend/.env`

## Current State
```js
app.use(cors());
```
This allows any website to make requests to your backend.

## Steps

1. Add allowed origins to `backend/.env`:
```
# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

2. Update `backend/app.js`:

```js
// Before:
app.use(cors());

// After:
const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',')
        : ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));
```

3. For production, update the `.env` with your actual frontend URL:
```
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

## Verification
- Requests from `http://localhost:5173` → allowed
- Requests from other origins → blocked (CORS error in browser console)
- `Access-Control-Allow-Origin` header in responses matches the requesting origin
- Pre-flight OPTIONS requests work correctly
