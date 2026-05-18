# Run and Fix ESLint

## Goal
Run `npm run lint` on the frontend, identify all warnings and errors, and fix them.

## Steps

1. Run the linter:
```sh
npm run lint
```

2. Review the output. Common issues to expect:
   - `react/jsx-no-target-blank` — currently disabled in config, but links with `target="_blank"` should have `rel="noopener noreferrer"`
   - Unused variables or imports
   - Missing `key` props in list renders
   - `react/prop-types` — if PropTypes are expected

3. Fix issues file by file. For each error:
   - If it's an unused import → remove it
   - If it's a missing `rel` on `target="_blank"` → add `rel="noopener noreferrer"`
   - If it's a missing `key` → ensure all `.map()` calls have a proper `key` prop

4. Re-run `npm run lint` until there are zero errors. Warnings are acceptable but should be minimized.

5. If there are too many autofixable issues, try:
```sh
npx eslint --fix src/
```

## Verification
- `npm run lint` exits with code 0 (no errors)
- App still functions normally after changes
