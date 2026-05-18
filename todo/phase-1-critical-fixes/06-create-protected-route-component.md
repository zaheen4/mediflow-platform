# Create ProtectedRoute Component

## Goal
Create a reusable React component that wraps routes and checks authentication before rendering. Unauthenticated users get redirected to `/login`.

## Files to Create
- `frontend/src/context/ProtectedRoute.jsx`

## Steps

1. Create `frontend/src/context/ProtectedRoute.jsx`:
```jsx
import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user } = useContext(AuthContext);
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (adminOnly && user.role !== "Admin") {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
```

This component:
- Accepts `children` (the page component to protect)
- Accepts optional `adminOnly` prop for admin-exclusive routes
- Redirects to `/login` if no user, preserving the intended destination in `location.state.from`
- Redirects to `/` if non-admin tries to access admin route

## Verification
- The file should exist at `frontend/src/context/ProtectedRoute.jsx`
- No runtime errors when the app loads (the component won't be used yet — that's the next task)
