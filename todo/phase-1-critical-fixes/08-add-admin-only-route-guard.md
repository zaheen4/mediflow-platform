# Add Admin-Only Route Guard

## Goal
Wrap `/admin-dashboard` with `ProtectedRoute` using the `adminOnly` prop so only Admin users can access it.

## Files to Touch
- `frontend/frontend/src/routes/router.jsx`

## Steps

1. Open `frontend/frontend/src/routes/router.jsx` (you already imported `ProtectedRoute` from the previous task)

2. Wrap the admin-dashboard route element:
```jsx
{
    path: "/admin-dashboard",
    element: (
        <ProtectedRoute adminOnly>
            <AdminPage />
        </ProtectedRoute>
    ),
},
```

## Verification
- Unauthenticated users navigating to `/admin-dashboard` → redirected to `/login`
- Regular "User" role navigating to `/admin-dashboard` → redirected to `/`
- "Admin" role navigating to `/admin-dashboard` → page renders normally
