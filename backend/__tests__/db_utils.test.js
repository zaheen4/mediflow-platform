const {
    executeQuery,
    beginTransaction,
    queryWithConnection,
    commitTransaction,
    rollbackTransaction,
} = require("../utils/db_utils");
const { clearTables } = require("./setup");
const pool = require("../db_connection");

beforeAll(async () => {
    await clearTables();
});

afterAll(async () => {
    await clearTables();
    await pool.end();
});

describe("executeQuery", () => {
    it("returns rows for a select", async () => {
        const rows = await executeQuery("SELECT 1 AS one");
        expect(rows[0].one).toBe(1);
    });

    it("supports parameters", async () => {
        const rows = await executeQuery("SELECT ? AS val", ["hello"]);
        expect(rows[0].val).toBe("hello");
    });
});

describe("queryWithConnection", () => {
    it("runs a query on an existing connection", async () => {
        const connection = await beginTransaction();
        const rows = await queryWithConnection(connection, "SELECT 2 AS two");
        expect(rows[0].two).toBe(2);
        await rollbackTransaction(connection);
    });
});

describe("transactions", () => {
    it("commits inserted rows", async () => {
        const connection = await beginTransaction();
        await queryWithConnection(connection, "INSERT INTO categories (name) VALUES (?)", ["tx-commit"]);
        await commitTransaction(connection);

        const rows = await executeQuery("SELECT * FROM categories WHERE name = ?", ["tx-commit"]);
        expect(rows.length).toBe(1);
    });

    it("rolls back inserted rows", async () => {
        const connection = await beginTransaction();
        await queryWithConnection(connection, "INSERT INTO categories (name) VALUES (?)", ["tx-rollback"]);
        await rollbackTransaction(connection);

        const rows = await executeQuery("SELECT * FROM categories WHERE name = ?", ["tx-rollback"]);
        expect(rows.length).toBe(0);
    });
});
