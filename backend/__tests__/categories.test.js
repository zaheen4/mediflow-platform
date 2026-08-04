const request = require("supertest");
const app = require("../app");
const { clearTables, createTestUser } = require("./setup");
const pool = require("../db_connection");

let adminToken;
let userToken;

beforeAll(async () => {
    await clearTables();

    const admin = await createTestUser({ username: "catadmin", role: "Admin" });
    adminToken = admin.token;

    const user = await createTestUser({ username: "catuser" });
    userToken = user.token;
});

afterAll(async () => {
    await clearTables();
    await pool.end();
});

describe("GET /categories", () => {
    it("should return all categories", async () => {
        const res = await request(app).get("/categories");

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThanOrEqual(2);
    });
});

describe("GET /categories/:id", () => {
    it("should return a category by id", async () => {
        const res = await request(app).get("/categories/1");

        expect(res.status).toBe(200);
        expect(res.body.category_id).toBe(1);
        expect(res.body.name).toBeDefined();
    });

    it("should return 404 for non-existent category", async () => {
        const res = await request(app).get("/categories/9999");

        expect(res.status).toBe(404);
    });
});

describe("POST /categories (Admin only)", () => {
    it("should create a category as admin", async () => {
        const res = await request(app).post("/categories").set("Authorization", `Bearer ${adminToken}`).send({
            name: "New Category",
            description: "A new category",
        });

        expect(res.status).toBe(201);
        expect(res.body.category_id).toBeDefined();
    });

    it("should reject missing name", async () => {
        const res = await request(app).post("/categories").set("Authorization", `Bearer ${adminToken}`).send({});

        expect(res.status).toBe(400);
    });

    it("should reject blank name", async () => {
        const res = await request(app)
            .post("/categories")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ name: "   " });

        expect(res.status).toBe(400);
    });

    it("should reject non-admin", async () => {
        const res = await request(app)
            .post("/categories")
            .set("Authorization", `Bearer ${userToken}`)
            .send({ name: "Hacker Category" });

        expect(res.status).toBe(403);
    });

    it("should reject unauthenticated request", async () => {
        const res = await request(app).post("/categories").send({ name: "No Auth Category" });

        expect(res.status).toBe(401);
    });
});

describe("PUT /categories/:id (Admin only)", () => {
    it("should update a category as admin", async () => {
        const res = await request(app).put("/categories/2").set("Authorization", `Bearer ${adminToken}`).send({
            name: "Updated Category",
            description: "Updated description",
        });

        expect(res.status).toBe(200);
    });

    it("should reject missing name", async () => {
        const res = await request(app).put("/categories/2").set("Authorization", `Bearer ${adminToken}`).send({});

        expect(res.status).toBe(400);
    });

    it("should return 404 for non-existent category", async () => {
        const res = await request(app)
            .put("/categories/9999")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ name: "Ghost" });

        expect(res.status).toBe(404);
    });

    it("should reject non-admin", async () => {
        const res = await request(app)
            .put("/categories/2")
            .set("Authorization", `Bearer ${userToken}`)
            .send({ name: "Hacker" });

        expect(res.status).toBe(403);
    });
});

describe("DELETE /categories/:id (Admin only)", () => {
    it("should delete a category as admin", async () => {
        const created = await request(app)
            .post("/categories")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ name: "Delete Me" });
        const id = created.body.category_id;

        const res = await request(app).delete(`/categories/${id}`).set("Authorization", `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
    });

    it("should return 404 for non-existent category", async () => {
        const res = await request(app).delete("/categories/9999").set("Authorization", `Bearer ${adminToken}`);

        expect(res.status).toBe(404);
    });

    it("should reject non-admin", async () => {
        const res = await request(app).delete("/categories/1").set("Authorization", `Bearer ${userToken}`);

        expect(res.status).toBe(403);
    });
});
