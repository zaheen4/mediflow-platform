const express = require("express");
const bcrypt = require("bcrypt");
const { executeQuery } = require("../utils/db_utils");
const { generateToken, verifyToken } = require("../utils/auth_utils");
const { UnauthorizedError, ConflictError, NotFoundError, ValidationError } = require("../utils/errors");
const { validateUsername, validatePassword, validateEmail } = require("../utils/validation");
const { logAudit } = require("../utils/audit");

const router = express.Router();

// User Registration Route
router.post("/register", async (req, res) => {
    const { username, password, email } = req.body;

    validateUsername(username);
    validatePassword(password);
    validateEmail(email);

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = "INSERT INTO users (username, password, role, email) VALUES (?, ?, ?, ?)";
        await executeQuery(query, [username, hashedPassword, "User", email]);
        res.status(201).json({ message: "User registered successfully" });
        logAudit({ action: "register", entity_type: "user", details: { username } });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            throw new ConflictError("Username or email already exists");
        }
        throw error;
    }
});

// User Login Route
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const query = "SELECT * FROM users WHERE username = ? OR email = ?";
    const users = await executeQuery(query, [username, username]);

    if (users.length === 0) {
        throw new UnauthorizedError("Invalid username or password");
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
            email: user.email,
        });
        logAudit({ user_id: user.user_id, action: "login", details: { username: user.username } });
    } else {
        throw new UnauthorizedError("Invalid username or password");
    }
});

// Change Password Route
router.put("/change-password", verifyToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    validatePassword(newPassword);

    const userResult = await executeQuery("SELECT * FROM users WHERE user_id = ?", [req.user.user_id]);

    if (userResult.length === 0) {
        throw new NotFoundError("User not found");
    }

    const user = userResult[0];
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
        throw new UnauthorizedError("Current password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await executeQuery("UPDATE users SET password = ? WHERE user_id = ?", [hashedPassword, req.user.user_id]);

    res.status(200).json({ message: "Password changed successfully" });
});

// Get current user profile
router.get("/users/me", verifyToken, async (req, res) => {
    const users = await executeQuery("SELECT user_id, username, email, role FROM users WHERE user_id = ?", [
        req.user.user_id,
    ]);
    if (users.length === 0) {
        throw new NotFoundError("User not found");
    }
    res.json(users[0]);
});

// Update current user profile (username, email)
router.put("/users/me", verifyToken, async (req, res) => {
    const { username, email } = req.body;

    if (!username && !email) {
        throw new ValidationError("Nothing to update");
    }

    const current = await executeQuery("SELECT username, email FROM users WHERE user_id = ?", [req.user.user_id]);
    if (current.length === 0) {
        throw new NotFoundError("User not found");
    }

    const newUsername = username !== undefined ? username : current[0].username;
    const newEmail = email !== undefined ? email : current[0].email;

    validateUsername(newUsername);
    validateEmail(newEmail);

    try {
        await executeQuery("UPDATE users SET username = ?, email = ? WHERE user_id = ?", [
            newUsername,
            newEmail,
            req.user.user_id,
        ]);
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            throw new ConflictError("Username or email already exists");
        }
        throw error;
    }

    res.json({ message: "Profile updated", username: newUsername, email: newEmail });
});

module.exports = router;
