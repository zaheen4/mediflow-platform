# Fix Font Configuration

## Goal
The Lato font is configured in `vite.config.js` but commented out in `index.css`. Either enable it properly or remove the unused config.

## Files to Touch
- `src/index.css`
- `vite.config.js`

## Current State

**index.css** has the font import commented out:
```css
/* @import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap'); */
```

**vite.config.js** has a theme config that doesn't work with Tailwind v4:
```js
theme: {
    extend: {
        fontFamily: {
            lato: ["Lato", "sans-serif"],
        },
    },
},
```

## Steps

1. Open `src/index.css` and uncomment the font import:
```css
@import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap');
@import "tailwindcss";
@plugin "daisyui";
```

2. Open `vite.config.js` and remove the `theme` block (Tailwind v4 handles font configuration differently — via CSS):

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
})
```

3. Add the font family to `index.css` using Tailwind v4's `@theme` directive:

```css
@import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap');
@import "tailwindcss";
@plugin "daisyui";

@theme {
    --font-lato: "Lato", sans-serif;
}
```

4. To use the font, apply `font-lato` class anywhere, or set it as the default in `index.css`:

```css
@layer base {
    body {
        font-family: var(--font-lato);
    }
}
```

## Verification
- App should load the Lato font from Google Fonts
- All text should render in Lato by default
- `vite.config.js` should be clean of Tailwind theme config
- No console errors about missing fonts
