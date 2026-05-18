# Standardize API Calls to Axios

## Goal
The codebase uses both `fetch` (in Login.jsx) and `axios` (everywhere else) for HTTP requests. Standardize everything to `axios` for consistency.

## Files to Touch
- `frontend/src/pages/Login/Login.jsx`

## Current State
Login.jsx uses `fetch`:
```jsx
const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
});
const data = await response.json();
if (response.ok) { ... }
```

Every other component uses `axios`.

## Steps

1. Open `frontend/src/pages/Login/Login.jsx`

2. Add the axios import at the top:
```jsx
import axios from "axios";
```

3. Replace the `handleLogin` function body:
```jsx
const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, {
            username,
            password,
        });

        const data = response.data;
        login(data); // Store user info in AuthContext

        // Redirect based on user role
        if (data.role === "Admin") {
            navigate("/");
        } else if (data.role === "User") {
            navigate("/");
        } else {
            navigate("/"); // Default redirection
        }
    } catch (error) {
        if (error.response) {
            setError(error.response.data.error || "Login failed");
        } else {
            setError("Network error");
        }
    }
};
```

Key differences with axios:
- No need to manually set `Content-Type` header (axios does it automatically)
- No need to call `.json()` on response
- `response.ok` check is replaced by axios's automatic error throwing — errors go to `catch`
- Error data is in `error.response.data` instead of parsing manually

4. Remove the `API_BASE_URL` variable if it's no longer needed elsewhere in the file (it's still used, so keep it).

## Verification
- Login should work exactly as before
- Invalid credentials should show error message
- Network errors should show "Network error"
