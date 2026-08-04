process.env.DB_NAME = "mediflowdb_test";
process.env.DATABASE_URL = `mysql://${process.env.DB_USER || "root"}:${process.env.DB_PASSWORD || "root"}@${process.env.DB_HOST || "localhost"}:3306/mediflowdb_test`;
