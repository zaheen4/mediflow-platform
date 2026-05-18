# Remove or Repurpose DummyPage

## Goal
`DummyPage` is a placeholder with no real functionality. Either remove it entirely from the codebase or repurpose it. This task covers removal.

## Files to Touch
- `src/routes/Route.jsx`
- `src/components/Dummy/DummyPage.jsx` (delete)
- `src/components/Dummy/` (delete directory)

## Steps

1. Open `src/routes/Route.jsx` and remove the dummy-page route entry:
```jsx
// Remove these lines:
{
    path: "/dummy-page",
    element: <DummyPage />,
},
```

2. Remove the import at the top:
```jsx
// Remove this line:
import DummyPage from "../components/Dummy/DummyPage";
```

3. Delete the DummyPage file and directory:
```sh
rm -rf src/components/Dummy/
```

4. Check `Services.jsx` — the service cards link to `/pages/dummypage.html`. These links are broken regardless. You can leave them for now (they'll be fixed in a later phase), but note that the DummyPage component itself is gone.

## Verification
- `/dummy-page` route should no longer exist (404 or redirect)
- `npm run dev` should start without errors
- The `Dummy/` directory should be gone
