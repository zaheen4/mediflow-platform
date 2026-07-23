const request = require("supertest");
const app = require("../app");
const { clearTables, promoteAdmin } = require("./setup");

let userToken;
let adminToken;

beforeAll(async () => {
    await clearTables();

    await request(app).post("/register").send({
        username: "Admin99",
        password: "password123",
        email: "admin@example.com",
    });

    await promoteAdmin("Admin99");

    const adminLogin = await request(app).post("/login").send({
        username: "Admin99",
        password: "password123",
    });
    adminToken = adminLogin.body.token;

    await request(app).post("/register").send({
        username: "orderuser",
        password: "password123",
        email: "order@example.com",
    });

    const userLogin = await request(app).post("/login").send({
        username: "orderuser",
        password: "password123",
    });
    userToken = userLogin.body.token;
});

afterAll(async () => {
    await clearTables();
});

describe("POST /create-order", () => {
    it("should create an order with valid items", async () => {
        const res = await request(app)
            .post("/create-order")
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                items: [{ equipment_id: 1, quantity: 2 }],
            });

        expect(res.status).toBe(201);
        expect(res.body.orderId).toBeDefined();
    });

    it("should reject empty items array", async () => {
        const res = await request(app).post("/create-order").set("Authorization", `Bearer ${userToken}`).send({
            items: [],
        });

        expect(res.status).toBe(400);
    });

    it("should reject non-existent equipment", async () => {
        const res = await request(app)
            .post("/create-order")
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                items: [{ equipment_id: 9999, quantity: 1 }],
            });

        expect(res.status).toBe(404);
    });

    it("should reject insufficient stock", async () => {
        const res = await request(app)
            .post("/create-order")
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                items: [{ equipment_id: 1, quantity: 99999 }],
            });

        expect(res.status).toBe(400);
    });

    it("should reject unauthenticated request", async () => {
        const res = await request(app)
            .post("/create-order")
            .send({
                items: [{ equipment_id: 1, quantity: 1 }],
            });

        expect(res.status).toBe(401);
    });
});

describe("GET /my-orders", () => {
    it("should return orders for authenticated user", async () => {
        const res = await request(app).get("/my-orders").set("Authorization", `Bearer ${userToken}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it("should reject unauthenticated request", async () => {
        const res = await request(app).get("/my-orders");

        expect(res.status).toBe(401);
    });
});

describe("GET /all-orders (Admin only)", () => {
    it("should return all orders for admin", async () => {
        const res = await request(app).get("/all-orders").set("Authorization", `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it("should reject non-admin user", async () => {
        const res = await request(app).get("/all-orders").set("Authorization", `Bearer ${userToken}`);

        expect(res.status).toBe(403);
    });

    it("should reject unauthenticated request", async () => {
        const res = await request(app).get("/all-orders");

        expect(res.status).toBe(401);
    });
});
