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

module.exports = { executeQuery };
