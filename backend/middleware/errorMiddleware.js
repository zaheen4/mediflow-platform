function errorMiddleware(err, req, res, next) {
    console.error("Error:", err.stack);

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
