const express = require('express');
const bcrypt = require('bcrypt');
const { executeQuery } = require('../utils/db_utils');
const { generateToken } = require('../utils/auth_utils');

const router = express.Router();

// User Registration Route
router.post('/register', async (req, res) => {
    const { username, password, role, email } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = "INSERT INTO users (username, password, role, email) VALUES (?, ?, ?, ?)";
        await executeQuery(query, [username, hashedPassword, role, email]);
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// User Login Route
router.post('/login', async (req, res) => {
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
            res.status(200).json({ message: "Login successful", token: token, role: user.role, username: user.username });
        } else {
            res.status(401).json({ error: "Invalid username or password" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
