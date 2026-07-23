const mysql = require("mysql");
const logger = require("./utils/logger");

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

pool.getConnection((err, connection) => {
    if (err) {
        logger.error("Error connecting to database:", err.stack);
        return;
    }
    logger.info("Connected to MySQL database");
    connection.release();
});

module.exports = pool;
