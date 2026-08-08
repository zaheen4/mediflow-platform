const originalEnv = {};

function saveOriginalEnv(keys) {
    for (const key of keys) {
        originalEnv[key] = process.env[key];
    }
}

function restoreEnv() {
    for (const key of Object.keys(originalEnv)) {
        if (originalEnv[key] === undefined) {
            delete process.env[key];
        } else {
            process.env[key] = originalEnv[key];
        }
    }
}

function setValidEnv() {
    process.env.SECRET_KEY = "a".repeat(40);
    process.env.DB_HOST = "localhost";
    process.env.DB_USER = "root";
    process.env.DB_PASSWORD = "root";
    process.env.DB_NAME = "mediflowdb_test";
    process.env.DATABASE_URL = "mysql://root:root@localhost:3306/mediflowdb_test";
}

describe("config", () => {
    beforeAll(() => {
        saveOriginalEnv([
            "SECRET_KEY",
            "DB_HOST",
            "DB_USER",
            "DB_PASSWORD",
            "DB_NAME",
            "DATABASE_URL",
            "PORT",
            "CORS_ORIGINS",
            "JWT_EXPIRATION",
            "LOG_LEVEL",
            "NODE_ENV",
        ]);
    });

    afterEach(() => {
        restoreEnv();
        jest.resetModules();
    });

    it("loads a valid config with defaults", () => {
        setValidEnv();
        delete process.env.NODE_ENV;
        jest.resetModules();
        const config = require("../config/config");

        expect(config.port).toBe(5000);
        expect(config.corsOrigins).toEqual(["http://localhost:5173"]);
        expect(config.jwt.expiration).toBe("1h");
        expect(config.logLevel).toBe("info");
        expect(config.nodeEnv).toBe("development");
        expect(config.db).toEqual({
            host: "localhost",
            user: "root",
            password: "root",
            name: "mediflowdb_test",
            url: "mysql://root:root@localhost:3306/mediflowdb_test",
        });
    });

    it("throws listing every missing required var", () => {
        setValidEnv();
        process.env.SECRET_KEY = "";
        process.env.DB_NAME = "";
        jest.resetModules();

        expect(() => require("../config/config")).toThrow(/SECRET_KEY/);
        expect(() => require("../config/config")).toThrow(/DB_NAME/);
    });

    it("throws on invalid PORT", () => {
        setValidEnv();
        process.env.PORT = "abc";
        jest.resetModules();

        expect(() => require("../config/config")).toThrow(/Invalid PORT/);
    });

    it("throws on invalid LOG_LEVEL", () => {
        setValidEnv();
        process.env.LOG_LEVEL = "verbose";
        jest.resetModules();

        expect(() => require("../config/config")).toThrow(/Invalid LOG_LEVEL/);
    });

    it("throws on invalid NODE_ENV", () => {
        setValidEnv();
        process.env.NODE_ENV = "staging";
        jest.resetModules();

        expect(() => require("../config/config")).toThrow(/Invalid NODE_ENV/);
    });

    it("throws on short SECRET_KEY in production", () => {
        setValidEnv();
        process.env.SECRET_KEY = "short";
        process.env.NODE_ENV = "production";
        jest.resetModules();

        expect(() => require("../config/config")).toThrow(/at least 32 characters/);
    });

    it("parses CORS_ORIGINS into a trimmed list", () => {
        setValidEnv();
        process.env.CORS_ORIGINS = "http://a.example, http://b.example,http://c.example";
        process.env.PORT = "8080";
        process.env.JWT_EXPIRATION = "2h";
        process.env.LOG_LEVEL = "debug";
        jest.resetModules();
        const config = require("../config/config");

        expect(config.corsOrigins).toEqual(["http://a.example", "http://b.example", "http://c.example"]);
        expect(config.port).toBe(8080);
        expect(config.jwt.expiration).toBe("2h");
        expect(config.logLevel).toBe("debug");
    });

    it("isDevelopment reflects the current NODE_ENV", () => {
        setValidEnv();
        process.env.NODE_ENV = "production";
        jest.resetModules();
        const config = require("../config/config");

        expect(config.isDevelopment()).toBe(false);
        expect(config.isProduction()).toBe(true);

        process.env.NODE_ENV = "development";
        expect(config.isDevelopment()).toBe(true);
        expect(config.isProduction()).toBe(false);
    });
});
