const mysql = require("mysql2/promise");
const logger = require("./utils/logger");
const config = require("./config/config");

const pool = mysql.createPool({
    connectionLimit: 10,
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.name,
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
