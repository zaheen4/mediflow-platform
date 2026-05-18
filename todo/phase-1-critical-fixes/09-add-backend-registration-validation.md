# Add Backend Registration Validation

## Goal
Add input validation to the `/register` endpoint to prevent invalid data from reaching the database.

## Files to Touch
- `mediflow-backend/routes/auth_routes.js`

## Current State
The register route accepts any body and directly hashes + inserts:
```js
const { username, password, role, email } = req.body;
const hashedPassword = await bcrypt.hash(password, 10);
const query = "INSERT INTO users (username, password, role, email) VALUES (?, ?, ?, ?)";
```

No validation on:
- Username length or format
- Password strength
- Email format
- Role value (could be anything, not just "Admin"/"User")

## Steps

1. Open `mediflow-backend/routes/auth_routes.js`

2. Add validation logic before the database query. Replace the `/register` handler with:
```js
router.post('/register', async (req, res) => {
    const { username, password, role, email } = req.body;

    // Validation
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

    if (!role || !['Admin', 'User'].includes(role)) {
        return res.status(400).json({ error: "Role must be 'Admin' or 'User'" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = "INSERT INTO users (username, password, role, email) VALUES (?, ?, ?, ?)";
        await executeQuery(query, [username, hashedPassword, role, email]);
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: "Username or email already exists" });
        }
        res.status(500).json({ error: error.message });
    }
});
```

Key additions:
- Username: 3-50 characters
- Password: minimum 6 characters
- Email: regex validation
- Role: must be "Admin" or "User"
- Duplicate entry handling (ER_DUP_ENTRY) returns 409 Conflict instead of 500

## Verification
- Register with username "ab" → should get 400 error
- Register with password "123" → should get 400 error
- Register with email "notanemail" → should get 400 error
- Register with role "Moderator" → should get 400 error
- Register with existing username/email → should get 409 error
- Valid registration → should still work as before
