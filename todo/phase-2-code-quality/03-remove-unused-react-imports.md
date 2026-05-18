# Remove Unused React Imports

## Goal
Remove `import React from "react"` from files that don't actually use the `React` variable directly. In modern React (17+) with JSX transform, this import is no longer needed unless you use `React.something` (like `React.useState`, `React.useEffect`, etc.).

## Files to Touch
- `src/components/About/About.jsx`
- `src/components/About/Services.jsx`
- `src/components/Equipment/BuyEquipment.jsx`
- `src/components/Equipment/AdminPage.jsx`
- `src/components/Cart/Cart.jsx`

## Steps

For each file below, remove the line `import React from "react"` or `import React, { ... } from "react"` and keep only the specific hooks you need.

1. **About.jsx** — Remove `import React from "react";` entirely (no hooks used)

2. **Services.jsx** — Remove `import React from "react";` entirely (no hooks used)

3. **BuyEquipment.jsx** — Change:
```jsx
// Before:
import React, { useState, useEffect } from 'react';

// After:
import { useState, useEffect } from 'react';
```

4. **AdminPage.jsx** — Change:
```jsx
// Before:
import React, { useState, useEffect } from "react";

// After:
import { useState, useEffect } from "react";
```

5. **Cart.jsx** — Change:
```jsx
// Before:
import React, { useState, useEffect } from 'react';

// After:
import { useState, useEffect } from 'react';
```

## Verification
- Run `npm run lint` — no errors related to these files
- App should render identically to before
