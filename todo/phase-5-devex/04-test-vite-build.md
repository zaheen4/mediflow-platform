# Test Vite Build

## Goal
Ensure `npm run build` produces a working production build without errors.

## Steps

1. Run the build:
```sh
npm run build
```

2. Check for errors in the output. Common issues:
   - Unused imports that cause build warnings
   - Missing environment variables
   - Asset import errors

3. Preview the production build:
```sh
npm run preview
```

4. Open `http://localhost:4173` in the browser and verify:
   - Home page loads
   - Navigation works
   - Login/Register pages render
   - No console errors

5. Check the `dist/` folder was created and contains:
   - `index.html`
   - `assets/` folder with bundled JS and CSS

6. If there are errors, fix them and rebuild.

## Verification
- `npm run build` completes with no errors
- `npm run preview` serves a working app
- All routes are accessible in the preview
