# Consolidate or Remove style.css

## Goal
The project has both `frontend/src/index.css` (with Tailwind imports) and `frontend/src/style.css` (unused or redundant). Check if `style.css` is imported anywhere and either consolidate its contents or remove it.

## Files to Touch
- `frontend/src/style.css`
- `frontend/src/index.css`
- `frontend/src/main.jsx`

## Steps

1. Check if `style.css` is imported anywhere:
```sh
grep -r "style.css" src/
```

2. If it's NOT imported anywhere:
   - Delete the file:
   ```sh
   rm frontend/src/style.css
   ```

3. If it IS imported in `main.jsx` or elsewhere:
   - Read the contents of `frontend/src/style.css`
   - Move any custom styles into `frontend/src/index.css` (after the Tailwind imports)
   - Remove the `import './style.css'` line from wherever it's imported
   - Delete `frontend/src/style.css`

4. Ensure `frontend/src/index.css` contains only:
```css
@import "tailwindcss";
@plugin "daisyui";

/* Any custom styles from style.css go here */
```

## Verification
- `frontend/src/style.css` should no longer exist
- App should look identical to before
- `npm run dev` should start without CSS import errors
