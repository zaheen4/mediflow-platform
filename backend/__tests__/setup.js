const mysql = require("mysql");
const fs = require("fs");
const path = require("path");

const TEST_DB = "mediflowdb_test";

function createAdminPool() {
    return mysql.createPool({
        connectionLimit: 1,
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "root",
    });
}

async function recreateDatabase() {
    const pool = createAdminPool();

    await new Promise((resolve, reject) => {
        pool.query(`DROP DATABASE IF EXISTS \`${TEST_DB}\``, (err) => {
            if (err) return reject(err);
            resolve();
        });
    });

    await new Promise((resolve, reject) => {
        pool.query(`CREATE DATABASE \`${TEST_DB}\``, (err) => {
            if (err) return reject(err);
            resolve();
        });
    });

    pool.end();

    const dataPool = mysql.createPool({
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

    await new Promise((resolve, reject) => {
        dataPool.query(sql, (err) => {
            if (err) return reject(err);
            resolve();
        });
    });

    dataPool.end();
}

async function clearTables() {
    const pool = mysql.createPool({
        connectionLimit: 1,
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "root",
        database: TEST_DB,
        multipleStatements: true,
    });

    await new Promise((resolve, reject) => {
        pool.query(
            `SET FOREIGN_KEY_CHECKS = 0;
             TRUNCATE TABLE cart_items;
             TRUNCATE TABLE order_items;
             TRUNCATE TABLE orders;
             TRUNCATE TABLE equipment;
             TRUNCATE TABLE categories;
             TRUNCATE TABLE users;
             TRUNCATE TABLE orders;
             TRUNCATE TABLE order_items;
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
               (5, 'Patient Monitor', 'Multi-Parameter Monitor', 19505.48, 1, 'http://example.com/monitor.jpg', NULL);`,
            (err) => {
                if (err) return reject(err);
                resolve();
            }
        );
    });

    pool.end();
}

async function promoteAdmin(username) {
    const pool = mysql.createPool({
        connectionLimit: 1,
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "root",
        database: TEST_DB,
    });

    await new Promise((resolve, reject) => {
        pool.query("UPDATE users SET role = 'Admin' WHERE username = ?", [username], (err) => {
            if (err) return reject(err);
            resolve();
        });
    });

    pool.end();
}

module.exports = { recreateDatabase, clearTables, promoteAdmin, TEST_DB };
