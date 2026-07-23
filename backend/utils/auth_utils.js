const jwt = require("jsonwebtoken");

function generateToken(user_id, role) {
    const payload = {
        user_id: user_id,
        role: role,
    };
    return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: process.env.JWT_EXPIRATION || "1h" });
}

function verifyToken(req, res, next) {
    const token = req.headers.authorization;
    if (!token || !token.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No valid token provided" });
    }

    try {
        const decodedToken = jwt.verify(token.split(" ")[1], process.env.SECRET_KEY);
        req.user = decodedToken;
        next();
    } catch {
        return res.status(401).json({ error: "Invalid token" });
    }
}

module.exports = { generateToken, verifyToken };
