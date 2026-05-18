# Add Login Success Toast

## Goal
Show a success toast when a user logs in successfully, matching the pattern used in registration.

## Files to Touch
- `frontend/src/pages/Login/Login.jsx`

## Steps

1. Open `frontend/src/pages/Login/Login.jsx`

2. Add toast imports if not already present:
```jsx
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
```

3. Add a success toast inside the `handleLogin` function, after `login(data)`:

```jsx
if (response.ok) {
    login(data); // Store user info in AuthContext

    toast.success(`Welcome back, ${data.username}!`, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        theme: "light",
    });

    // Redirect based on user role
    if (data.role === "Admin") {
        navigate("/");
    } else if (data.role === "User") {
        navigate("/");
    } else {
        navigate("/"); // Default redirection
    }
}
```

4. Ensure `<ToastContainer>` is in the JSX. Add it at the end of the return, before the closing `</div>`:

```jsx
<ToastContainer
    position="top-center"
    autoClose={3000}
    hideProgressBar={false}
    closeOnClick={false}
    pauseOnHover={false}
    draggable={false}
    theme="light"
/>
```

## Verification
- Successful login → toast appears with "Welcome back, {username}!"
- Toast auto-dismisses after 3 seconds
- Failed login → no success toast, error message still shows
