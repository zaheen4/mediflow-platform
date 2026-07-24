const { ForbiddenError } = require("../utils/errors");

function requireAdmin(req, res, next) {
    if (!req.user || req.user.role !== "Admin") {
        throw new ForbiddenError("Access denied. Admin privileges required.");
    }
    next();
}

module.exports = { requireAdmin };
