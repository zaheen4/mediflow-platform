const request = require("supertest");
const app = require("../app");
const { clearTables, promoteAdmin } = require("./setup");
const pool = require("../db_connection");

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
    await pool.end();
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

describe("GET /my-orders (pagination)", () => {
    it("should return a paginated payload", async () => {
        const res = await request(app).get("/my-orders?page=1&limit=5").set("Authorization", `Bearer ${userToken}`);

        expect(res.status).toBe(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.total).toBeGreaterThanOrEqual(0);
        expect(res.body.page).toBe(1);
        expect(res.body.limit).toBe(5);
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

describe("GET /all-orders (Admin, pagination)", () => {
    it("should return a paginated payload for admin", async () => {
        const res = await request(app).get("/all-orders?page=1&limit=5").set("Authorization", `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.total).toBeGreaterThanOrEqual(0);
        expect(res.body.page).toBe(1);
        expect(res.body.limit).toBe(5);
    });
});

describe("PUT /orders/:id/status (Admin only)", () => {
    let orderId;

    beforeAll(async () => {
        const res = await request(app)
            .post("/create-order")
            .set("Authorization", `Bearer ${userToken}`)
            .send({ items: [{ equipment_id: 2, quantity: 1 }] });
        orderId = res.body.orderId;
    });

    it("should update order status by admin", async () => {
        const res = await request(app)
            .put(`/orders/${orderId}/status`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ status: "Completed" });

        expect(res.status).toBe(200);

        const orders = await request(app).get("/all-orders").set("Authorization", `Bearer ${adminToken}`);
        const order = orders.body.find((o) => o.order_id === orderId);
        expect(order.status).toBe("Completed");
    });

    it("should restore stock when cancelled", async () => {
        const equipBefore = await request(app).get("/equipment/2");
        const stockBefore = equipBefore.body.quantity;

        await request(app)
            .put(`/orders/${orderId}/status`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ status: "Cancelled" });

        const equipAfter = await request(app).get("/equipment/2");
        expect(Number(equipAfter.body.quantity)).toBe(Number(stockBefore) + 1);
    });

    it("should report unchanged status when status is the same", async () => {
        const res = await request(app)
            .put(`/orders/${orderId}/status`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ status: "Cancelled" });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Order status unchanged");
    });

    it("should reject non-admin user", async () => {
        const res = await request(app)
            .put(`/orders/${orderId}/status`)
            .set("Authorization", `Bearer ${userToken}`)
            .send({ status: "Completed" });

        expect(res.status).toBe(403);
    });

    it("should reject unauthenticated request", async () => {
        const res = await request(app).put(`/orders/${orderId}/status`).send({ status: "Completed" });

        expect(res.status).toBe(401);
    });

    it("should reject invalid status", async () => {
        const res = await request(app)
            .put(`/orders/${orderId}/status`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ status: "InvalidStatus" });

        expect(res.status).toBe(400);
    });

    it("should return 404 for non-existent order", async () => {
        const res = await request(app)
            .put("/orders/99999/status")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ status: "Completed" });

        expect(res.status).toBe(404);
    });
});

describe("PUT /orders/:id/cancel (authenticated users)", () => {
    let cancelOrderId;

    beforeAll(async () => {
        const res = await request(app)
            .post("/create-order")
            .set("Authorization", `Bearer ${userToken}`)
            .send({ items: [{ equipment_id: 3, quantity: 1 }] });
        cancelOrderId = res.body.orderId;
    });

    it("should cancel own pending order", async () => {
        const res = await request(app)
            .put(`/orders/${cancelOrderId}/cancel`)
            .set("Authorization", `Bearer ${userToken}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Order cancelled successfully");
    });

    it("should reject cancelling a non-pending order", async () => {
        const orderRes = await request(app)
            .post("/create-order")
            .set("Authorization", `Bearer ${userToken}`)
            .send({ items: [{ equipment_id: 4, quantity: 1 }] });
        const id = orderRes.body.orderId;

        await request(app)
            .put(`/orders/${id}/status`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ status: "Completed" });

        const res = await request(app).put(`/orders/${id}/cancel`).set("Authorization", `Bearer ${userToken}`);

        expect(res.status).toBe(400);
    });

    it("should reject cancelling another user's order", async () => {
        await request(app).post("/register").send({
            username: "otheruser",
            password: "password123",
            email: "other@test.com",
        });
        const otherLogin = await request(app).post("/login").send({
            username: "otheruser",
            password: "password123",
        });

        const res = await request(app)
            .put(`/orders/${cancelOrderId}/cancel`)
            .set("Authorization", `Bearer ${otherLogin.body.token}`);

        expect(res.status).toBe(404);
    });

    it("should reject unauthenticated request", async () => {
        const res = await request(app).put("/orders/1/cancel");

        expect(res.status).toBe(401);
    });
});
