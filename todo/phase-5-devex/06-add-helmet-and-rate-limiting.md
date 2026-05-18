# Add Helmet and Rate Limiting

## Goal
Add security headers with `helmet` and rate limiting with `express-rate-limit` to the backend.

## Steps

1. Install the packages in the backend:
```sh
cd mediflow-backend
npm install helmet express-rate-limit
```

2. Open `mediflow-backend/app.js` and add imports:
```js
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
```

3. Add helmet middleware after CORS:
```js
app.use(cors());
app.use(helmet());
app.use(express.json());
```

4. Add rate limiting. Create a general limiter and a stricter one for auth routes:

```js
// General API rate limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { error: "Too many requests, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

// Auth rate limiter (stricter)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20, // limit each IP to 20 login/register attempts per 15 min
    message: { error: "Too many authentication attempts, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

// Apply general limiter to all routes
app.use(apiLimiter);

// Apply stricter limiter to auth routes (set in auth_routes.js or here)
```

5. To apply the auth limiter specifically, modify `app.js`:
```js
// Instead of:
app.use(authRoutes);

// Use:
app.use(authLimiter);
app.use(authRoutes);
```

Or better, apply it directly in `auth_routes.js`:
```js
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { error: "Too many authentication attempts, please try again later." },
});

router.use(authLimiter);
```

## Verification
- Headers include security headers (check with `curl -I http://localhost:5000/equipment`)
- After 100 requests in 15 minutes → general rate limit kicks in
- After 20 login attempts in 15 minutes → auth rate limit kicks in
- Rate limit headers (`RateLimit-Limit`, `RateLimit-Remaining`) are present in responses
