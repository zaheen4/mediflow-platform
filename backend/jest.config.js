module.exports = {
    testEnvironment: "node",
    setupFiles: ["./__tests__/jest.setup.js"],
    globalSetup: "./__tests__/globalSetup.js",
    testPathIgnorePatterns: [
        "/node_modules/",
        "/__tests__/setup\\.js$",
        "/__tests__/jest\\.setup\\.js$",
        "/__tests__/globalSetup\\.js$",
        "/prisma/",
    ],
    verbose: true,
};
