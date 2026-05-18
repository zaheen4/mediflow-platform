const getDbConnection = require('../db_connection');

function executeQuery(query, params) {
    const connection = getDbConnection();
    return new Promise((resolve, reject) => {
        connection.query(query, params, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
            connection.end();
        });
    });
}

module.exports = { executeQuery };
