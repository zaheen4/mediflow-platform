const express = require("express");
const bcrypt = require("bcrypt");
const { executeQuery } = require("../utils/db_utils");
const { generateToken } = require("../utils/auth_utils");

const { verifyToken } = require("../utils/auth_utils");

const router = express.Router();

// User Registration Route
router.post("/register", async (req, res) => {
    const { username, password, email } = req.body;

    if (!username || username.length < 3 || username.length > 50) {
        return res.status(400).json({ error: "Username must be between 3 and 50 characters" });
    }

    if (!password || password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = "INSERT INTO users (username, password, role, email) VALUES (?, ?, ?, ?)";
        await executeQuery(query, [username, hashedPassword, "User", email]);
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ error: "Username or email already exists" });
        }
        res.status(500).json({ error: error.message });
    }
});

// User Login Route
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const query = "SELECT * FROM users WHERE username = ? OR email = ?";
        const users = await executeQuery(query, [username, username]);

        if (users.length === 0) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const user = users[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            const token = generateToken(user.user_id, user.role);
            res.status(200).json({
                message: "Login successful",
                token: token,
                role: user.role,
                username: user.username,
            });
        } else {
            res.status(401).json({ error: "Invalid username or password" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

// Change Password Route
router.put("/change-password", verifyToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ error: "New password must be at least 6 characters" });
    }

    try {
        const userResult = await executeQuery("SELECT * FROM users WHERE user_id = ?", [req.user.user_id]);

        if (userResult.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const user = userResult[0];
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Current password is incorrect" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await executeQuery("UPDATE users SET password = ? WHERE user_id = ?", [hashedPassword, req.user.user_id]);

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
