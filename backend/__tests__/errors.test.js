const {
    AppError,
    NotFoundError,
    UnauthorizedError,
    ForbiddenError,
    ValidationError,
    ConflictError,
} = require("../utils/errors");

describe("AppError", () => {
    it("sets message and statusCode", () => {
        const err = new AppError("oops", 500);
        expect(err.message).toBe("oops");
        expect(err.statusCode).toBe(500);
        expect(err).toBeInstanceOf(Error);
    });
});

describe("error subclasses", () => {
    it.each([
        [NotFoundError, "Resource not found", 404],
        [UnauthorizedError, "Authentication required", 401],
        [ForbiddenError, "Access denied", 403],
        [ValidationError, "Validation failed", 400],
        [ConflictError, "Resource already exists", 409],
    ])("provides default message and status code", (ErrorClass, message, statusCode) => {
        const err = new ErrorClass();
        expect(err.message).toBe(message);
        expect(err.statusCode).toBe(statusCode);
    });

    it("accepts a custom message", () => {
        const err = new NotFoundError("Custom message");
        expect(err.message).toBe("Custom message");
        expect(err.statusCode).toBe(404);
    });
});
