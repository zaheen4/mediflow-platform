# Add Cart Badge to Navbar

## Goal
Add a visible cart item count badge to the Navbar so users can see how many items are in their cart from any page.

## Files to Touch
- `src/components/Home/Navbar.jsx`

## Steps

1. Open `src/components/Home/Navbar.jsx`

2. Add imports at the top:
```jsx
import { useContext } from "react";
import { CartContext } from "../Context/CartContext";
import { FaCartShopping } from "react-icons/fa6";
```

3. Inside the `Navbar` component, get cart context:
```jsx
const { getTotalItems } = useContext(CartContext);
```

4. Add the cart button in the navbar end section, before the user/login buttons. Find the `<div className="navbar-end">` section and add:

```jsx
<div className="navbar-end">
    {/* Cart Button */}
    {user && (
        <Link to="/cart" className="btn btn-ghost btn-circle mr-2 relative">
            <FaCartShopping className="text-xl" />
            {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getTotalItems()}
                </span>
            )}
        </Link>
    )}

    {/* ... existing user/login buttons ... */}
```

5. Remove the unused `FaCartShopping` import if it was already there (check the top of the file).

## Verification
- Logged-in users should see a cart icon in the navbar
- The badge number should update in real-time when items are added
- Badge should not appear when cart is empty
- Non-logged-in users should not see the cart icon
