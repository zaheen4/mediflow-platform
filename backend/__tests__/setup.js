const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
const { PrismaClient } = require("@prisma/client");
const request = require("supertest");
const app = require("../app");

const TEST_DB = "mediflowdb_test";

function createTestPrisma() {
    const url = new URL(process.env.DATABASE_URL);
    const adapter = new PrismaMariaDb({
        host: url.hostname,
        port: Number(url.port) || 3306,
        user: decodeURIComponent(url.username),
        password: decodeURIComponent(url.password),
        database: url.pathname.replace(/^\//, ""),
    });
    const prisma = new PrismaClient({ adapter });
    return { prisma };
}

async function recreateDatabase() {}

async function clearTables() {
    const { prisma } = createTestPrisma();
    await prisma.cartItem.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.equipment.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    await prisma.category.createMany({
        data: [
            { id: 1, name: "Protective Equipment", description: "PPE" },
            { id: 2, name: "Diagnostic Equipment", description: "Diagnostics" },
        ],
    });
    await prisma.equipment.createMany({
        data: [
            {
                id: 1,
                name: "PPE Kit",
                description: "Disposable PPE Coverall",
                price: 109.72,
                quantity: 3400,
                imageUrl: "http://example.com/ppe.jpg",
                categoryId: 1,
            },
            {
                id: 2,
                name: "X-Ray Machine",
                description: "Medical X-Ray System",
                price: 1218972.1,
                quantity: 1,
                imageUrl: "http://example.com/xray.jpg",
                categoryId: 2,
            },
            {
                id: 3,
                name: "Surgical Kit",
                description: "Basic Surgical Instrument Set",
                price: 242599.94,
                quantity: 5,
                imageUrl: "http://example.com/surgical.jpg",
            },
            {
                id: 4,
                name: "Blood Analyzer",
                description: "Auto 5 Part Hematology Analyzer",
                price: 60954.6,
                quantity: 1,
                imageUrl: "http://example.com/blood.jpg",
            },
            {
                id: 5,
                name: "Patient Monitor",
                description: "Multi-Parameter Monitor",
                price: 19505.48,
                quantity: 1,
                imageUrl: "http://example.com/monitor.jpg",
            },
        ],
    });
    await prisma.$disconnect();
}

async function promoteAdmin(username) {
    const { prisma } = createTestPrisma();
    await prisma.user.update({
        where: { username },
        data: { role: "Admin" },
    });
    await prisma.$disconnect();
}

async function createTestUser({ username, password = "password123", email, role = "User" } = {}) {
    const userEmail = email || `${username}@test.com`;
    const register = await request(app).post("/register").send({ username, password, email: userEmail });
    if (register.status !== 201) {
        throw new Error(`createTestUser: register failed (${register.status}): ${JSON.stringify(register.body)}`);
    }
    if (role === "Admin") {
        await promoteAdmin(username);
    }
    const login = await request(app).post("/login").send({ username, password });
    return { username, password, email: userEmail, role, token: login.body.token };
}

async function loginAs(username, password = "password123") {
    const res = await request(app).post("/login").send({ username, password });
    return { token: res.body.token, role: res.body.role };
}

async function getAuthToken(username, password = "password123") {
    const res = await request(app).post("/login").send({ username, password });
    return res.body.token;
}

async function createEquipment(adminToken, overrides = {}) {
    const payload = {
        name: overrides.name ?? `Test Equipment ${Date.now()}`,
        description: overrides.description ?? "Test equipment",
        price: overrides.price ?? 100,
        quantity: overrides.quantity ?? 10,
    };
    if (overrides.image_url !== undefined) payload.image_url = overrides.image_url;
    if (overrides.category_id !== undefined) payload.category_id = overrides.category_id;
    const res = await request(app).post("/add-equipment").set("Authorization", `Bearer ${adminToken}`).send(payload);
    if (res.status !== 201) {
        throw new Error(`createEquipment: add failed (${res.status}): ${JSON.stringify(res.body)}`);
    }
    return res.body;
}

async function createOrder(userToken, items) {
    const res = await request(app).post("/create-order").set("Authorization", `Bearer ${userToken}`).send({ items });
    if (res.status !== 201) {
        throw new Error(`createOrder: failed (${res.status}): ${JSON.stringify(res.body)}`);
    }
    return res.body.orderId;
}

module.exports = {
    recreateDatabase,
    clearTables,
    promoteAdmin,
    createTestUser,
    loginAs,
    getAuthToken,
    createEquipment,
    createOrder,
    TEST_DB,
};
