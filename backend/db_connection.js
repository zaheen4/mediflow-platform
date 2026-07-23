const mysql = require("mysql");

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error("Error connecting to database:", err.stack);
        return;
    }
    console.log("Connected to MySQL database");
    connection.release();
});

module.exports = pool;
