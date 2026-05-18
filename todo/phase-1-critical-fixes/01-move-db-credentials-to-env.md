# Move DB Credentials to .env

## Goal
Remove hardcoded MySQL credentials from `db_connection.js` and load them from environment variables via `.env`.

## Files to Touch
- `backend/db_connection.js`
- `backend/.env`

## Current State
`db_connection.js` has hardcoded values:
```js
host: "localhost",
user: "root",
password: "root",
database: "mediflowdb"
```

## Steps

1. Open `backend/.env` and add these variables:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=mediflowdb
SECRET_KEY=7637c4854c715f3a1a9470ea8535b0b2cce84c67e0025c76ebb90f09d297a6ce
```

2. Open `backend/db_connection.js` and replace the hardcoded values:
```js
const mysql = require('mysql');

function getDbConnection() {
    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
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
```

3. Open `backend/app.js` and confirm `require('dotenv').config()` is already at the top (it is).

## Verification
- Run `node backend/app.js` — server should start and connect to DB without errors
- The `.env` file is already in `.gitignore`, so credentials won't leak
