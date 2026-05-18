# Add Prettier Configuration

## Goal
Add Prettier for consistent code formatting across the project.

## Steps

1. Install Prettier and the ESLint plugin:
```sh
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier
```

2. Create `.prettierrc` in the project root:
```json
{
    "semi": true,
    "trailingComma": "es5",
    "singleQuote": false,
    "printWidth": 120,
    "tabWidth": 2,
    "useTabs": false,
    "bracketSpacing": true,
    "arrowParens": "always"
}
```

3. Create `.prettierignore` in the project root:
```
node_modules/
dist/
build/
package-lock.json
```

4. Update `eslint.config.js` to integrate Prettier. Add to the rules:
```js
import prettier from 'eslint-plugin-prettier';

// In the plugins section:
plugins: {
    react,
    'react-hooks': reactHooks,
    'react-refresh': reactRefresh,
    prettier,
},

// In the rules section, add:
'prettier/prettier': 'warn',
```

5. Add a format script to `package.json`:
```json
"scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "format": "prettier --write \"src/**/*.{js,jsx,css}\"",
    "preview": "vite preview"
}
```

6. Run the formatter:
```sh
npm run format
```

## Verification
- `npm run format` formats all source files
- `npm run lint` still passes (Prettier warnings may appear if there are conflicts)
- Code style is consistent across all files
