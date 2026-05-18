# Rename Regsiter.jsx to Register.jsx

## Goal
Fix the typo in the filename `Regsiter.jsx` → `Register.jsx` and update the import in `Route.jsx`.

## Files to Touch
- `frontend/src/pages/Register/Regsiter.jsx` (rename)
- `frontend/frontend/src/routes/router.jsx` (update import)

## Steps

1. Rename the file:
```sh
mv frontend/src/pages/Register/Regsiter.jsx frontend/src/pages/Register/Register.jsx
```

2. Open `frontend/frontend/src/routes/router.jsx` and change the import:
```jsx
// Before:
import Register from "../components/Register/Regsiter";

// After:
import Register from "../components/Register/Register";
```

## Verification
- The old filename should no longer exist
- `npm run dev` should start without import errors
- The `/register` route should work as before
