const request = require("supertest");
const app = require("../app");
const { clearTables, createTestUser, createEquipment, createOrder } = require("./setup");
const pool = require("../db_connection");

let adminToken;
let userToken;

beforeAll(async () => {
    await clearTables();

    const admin = await createTestUser({ username: "statsadmin", role: "Admin" });
    adminToken = admin.token;

    const user = await createTestUser({ username: "statsuser" });
    userToken = user.token;

    await createEquipment(adminToken, { name: "Stats Item" });
});

afterAll(async () => {
    await clearTables();
    await pool.end();
});

describe("GET /admin/stats", () => {
    it("should return stats for admin", async () => {
        const res = await request(app).get("/admin/stats").set("Authorization", `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
            equipment: expect.any(Number),
            orders: expect.any(Number),
            users: expect.any(Number),
            pendingOrders: expect.any(Number),
            lowStock: expect.any(Number),
        });
        expect(typeof res.body.revenue === "number" || !Number.isNaN(parseFloat(res.body.revenue))).toBe(true);
        expect(Array.isArray(res.body.recentOrders)).toBe(true);
        expect(Array.isArray(res.body.monthlyRevenue)).toBe(true);
    });

    it("should reflect created data", async () => {
        await createOrder(userToken, [{ equipment_id: 1, quantity: 1 }]);

        const res = await request(app).get("/admin/stats").set("Authorization", `Bearer ${adminToken}`);

        expect(res.body.equipment).toBeGreaterThan(0);
        expect(res.body.orders).toBeGreaterThan(0);
        expect(res.body.pendingOrders).toBeGreaterThan(0);
        expect(res.body.users).toBeGreaterThan(0);
        expect(res.body.recentOrders.length).toBeGreaterThan(0);
    });

    it("should reject non-admin", async () => {
        const res = await request(app).get("/admin/stats").set("Authorization", `Bearer ${userToken}`);

        expect(res.status).toBe(403);
    });

    it("should reject unauthenticated request", async () => {
        const res = await request(app).get("/admin/stats");

        expect(res.status).toBe(401);
    });
});
