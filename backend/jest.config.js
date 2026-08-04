module.exports = {
    testEnvironment: "node",
    setupFiles: ["./__tests__/jest.setup.js"],
    globalSetup: "./__tests__/globalSetup.js",
    globalTeardown: "./__tests__/globalTeardown.js",
    testPathIgnorePatterns: [
        "/node_modules/",
        "/__tests__/setup\\.js$",
        "/__tests__/jest\\.setup\\.js$",
        "/__tests__/globalSetup\\.js$",
        "/__tests__/globalTeardown\\.js$",
        "/__tests__/fixtures/",
        "/prisma/",
    ],
    collectCoverageFrom: [
        "app.js",
        "db_connection.js",
        "middleware/**/*.js",
        "routes/**/*.js",
        "utils/**/*.js",
        "!**/node_modules/**",
    ],
    coverageDirectory: "coverage",
    coverageThreshold: {
        global: {
            statements: 80,
            branches: 80,
            functions: 80,
            lines: 80,
        },
    },
    verbose: true,
};
