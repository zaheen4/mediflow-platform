# Implement Database Connection Pool

## Goal
Replace the per-query connection creation pattern with a MySQL connection pool. Currently, every `executeQuery` call creates a new connection and closes it, which is inefficient and can exhaust database resources under load.

## Files to Touch
- `mediflow-backend/db_connection.js`
- `mediflow-backend/utils/db_utils.js`

## Current State

**db_connection.js** creates a single connection:
```js
function getDbConnection() {
    const connection = mysql.createConnection({...});
    return connection;
}
```

**db_utils.js** opens and closes a connection per query:
```js
function executeQuery(query, params) {
    const connection = getDbConnection();
    return new Promise((resolve, reject) => {
        connection.query(query, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
            connection.end();
        });
    });
}
```

## Steps

1. Replace `mediflow-backend/db_connection.js` with:
```js
const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to database:', err.stack);
        return;
    }
    console.log('Connected to MySQL database');
    connection.release();
});

module.exports = pool;
```

2. Replace `mediflow-backend/utils/db_utils.js` with:
```js
const pool = require('../db_connection');

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

module.exports = { executeQuery };
```

Key changes:
- `createPool` instead of `createConnection`
- No more `connection.end()` — the pool manages connections automatically
- `connectionLimit: 10` means max 10 simultaneous connections

## Verification
- Run `node mediflow-backend/app.js` — you should see "Connected to MySQL database"
- Test login, register, and equipment endpoints — all should work as before
- Under load, connections will be reused instead of created/destroyed each time
