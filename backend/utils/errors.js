class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(message, 404);
    }
}

class UnauthorizedError extends AppError {
    constructor(message = "Authentication required") {
        super(message, 401);
    }
}

class ForbiddenError extends AppError {
    constructor(message = "Access denied") {
        super(message, 403);
    }
}

class ValidationError extends AppError {
    constructor(message = "Validation failed") {
        super(message, 400);
    }
}

class ConflictError extends AppError {
    constructor(message = "Resource already exists") {
        super(message, 409);
    }
}

module.exports = { AppError, NotFoundError, UnauthorizedError, ForbiddenError, ValidationError, ConflictError };
