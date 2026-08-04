const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
const { PrismaClient } = require("@prisma/client");

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

module.exports = { recreateDatabase, clearTables, promoteAdmin, TEST_DB };
