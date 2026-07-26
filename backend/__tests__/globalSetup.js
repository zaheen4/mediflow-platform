require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const { execSync } = require("child_process");

module.exports = async function () {
    const testUrl = `mysql://${process.env.DB_USER || "root"}:${process.env.DB_PASSWORD || "root"}@${process.env.DB_HOST || "localhost"}:3306/mediflowdb_test`;
    execSync("npx prisma migrate reset --force", {
        cwd: require("path").join(__dirname, ".."),
        stdio: "inherit",
        env: { ...process.env, DATABASE_URL: testUrl, PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION: "Yes, proceed" },
    });
    execSync("node prisma/seed.test.js", {
        cwd: require("path").join(__dirname, ".."),
        stdio: "inherit",
        env: { ...process.env, DATABASE_URL: testUrl },
    });
};
