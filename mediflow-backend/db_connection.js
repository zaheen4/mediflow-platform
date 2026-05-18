const mysql = require('mysql');

function getDbConnection() {
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root", // Replace with your MySQL username
        password: "root", // Replace with your MySQL password
        database: "mediflowdb"
    });

    connection.connect(err => {
        if (err) {
            console.error('Error connecting to database:', err.stack);
            return;
        }
    });

    return connection;
}

module.exports = getDbConnection;
