# Add Route Guards to Protected Pages

## Goal
Wrap user-only routes (`/buy-equipment`, `/cart`) with the `ProtectedRoute` component so unauthenticated users can't access them.

## Files to Touch
- `src/routes/Route.jsx`

## Current State
Routes are open — anyone can navigate to `/buy-equipment` or `/cart` without logging in.

## Steps

1. Open `src/routes/Route.jsx`

2. Add the import at the top:
```jsx
import ProtectedRoute from "../components/Context/ProtectedRoute";
```

3. Wrap the buy-equipment and cart route elements:
```jsx
{
    path: "/buy-equipment",
    element: (
        <ProtectedRoute>
            <BuyEquipment />
        </ProtectedRoute>
    ),
},
{
    path: "/cart",
    element: (
        <ProtectedRoute>
            <Cart />
        </ProtectedRoute>
    ),
},
```

The rest of the routes (home, login, register, about, services, dummy-page) remain unprotected.

## Verification
- Without logging in, navigating to `/buy-equipment` or `/cart` should redirect to `/login`
- After logging in as any user, those pages should be accessible
- Admin users should also be able to access these pages (they are not admin-only)
