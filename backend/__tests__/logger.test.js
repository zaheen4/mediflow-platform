describe("logger", () => {
    afterEach(() => {
        jest.restoreAllMocks();
        delete process.env.LOG_LEVEL;
    });

    it("logs at all levels when LOG_LEVEL is debug", () => {
        process.env.LOG_LEVEL = "debug";
        jest.resetModules();
        const logger = require("../utils/logger");

        const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
        const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
        const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

        logger.info("hello", { a: 1 });
        logger.warn("careful", "text");
        logger.error("boom");
        logger.debug("trace");

        expect(logSpy.mock.calls.length).toBeGreaterThan(0);
        expect(warnSpy).toHaveBeenCalledTimes(1);
        expect(errorSpy).toHaveBeenCalledTimes(1);
        expect(logSpy.mock.calls[0][0]).toContain("[INFO] hello");
        expect(logSpy.mock.calls[0][0]).toContain('{"a":1}');
        expect(warnSpy.mock.calls[0][0]).toContain("[WARN] careful text");
        expect(errorSpy.mock.calls[0][0]).toContain("[ERROR] boom");
    });

    it("skips debug logs below the configured level", () => {
        jest.resetModules();
        const logger = require("../utils/logger");
        const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

        logger.debug("hidden");
        expect(logSpy).not.toHaveBeenCalled();

        logger.info("visible");
        expect(logSpy).toHaveBeenCalledTimes(1);
    });
});
