const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

const TEST_DB = "mediflowdb_test";

async function recreateDatabase() {
    const pool = await mysql.createPool({
        connectionLimit: 1,
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "root",
    });

    await pool.query(`DROP DATABASE IF EXISTS \`${TEST_DB}\``);
    await pool.query(`CREATE DATABASE \`${TEST_DB}\``);
    await pool.end();

    const dataPool = await mysql.createPool({
        connectionLimit: 1,
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "root",
        database: TEST_DB,
        multipleStatements: true,
    });

    const sqlPath = path.join(__dirname, "..", "mediflowdb.sql");
    const sql = fs
        .readFileSync(sqlPath, "utf8")
        .replace(/CREATE DATABASE[^;]+;/gi, "")
        .replace(/USE\s+`?\w+`?;/gi, "");

    await dataPool.query(sql);
    await dataPool.end();
}

async function clearTables() {
    const pool = await mysql.createPool({
        connectionLimit: 1,
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "root",
        database: TEST_DB,
        multipleStatements: true,
    });

    await pool.query(
        `SET FOREIGN_KEY_CHECKS = 0;
         TRUNCATE TABLE cart_items;
         TRUNCATE TABLE order_items;
         TRUNCATE TABLE orders;
         TRUNCATE TABLE equipment;
         TRUNCATE TABLE categories;
         TRUNCATE TABLE users;
         SET FOREIGN_KEY_CHECKS = 1;
             INSERT INTO categories (category_id, name, description)
             VALUES
               (1, 'Protective Equipment', 'PPE'),
               (2, 'Diagnostic Equipment', 'Diagnostics');
             INSERT INTO equipment (equipment_id, name, description, price, quantity, image_url, category_id)
             VALUES
               (1, 'PPE Kit', 'Disposable PPE Coverall', 109.72, 3400, 'http://example.com/ppe.jpg', 1),
               (2, 'X-Ray Machine', 'Medical X-Ray System', 1218972.10, 1, 'http://example.com/xray.jpg', 2),
               (3, 'Surgical Kit', 'Basic Surgical Instrument Set', 242599.94, 5, 'http://example.com/surgical.jpg', NULL),
               (4, 'Blood Analyzer', 'Auto 5 Part Hematology Analyzer', 60954.60, 1, 'http://example.com/blood.jpg', NULL),
               (5, 'Patient Monitor', 'Multi-Parameter Monitor', 19505.48, 1, 'http://example.com/monitor.jpg', NULL);`
    );

    await pool.end();
}

async function promoteAdmin(username) {
    const pool = await mysql.createPool({
        connectionLimit: 1,
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "root",
        database: TEST_DB,
    });

    await pool.query("UPDATE users SET role = 'Admin' WHERE username = ?", [username]);
    await pool.end();
}

module.exports = { recreateDatabase, clearTables, promoteAdmin, TEST_DB };
