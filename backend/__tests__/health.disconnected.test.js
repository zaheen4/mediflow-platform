jest.mock("../utils/db_utils", () => ({
    executeQuery: jest.fn().mockRejectedValue(new Error("db down")),
    getConnection: jest.fn(),
    queryWithConnection: jest.fn(),
    beginTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
}));

const request = require("supertest");
const app = require("../app");

describe("GET /health (db disconnected)", () => {
    it("should report db as disconnected when query fails", async () => {
        const res = await request(app).get("/health");

        expect(res.status).toBe(200);
        expect(res.body.status).toBe("ok");
        expect(res.body.db).toBe("disconnected");
    });
});
