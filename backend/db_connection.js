const mysql = require("mysql2/promise");
const logger = require("./utils/logger");

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

(async () => {
    try {
        const conn = await pool.getConnection();
        logger.info("Connected to MySQL database");
        conn.release();
    } catch (err) {
        logger.error("Error connecting to database:", err.stack);
    }
})();

module.exports = pool;
