const pool = require("../db_connection");

function executeQuery(query, params) {
    return new Promise((resolve, reject) => {
        pool.query(query, params, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}

function getConnection() {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) return reject(err);
            resolve(connection);
        });
    });
}

function queryWithConnection(connection, query, params) {
    return new Promise((resolve, reject) => {
        connection.query(query, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
}

async function beginTransaction() {
    const connection = await getConnection();
    return new Promise((resolve, reject) => {
        connection.beginTransaction((err) => {
            if (err) {
                connection.release();
                return reject(err);
            }
            resolve(connection);
        });
    });
}

async function commitTransaction(connection) {
    await new Promise((resolve, reject) => {
        connection.commit((err) => {
            if (err) return reject(err);
            resolve();
        });
    });
    connection.release();
}

async function rollbackTransaction(connection) {
    return new Promise((resolve) => {
        connection.rollback(() => {
            connection.release();
            resolve();
        });
    });
}

module.exports = {
    executeQuery,
    beginTransaction,
    queryWithConnection,
    commitTransaction,
    rollbackTransaction,
};
