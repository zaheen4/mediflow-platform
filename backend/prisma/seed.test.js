const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

async function seed() {
    const url = new URL(process.env.DATABASE_URL);
    const adapter = new PrismaMariaDb({
        host: url.hostname,
        port: Number(url.port) || 3306,
        user: decodeURIComponent(url.username),
        password: decodeURIComponent(url.password),
        database: url.pathname.replace(/^\//, ""),
    });
    const prisma = new PrismaClient({ adapter });

    const adminPassword = await bcrypt.hash("password123", 10);

    await prisma.user.create({
        data: { id: 1, username: "Admin99", password: adminPassword, role: "Admin", email: "admin99@gmail.com" },
    });
    await prisma.user.create({
        data: { id: 2, username: "testuser", password: adminPassword, role: "User", email: "test@example.com" },
    });

    await prisma.category.create({ data: { id: 1, name: "Protective Equipment", description: "PPE" } });
    await prisma.category.create({ data: { id: 2, name: "Diagnostic Equipment", description: "Diagnostics" } });

    await prisma.equipment.create({
        data: {
            id: 1,
            name: "PPE Kit",
            description: "Disposable PPE Coverall",
            price: 109.72,
            quantity: 3400,
            imageUrl: "http://example.com/ppe.jpg",
            categoryId: 1,
        },
    });
    await prisma.equipment.create({
        data: {
            id: 2,
            name: "X-Ray Machine",
            description: "Medical X-Ray System",
            price: 1218972.1,
            quantity: 1,
            imageUrl: "http://example.com/xray.jpg",
            categoryId: 2,
        },
    });
    await prisma.equipment.create({
        data: {
            id: 3,
            name: "Surgical Kit",
            description: "Basic Surgical Instrument Set",
            price: 242599.94,
            quantity: 5,
            imageUrl: "http://example.com/surgical.jpg",
        },
    });
    await prisma.equipment.create({
        data: {
            id: 4,
            name: "Blood Analyzer",
            description: "Auto 5 Part Hematology Analyzer",
            price: 60954.6,
            quantity: 1,
            imageUrl: "http://example.com/blood.jpg",
        },
    });
    await prisma.equipment.create({
        data: {
            id: 5,
            name: "Patient Monitor",
            description: "Multi-Parameter Monitor",
            price: 19505.48,
            quantity: 1,
            imageUrl: "http://example.com/monitor.jpg",
        },
    });

    await prisma.$disconnect();
}

if (require.main === module) {
    seed().catch((e) => {
        console.error(e);
        process.exit(1);
    });
}

module.exports = { seed };
