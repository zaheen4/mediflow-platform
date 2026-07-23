require("dotenv").config();
const { recreateDatabase } = require("./setup");

module.exports = async function () {
    await recreateDatabase();
};
