const pool = require("../db_connection");

async function executeQuery(query, params) {
    const [results] = await pool.query(query, params);
    return results;
}

async function getConnection() {
    return await pool.getConnection();
}

async function queryWithConnection(connection, query, params) {
    const [results] = await connection.query(query, params);
    return results;
}

async function beginTransaction() {
    const connection = await getConnection();
    await connection.beginTransaction();
    return connection;
}

async function commitTransaction(connection) {
    await connection.commit();
    connection.release();
}

async function rollbackTransaction(connection) {
    await connection.rollback();
    connection.release();
}

module.exports = {
    executeQuery,
    beginTransaction,
    queryWithConnection,
    commitTransaction,
    rollbackTransaction,
};
