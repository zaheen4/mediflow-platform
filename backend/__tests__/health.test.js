const request = require("supertest");
const app = require("../app");

describe("GET /health", () => {
    it("should return ok status with connected db", async () => {
        const res = await request(app).get("/health");

        expect(res.status).toBe(200);
        expect(res.body.status).toBe("ok");
        expect(res.body.db).toBe("connected");
        expect(typeof res.body.uptime).toBe("number");
        expect(new Date(res.body.timestamp).getTime()).not.toBeNaN();
    });
});

describe("GET /unknown-route", () => {
    it("should return 404 via notFoundMiddleware", async () => {
        const res = await request(app).get("/does-not-exist");

        expect(res.status).toBe(404);
        expect(res.body.error).toContain("not found");
    });
});

describe("CORS", () => {
    it("should reject disallowed origins", async () => {
        const res = await request(app).get("/health").set("Origin", "http://evil.example.com");

        expect(res.status).toBe(500);
        expect(res.body.error).toBe("Not allowed by CORS");
    });
});
