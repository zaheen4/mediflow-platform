const request = require("supertest");
const app = require("../app");
const { clearTables, promoteAdmin } = require("./setup");

let adminToken;
let userToken;

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
        username: "regularuser",
        password: "password123",
        email: "user@example.com",
    });

    const userLogin = await request(app).post("/login").send({
        username: "regularuser",
        password: "password123",
    });
    userToken = userLogin.body.token;
});

afterAll(async () => {
    await clearTables();
});

describe("GET /equipment", () => {
    it("should return all equipment", async () => {
        const res = await request(app).get("/equipment");

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });
});

describe("GET /equipment/:id", () => {
    it("should return a specific equipment", async () => {
        const res = await request(app).get("/equipment/1");

        expect(res.status).toBe(200);
        expect(res.body.equipment_id).toBe(1);
        expect(res.body.name).toBeDefined();
    });

    it("should return 404 for non-existent equipment", async () => {
        const res = await request(app).get("/equipment/9999");

        expect(res.status).toBe(404);
    });
});

describe("POST /add-equipment (Admin only)", () => {
    it("should add equipment as admin", async () => {
        const res = await request(app).post("/add-equipment").set("Authorization", `Bearer ${adminToken}`).send({
            name: "Test Equipment",
            description: "A test item",
            price: 100.0,
            quantity: 10,
            image_url: "http://example.com/img.jpg",
        });

        expect(res.status).toBe(201);
    });

    it("should reject unauthenticated request", async () => {
        const res = await request(app).post("/add-equipment").send({
            name: "No Auth",
            price: 100,
            quantity: 10,
        });

        expect(res.status).toBe(401);
    });

    it("should reject non-admin user", async () => {
        const res = await request(app).post("/add-equipment").set("Authorization", `Bearer ${userToken}`).send({
            name: "User Added",
            price: 100,
            quantity: 10,
        });

        expect(res.status).toBe(403);
    });

    it("should reject missing name", async () => {
        const res = await request(app).post("/add-equipment").set("Authorization", `Bearer ${adminToken}`).send({
            price: 100,
            quantity: 10,
        });

        expect(res.status).toBe(400);
    });

    it("should reject negative price", async () => {
        const res = await request(app).post("/add-equipment").set("Authorization", `Bearer ${adminToken}`).send({
            name: "Negative Price",
            price: -10,
            quantity: 10,
        });

        expect(res.status).toBe(400);
    });
});

describe("PUT /modify-equipment/:id (Admin only)", () => {
    it("should modify equipment as admin", async () => {
        const res = await request(app).put("/modify-equipment/1").set("Authorization", `Bearer ${adminToken}`).send({
            name: "Updated Equipment",
            price: 200.0,
            quantity: 5,
        });

        expect(res.status).toBe(200);
    });

    it("should reject non-admin", async () => {
        const res = await request(app).put("/modify-equipment/1").set("Authorization", `Bearer ${userToken}`).send({
            name: "Hacker Update",
            price: 1,
            quantity: 1,
        });

        expect(res.status).toBe(403);
    });
});

describe("DELETE /delete-equipment/:id (Admin only)", () => {
    it("should delete equipment as admin", async () => {
        await request(app).post("/add-equipment").set("Authorization", `Bearer ${adminToken}`).send({
            name: "To Delete",
            price: 50,
            quantity: 1,
        });

        const res = await request(app).delete("/delete-equipment/21").set("Authorization", `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
    });

    it("should reject non-admin", async () => {
        const res = await request(app).delete("/delete-equipment/1").set("Authorization", `Bearer ${userToken}`);

        expect(res.status).toBe(403);
    });

    it("should reject unauthenticated request", async () => {
        const res = await request(app).delete("/delete-equipment/1");

        expect(res.status).toBe(401);
    });
});
