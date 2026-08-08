const levels = { error: 0, warn: 1, info: 2, debug: 3 };

const { logLevel } = require("../config/config");

const currentLevel = levels[logLevel] !== undefined ? levels[logLevel] : levels.info;

function formatMessage(level, message, data) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    if (data !== undefined) {
        return `${prefix} ${message} ${typeof data === "object" ? JSON.stringify(data) : data}`;
    }
    return `${prefix} ${message}`;
}

const logger = {
    info(message, data) {
        if (currentLevel >= levels.info) {
            console.log(formatMessage("info", message, data));
        }
    },
    warn(message, data) {
        if (currentLevel >= levels.warn) {
            console.warn(formatMessage("warn", message, data));
        }
    },
    error(message, data) {
        if (currentLevel >= levels.error) {
            console.error(formatMessage("error", message, data));
        }
    },
    debug(message, data) {
        if (currentLevel >= levels.debug) {
            console.log(formatMessage("debug", message, data));
        }
    },
};

module.exports = logger;
