require("dotenv").config();

const env = process.env;
const errors = [];

const REQUIRED_STRINGS = ["SECRET_KEY", "DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME", "DATABASE_URL"];
for (const key of REQUIRED_STRINGS) {
    if (!env[key] || !String(env[key]).trim()) {
        errors.push(`Missing required env var: ${key}`);
    }
}

const nodeEnv = env.NODE_ENV || "development";
if (!["development", "test", "production"].includes(nodeEnv)) {
    errors.push(`Invalid NODE_ENV: ${env.NODE_ENV}`);
}

let port = 5000;
if (env.PORT !== undefined) {
    port = Number(env.PORT);
    if (!Number.isInteger(port)) {
        errors.push(`Invalid PORT: ${env.PORT}`);
    }
}

const corsOrigins = env.CORS_ORIGINS
    ? env.CORS_ORIGINS.split(",")
          .map((origin) => origin.trim())
          .filter(Boolean)
    : ["http://localhost:5173"];

const logLevel = env.LOG_LEVEL || "info";
if (!["error", "warn", "info", "debug"].includes(logLevel)) {
    errors.push(`Invalid LOG_LEVEL: ${env.LOG_LEVEL}`);
}

if (nodeEnv === "production" && env.SECRET_KEY && env.SECRET_KEY.length < 32) {
    errors.push("SECRET_KEY must be at least 32 characters in production");
}

if (errors.length > 0) {
    throw new Error(`Invalid configuration:\n- ${errors.join("\n- ")}`);
}

const config = {
    nodeEnv,
    isDevelopment: () => (process.env.NODE_ENV || "development") === "development",
    isProduction: () => (process.env.NODE_ENV || "development") === "production",
    port,
    corsOrigins,
    jwt: {
        secretKey: env.SECRET_KEY,
        expiration: env.JWT_EXPIRATION || "1h",
    },
    db: {
        host: env.DB_HOST,
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        name: env.DB_NAME,
        url: env.DATABASE_URL,
    },
    logLevel,
};

module.exports = config;
