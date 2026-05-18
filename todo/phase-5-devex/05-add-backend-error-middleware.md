# Add Backend Error Middleware

## Goal
Add a centralized error handling middleware to the Express backend so unhandled errors return proper JSON responses instead of crashing or hanging.

## Files to Touch
- `mediflow-backend/app.js`
- Create `mediflow-backend/middleware/errorMiddleware.js`

## Steps

1. Create `mediflow-backend/middleware/errorMiddleware.js`:

```js
function errorMiddleware(err, req, res, next) {
    console.error("Error:", err.stack);

    // Default error
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
}

function notFoundMiddleware(req, res, next) {
    res.status(404).json({ error: `Route ${req.originalUrl} not found` });
}

module.exports = { errorMiddleware, notFoundMiddleware };
```

2. Register the middleware in `mediflow-backend/app.js`, AFTER all route registrations:

```js
const { notFoundMiddleware, errorMiddleware } = require('./middleware/errorMiddleware');

// ... existing route registrations ...

// 404 handler for unmatched routes
app.use(notFoundMiddleware);

// Global error handler (must be last)
app.use(errorMiddleware);
```

3. Test by hitting a non-existent endpoint:
```sh
curl http://localhost:5000/nonexistent
```
Should return: `{"error": "Route /nonexistent not found"}`

## Verification
- Unmatched routes → 404 JSON response
- Unhandled errors → 500 JSON response with error message
- In development mode, stack trace is included
- Existing routes continue to work normally
