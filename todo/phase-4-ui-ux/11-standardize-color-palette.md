# Standardize Color Palette

## Goal
The codebase has hardcoded colors scattered throughout (`#ffcece`, `#ff7537`, `#fbce4b`, `#fc432d`, `#e5004b`). Define these as CSS custom variables or Tailwind theme colors for consistency.

## Files to Touch
- `src/index.css`
- `src/components/Equipment/BuyEquipment.jsx`
- `src/components/Home/Navbar.jsx`
- `src/components/Register/Register.jsx`
- `src/components/Login/Login.jsx`

## Steps

1. Open `src/index.css` and add custom color variables to the `@theme` block:

```css
@theme {
    --font-lato: "Lato", sans-serif;
    --color-mediflow-pink: #ffcece;
    --color-mediflow-orange: #ff7537;
    --color-mediflow-yellow: #fbce4b;
    --color-mediflow-red: #fc432d;
    --color-mediflow-crimson: #e5004b;
}
```

2. Update `BuyEquipment.jsx`:
```jsx
// Before:
<div className="card-body w-full bg-[#ffcece] rounded-md">

// After:
<div className="card-body w-full bg-mediflow-pink rounded-md">
```

3. Update `Navbar.jsx`:
```jsx
// Before:
<Link to="/login" className="btn btn-outline hover:bg-[#ff7537] hover:text-black hover:border-none mr-2 w-24">

// After:
<Link to="/login" className="btn btn-outline hover:bg-mediflow-orange hover:text-black hover:border-none mr-2 w-24">
```

```jsx
// Before:
<Link to="/register" className="btn btn-outline bg hover:bg-[#fbce4b] hover:text-black hover:border-none mr-2 w-24">

// After:
<Link to="/register" className="btn btn-outline bg hover:bg-mediflow-yellow hover:text-black hover:border-none mr-2 w-24">
```

4. Update `Register.jsx`:
```jsx
// Before:
<button className="w-full bg-[#fc432d] text-white p-2 rounded-md hover:bg-[#e5004b] shadow-">

// After:
<button className="w-full bg-mediflow-red text-white p-2 rounded-md hover:bg-mediflow-crimson shadow-">
```

5. Update `Login.jsx`:
```jsx
// Before:
<button type="submit" className="btn bg-[#ff7537] border-none hover:bg-[#c1006c] shadow-xl text-white w-20">

// After:
<button type="submit" className="btn bg-mediflow-orange border-none hover:bg-mediflow-crimson shadow-xl text-white w-20">
```

## Verification
- Colors should look identical to before
- All hardcoded hex values in components should be replaced with semantic class names
- Future color changes only need to be made in `index.css`
