# Enable jsx-no-target-blank ESLint Rule

## Goal
The ESLint config has `'react/jsx-no-target-blank': 'off'`. Re-enable this rule and fix any violations. This rule ensures that links with `target="_blank"` have `rel="noopener noreferrer"` for security.

## Files to Touch
- `eslint.config.js`
- Any component with `target="_blank"` links (likely `Footer.jsx`, `Services.jsx`)

## Steps

1. Open `eslint.config.js` and change:
```js
// Before:
'react/jsx-no-target-blank': 'off',

// After:
'react/jsx-no-target-blank': 'warn',
```

2. Run the linter to find violations:
```sh
npm run lint
```

3. Fix each violation by adding `rel="noopener noreferrer"` to links with `target="_blank"`.

For example, in `Footer.jsx`:
```jsx
// Before:
<a target="_blank">
    <img src={twitter_icon} alt="twitter" />
</a>

// After:
<a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
    <img src={twitter_icon} alt="twitter" />
</a>
```

Also add actual `href` values — the current social links have `target="_blank"` but no `href`, which is also a problem.

4. Re-run `npm run lint` until no warnings for this rule.

## Verification
- All `target="_blank"` links have `rel="noopener noreferrer"`
- All `target="_blank"` links have valid `href` attributes
- ESLint shows no warnings for `jsx-no-target-blank`
