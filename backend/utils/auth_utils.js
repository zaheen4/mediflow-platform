const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("./errors");
const config = require("../config/config");

function generateToken(user_id, role) {
    const payload = {
        user_id: user_id,
        role: role,
    };
    return jwt.sign(payload, config.jwt.secretKey, { expiresIn: config.jwt.expiration });
}

function verifyToken(req, res, next) {
    const token = req.headers.authorization;
    if (!token || !token.startsWith("Bearer ")) {
        throw new UnauthorizedError("No valid token provided");
    }

    try {
        const decodedToken = jwt.verify(token.split(" ")[1], config.jwt.secretKey);
        req.user = decodedToken;
        next();
    } catch {
        throw new UnauthorizedError("Invalid token");
    }
}

module.exports = { generateToken, verifyToken };
