require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const mariadb = require("mariadb");

const TEST_DB = "mediflowdb_test";

module.exports = async function () {
    const pool = mariadb.createPool({
        host: process.env.DB_HOST || "localhost",
        port: 3306,
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "root",
        connectionLimit: 1,
    });
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.query(`DROP DATABASE IF EXISTS \`${TEST_DB}\``);
        console.log("globalTeardown: dropped test database");
    } catch (err) {
        console.error("globalTeardown: failed to drop test database:", err.message);
    } finally {
        if (conn) {
            conn.release();
        }
        await pool.end();
    }
};
