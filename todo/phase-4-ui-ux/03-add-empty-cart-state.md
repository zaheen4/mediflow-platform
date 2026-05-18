# Add Empty Cart State

## Goal
When the cart is empty, show a friendly message with a link to the shop instead of a blank page.

## Files to Touch
- `frontend/src/pages/Cart/Cart.jsx`

## Steps

1. Open `frontend/src/pages/Cart/Cart.jsx`

2. Add `Link` import:
```jsx
import { Link, useNavigate } from 'react-router-dom';
```

3. Add an empty state before the cart items grid. After the `<h2>` heading and before the grid div:

```jsx
<div className="container mx-auto p-6 min-h-screen">
    <h2 className="text-3xl font-bold text-center mb-3">Shopping Cart</h2>

    {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-xl text-gray-500 mb-4">Your cart is empty</p>
            <Link to="/buy-equipment" className="btn btn-primary">
                Browse Equipment
            </Link>
        </div>
    ) : (
        <>
            <div className="grid grid-cols-1 gap-6 w-[85%] mx-auto">
                {/* ... existing cart items ... */}
            </div>

            {/* ... existing checkout button ... */}
        </>
    )}
</div>
```

## Verification
- Empty cart → shows cart icon, "Your cart is empty" message, and "Browse Equipment" button
- "Browse Equipment" button navigates to `/buy-equipment`
- Cart with items → renders normally as before
