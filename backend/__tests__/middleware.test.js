const { requireAdmin } = require("../middleware/auth");
const { errorMiddleware, notFoundMiddleware } = require("../middleware/errorMiddleware");
const { verifyToken, generateToken } = require("../utils/auth_utils");
const { ForbiddenError, UnauthorizedError } = require("../utils/errors");
const logger = require("../utils/logger");

beforeAll(() => {
    jest.spyOn(logger, "error").mockImplementation(() => {});
});

afterAll(() => {
    jest.restoreAllMocks();
});

describe("requireAdmin", () => {
    it("should call next() when user is admin", () => {
        const next = jest.fn();
        requireAdmin({ user: { role: "Admin" } }, {}, next);
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("should throw ForbiddenError when no user", () => {
        expect(() => requireAdmin({}, {}, jest.fn())).toThrow(ForbiddenError);
    });

    it("should throw ForbiddenError when user is not admin", () => {
        expect(() => requireAdmin({ user: { role: "User" } }, {}, jest.fn())).toThrow(ForbiddenError);
    });
});

describe("notFoundMiddleware", () => {
    it("should respond 404 with route message", () => {
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        notFoundMiddleware({ originalUrl: "/nope" }, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Route /nope not found" });
    });
});

describe("errorMiddleware", () => {
    it("should respond with err status and message", () => {
        const err = new ForbiddenError("Denied");
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        errorMiddleware(err, {}, res, jest.fn());

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: "Denied" });
    });

    it("should default to 500", () => {
        const err = new Error("boom");
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        errorMiddleware(err, {}, res, jest.fn());

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "boom" });
    });

    it("should include stack in development", () => {
        const prevEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = "development";
        const err = new Error("dev");
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        try {
            errorMiddleware(err, {}, res, jest.fn());
            expect(res.json.mock.calls[0][0].stack).toBeDefined();
        } finally {
            process.env.NODE_ENV = prevEnv;
        }
    });
});

describe("verifyToken", () => {
    it("should set req.user and call next for valid token", () => {
        const token = generateToken(42, "User");
        const req = { headers: { authorization: `Bearer ${token}` } };
        const next = jest.fn();

        verifyToken(req, {}, next);

        expect(req.user).toMatchObject({ user_id: 42, role: "User" });
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("should throw UnauthorizedError when header is missing", () => {
        expect(() => verifyToken({ headers: {} }, {}, jest.fn())).toThrow(UnauthorizedError);
    });

    it("should throw UnauthorizedError for malformed header", () => {
        expect(() => verifyToken({ headers: { authorization: "not-bearer" } }, {}, jest.fn())).toThrow(
            UnauthorizedError
        );
    });

    it("should throw UnauthorizedError for invalid token", () => {
        const req = { headers: { authorization: "Bearer invalid.token.value" } };
        expect(() => verifyToken(req, {}, jest.fn())).toThrow(UnauthorizedError);
    });
});
