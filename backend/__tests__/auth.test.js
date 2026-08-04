const request = require("supertest");
const app = require("../app");
const { clearTables } = require("./setup");
const { generateToken } = require("../utils/auth_utils");
const pool = require("../db_connection");

beforeAll(async () => {
    await clearTables();
});

afterAll(async () => {
    await clearTables();
    await pool.end();
});

describe("POST /register", () => {
    it("should register a new user", async () => {
        const res = await request(app).post("/register").send({
            username: "testuser",
            password: "password123",
            email: "test@example.com",
        });

        expect(res.status).toBe(201);
        expect(res.body.message).toBe("User registered successfully");
    });

    it("should reject short username", async () => {
        const res = await request(app).post("/register").send({
            username: "ab",
            password: "password123",
            email: "test2@example.com",
        });

        expect(res.status).toBe(400);
    });

    it("should reject short password", async () => {
        const res = await request(app).post("/register").send({
            username: "testuser2",
            password: "12345",
            email: "test2@example.com",
        });

        expect(res.status).toBe(400);
    });

    it("should reject invalid email", async () => {
        const res = await request(app).post("/register").send({
            username: "testuser2",
            password: "password123",
            email: "not-an-email",
        });

        expect(res.status).toBe(400);
    });

    it("should reject duplicate username", async () => {
        await request(app).post("/register").send({
            username: "dupuser",
            password: "password123",
            email: "dup@example.com",
        });

        const res = await request(app).post("/register").send({
            username: "dupuser",
            password: "password456",
            email: "other@example.com",
        });

        expect(res.status).toBe(409);
    });

    it("should ignore client-provided role", async () => {
        const res = await request(app).post("/register").send({
            username: "hacker",
            password: "password123",
            email: "hacker@example.com",
            role: "Admin",
        });

        expect(res.status).toBe(201);
    });
});

describe("POST /login", () => {
    it("should login with valid credentials", async () => {
        await request(app).post("/register").send({
            username: "loginuser",
            password: "password123",
            email: "login@example.com",
        });

        const res = await request(app).post("/login").send({
            username: "loginuser",
            password: "password123",
        });

        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
        expect(res.body.role).toBe("User");
        expect(res.body.username).toBe("loginuser");
    });

    it("should login with email", async () => {
        const res = await request(app).post("/login").send({
            username: "login@example.com",
            password: "password123",
        });

        expect(res.status).toBe(200);
    });

    it("should reject invalid password", async () => {
        const res = await request(app).post("/login").send({
            username: "loginuser",
            password: "wrongpassword",
        });

        expect(res.status).toBe(401);
    });

    it("should reject non-existent user", async () => {
        const res = await request(app).post("/login").send({
            username: "nonexistent",
            password: "password123",
        });

        expect(res.status).toBe(401);
    });
});

describe("PUT /change-password", () => {
    let userToken;

    beforeAll(async () => {
        await request(app).post("/register").send({
            username: "changepwuser",
            password: "oldpassword",
            email: "changepw@example.com",
        });

        const loginRes = await request(app).post("/login").send({
            username: "changepwuser",
            password: "oldpassword",
        });

        userToken = loginRes.body.token;
    });

    it("should change password with valid current password", async () => {
        const res = await request(app).put("/change-password").set("Authorization", `Bearer ${userToken}`).send({
            currentPassword: "oldpassword",
            newPassword: "newpassword123",
        });

        expect(res.status).toBe(200);
    });

    it("should reject short new password", async () => {
        const res = await request(app).put("/change-password").set("Authorization", `Bearer ${userToken}`).send({
            currentPassword: "newpassword123",
            newPassword: "12345",
        });

        expect(res.status).toBe(400);
    });

    it("should reject request without token", async () => {
        const res = await request(app).put("/change-password").send({
            currentPassword: "anything",
            newPassword: "anything123",
        });

        expect(res.status).toBe(401);
    });

    it("should reject incorrect current password", async () => {
        const res = await request(app).put("/change-password").set("Authorization", `Bearer ${userToken}`).send({
            currentPassword: "wrongpassword",
            newPassword: "newpassword123",
        });

        expect(res.status).toBe(401);
    });
});

describe("GET /users/me", () => {
    let profileToken;

    beforeAll(async () => {
        await request(app).post("/register").send({
            username: "profileuser",
            password: "password123",
            email: "profile@test.com",
        });

        const loginRes = await request(app).post("/login").send({
            username: "profileuser",
            password: "password123",
        });
        profileToken = loginRes.body.token;
    });

    it("should return current user profile", async () => {
        const res = await request(app).get("/users/me").set("Authorization", `Bearer ${profileToken}`);

        expect(res.status).toBe(200);
        expect(res.body.username).toBe("profileuser");
        expect(res.body.email).toBe("profile@test.com");
        expect(res.body.role).toBe("User");
        expect(res.body.user_id).toBeDefined();
    });

    it("should reject unauthenticated request", async () => {
        const res = await request(app).get("/users/me");
        expect(res.status).toBe(401);
    });
});

describe("PUT /users/me", () => {
    let editToken;

    beforeAll(async () => {
        await request(app).post("/register").send({
            username: "edituser",
            password: "password123",
            email: "edit@test.com",
        });

        const loginRes = await request(app).post("/login").send({
            username: "edituser",
            password: "password123",
        });
        editToken = loginRes.body.token;
    });

    it("should update username and email", async () => {
        const res = await request(app)
            .put("/users/me")
            .set("Authorization", `Bearer ${editToken}`)
            .send({ username: "updateduser", email: "updated@test.com" });

        expect(res.status).toBe(200);
        expect(res.body.username).toBe("updateduser");
        expect(res.body.email).toBe("updated@test.com");
    });

    it("should reject duplicate username", async () => {
        await request(app).post("/register").send({
            username: "existinguser",
            password: "password123",
            email: "existing@test.com",
        });

        const res = await request(app)
            .put("/users/me")
            .set("Authorization", `Bearer ${editToken}`)
            .send({ username: "existinguser", email: "updated@test.com" });

        expect(res.status).toBe(409);
    });

    it("should reject invalid email", async () => {
        const res = await request(app)
            .put("/users/me")
            .set("Authorization", `Bearer ${editToken}`)
            .send({ username: "validuser", email: "not-an-email" });

        expect(res.status).toBe(400);
    });

    it("should reject no fields", async () => {
        const res = await request(app).put("/users/me").set("Authorization", `Bearer ${editToken}`).send({});

        expect(res.status).toBe(400);
    });

    it("should reject unauthenticated request", async () => {
        const res = await request(app).put("/users/me").send({ username: "hacker" });
        expect(res.status).toBe(401);
    });
});

describe("authenticated routes with non-existent user", () => {
    let ghostToken;

    beforeAll(() => {
        ghostToken = generateToken(999999, "User");
    });

    it("change-password should return 404 for missing user", async () => {
        const res = await request(app)
            .put("/change-password")
            .set("Authorization", `Bearer ${ghostToken}`)
            .send({ currentPassword: "password123", newPassword: "newpassword123" });

        expect(res.status).toBe(404);
    });

    it("GET /users/me should return 404 for missing user", async () => {
        const res = await request(app).get("/users/me").set("Authorization", `Bearer ${ghostToken}`);

        expect(res.status).toBe(404);
    });

    it("PUT /users/me should return 404 for missing user", async () => {
        const res = await request(app)
            .put("/users/me")
            .set("Authorization", `Bearer ${ghostToken}`)
            .send({ username: "ghost" });

        expect(res.status).toBe(404);
    });
});
