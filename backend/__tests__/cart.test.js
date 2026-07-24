const request = require("supertest");
const app = require("../app");
const { clearTables } = require("./setup");
const { executeQuery } = require("../utils/db_utils");
const pool = require("../db_connection");

let agent;
let token;
let userId;

async function registerAndLogin() {
    await request(app).post("/register").send({ username: "cartuser", password: "testpass", email: "cart@test.com" });

    const user = await executeQuery("SELECT user_id FROM users WHERE username = ?", ["cartuser"]);
    userId = user[0].user_id;

    const loginRes = await request(app).post("/login").send({ username: "cartuser", password: "testpass" });
    token = loginRes.body.token;
}

beforeAll(async () => {
    await clearTables();
    await registerAndLogin();
    agent = request.agent(app);
});

afterAll(async () => {
    await clearTables();
    await pool.end();
});

describe("Cart API", () => {
    describe("GET /cart", () => {
        it("returns empty cart for new user", async () => {
            const res = await agent.get("/cart").set("Authorization", `Bearer ${token}`);
            expect(res.status).toBe(200);
            expect(res.body.items).toEqual([]);
            expect(res.body.totalItems).toBe(0);
            expect(res.body.totalPrice).toBe(0);
        });

        it("returns 401 without token", async () => {
            const res = await agent.get("/cart");
            expect(res.status).toBe(401);
        });
    });

    describe("POST /cart/add", () => {
        it("adds a new item to cart", async () => {
            const res = await agent.post("/cart/add").set("Authorization", `Bearer ${token}`).send({ equipment_id: 1 });

            expect(res.status).toBe(201);

            const cartRes = await agent.get("/cart").set("Authorization", `Bearer ${token}`);
            expect(cartRes.body.items).toHaveLength(1);
            expect(cartRes.body.items[0].equipment_id).toBe(1);
            expect(cartRes.body.items[0].quantity).toBe(1);
            expect(cartRes.body.items[0].name).toBe("PPE Kit");
        });

        it("increments quantity for existing item", async () => {
            const res = await agent.post("/cart/add").set("Authorization", `Bearer ${token}`).send({ equipment_id: 1 });

            expect(res.status).toBe(201);

            const cartRes = await agent.get("/cart").set("Authorization", `Bearer ${token}`);
            expect(cartRes.body.items).toHaveLength(1);
            expect(cartRes.body.items[0].quantity).toBe(2);
        });

        it("returns 404 for non-existent equipment", async () => {
            const res = await agent
                .post("/cart/add")
                .set("Authorization", `Bearer ${token}`)
                .send({ equipment_id: 9999 });

            expect(res.status).toBe(404);
        });

        it("returns 401 without token", async () => {
            const res = await agent.post("/cart/add").send({ equipment_id: 1 });
            expect(res.status).toBe(401);
        });
    });

    describe("PUT /cart/update/:equipment_id", () => {
        it("updates item quantity", async () => {
            const res = await agent.put("/cart/update/1").set("Authorization", `Bearer ${token}`).send({ quantity: 5 });

            expect(res.status).toBe(200);

            const cartRes = await agent.get("/cart").set("Authorization", `Bearer ${token}`);
            expect(cartRes.body.items[0].quantity).toBe(5);
        });

        it("returns 404 for item not in cart", async () => {
            const res = await agent
                .put("/cart/update/9999")
                .set("Authorization", `Bearer ${token}`)
                .send({ quantity: 3 });

            expect(res.status).toBe(404);
        });

        it("rejects quantity below 1", async () => {
            const res = await agent.put("/cart/update/1").set("Authorization", `Bearer ${token}`).send({ quantity: 0 });

            expect(res.status).toBe(400);
        });
    });

    describe("DELETE /cart/remove/:equipment_id", () => {
        it("removes item from cart", async () => {
            await agent.post("/cart/add").set("Authorization", `Bearer ${token}`).send({ equipment_id: 2 });

            const before = await agent.get("/cart").set("Authorization", `Bearer ${token}`);
            expect(before.body.items).toHaveLength(2);

            const res = await agent.delete("/cart/remove/2").set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(200);

            const after = await agent.get("/cart").set("Authorization", `Bearer ${token}`);
            expect(after.body.items).toHaveLength(1);
        });
    });

    describe("POST /cart/merge", () => {
        beforeEach(async () => {
            await executeQuery("DELETE FROM cart_items WHERE user_id = ?", [userId]);
        });

        it("merges new items from localStorage", async () => {
            const res = await agent
                .post("/cart/merge")
                .set("Authorization", `Bearer ${token}`)
                .send({ items: [{ equipment_id: 3, quantity: 2 }] });

            expect(res.status).toBe(200);

            const cartRes = await agent.get("/cart").set("Authorization", `Bearer ${token}`);
            expect(cartRes.body.items).toHaveLength(1);
            expect(cartRes.body.items[0].equipment_id).toBe(3);
            expect(cartRes.body.items[0].quantity).toBe(2);
        });

        it("sums quantities for existing items", async () => {
            await executeQuery("INSERT INTO cart_items (user_id, equipment_id, quantity) VALUES (?, ?, ?)", [
                userId,
                3,
                3,
            ]);

            const res = await agent
                .post("/cart/merge")
                .set("Authorization", `Bearer ${token}`)
                .send({ items: [{ equipment_id: 3, quantity: 4 }] });

            expect(res.status).toBe(200);

            const cartRes = await agent.get("/cart").set("Authorization", `Bearer ${token}`);
            expect(cartRes.body.items[0].quantity).toBe(7);
        });

        it("handles mix of new and existing items", async () => {
            await executeQuery("INSERT INTO cart_items (user_id, equipment_id, quantity) VALUES (?, ?, ?)", [
                userId,
                3,
                2,
            ]);

            const res = await agent
                .post("/cart/merge")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    items: [
                        { equipment_id: 3, quantity: 1 },
                        { equipment_id: 4, quantity: 5 },
                    ],
                });

            expect(res.status).toBe(200);

            const cartRes = await agent.get("/cart").set("Authorization", `Bearer ${token}`);
            const item3 = cartRes.body.items.find((i) => i.equipment_id === 3);
            const item4 = cartRes.body.items.find((i) => i.equipment_id === 4);
            expect(item3.quantity).toBe(3);
            expect(item4.quantity).toBe(5);
        });

        it("returns early with empty items array", async () => {
            const res = await agent.post("/cart/merge").set("Authorization", `Bearer ${token}`).send({ items: [] });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Nothing to merge");
        });
    });

    describe("DELETE /cart", () => {
        it("clears all items from cart", async () => {
            const res = await agent.delete("/cart").set("Authorization", `Bearer ${token}`);
            expect(res.status).toBe(200);

            const cartRes = await agent.get("/cart").set("Authorization", `Bearer ${token}`);
            expect(cartRes.body.items).toHaveLength(0);
        });
    });
});
