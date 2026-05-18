# Add Cart Action Toasts

## Goal
Show toast notifications when items are added to or removed from the cart.

## Files to Touch
- `src/components/Context/CartContext.jsx`

## Steps

1. Open `src/components/Context/CartContext.jsx`

2. Add toast import:
```jsx
import { toast } from "react-toastify";
```

3. Update `addToCart` to show a toast:

```jsx
const addToCart = (equip) => {
    setCart((prevCart) => {
        const itemIndex = prevCart.findIndex(
            (item) => item.equipment_id === equip.equipment_id
        );

        if (itemIndex !== -1) {
            const updatedCart = [...prevCart];
            updatedCart[itemIndex].quantity += 1;
            toast.info(`${equip.name} quantity updated in cart`, {
                position: "bottom-right",
                autoClose: 2000,
                theme: "light",
            });
            return updatedCart;
        } else {
            toast.success(`${equip.name} added to cart`, {
                position: "bottom-right",
                autoClose: 2000,
                theme: "light",
            });
            return [...prevCart, { ...equip, quantity: 1 }];
        }
    });
};
```

4. Update `removeFromCart` to show a toast:

```jsx
const removeFromCart = (id, itemName) => {
    setCart((prevCart) => {
        const item = prevCart.find((item) => item.equipment_id === id);
        if (item) {
            toast.info(`${item.name} removed from cart`, {
                position: "bottom-right",
                autoClose: 2000,
                theme: "light",
            });
        }
        return prevCart.filter((item) => item.equipment_id !== id);
    });
};
```

Note: The `removeFromCart` signature changed to accept an optional `itemName`. Update the call in `Cart.jsx`:

```jsx
// In Cart.jsx, change:
onClick={() => removeFromCart(item.equipment_id)}

// To:
onClick={() => removeFromCart(item.equipment_id, item.name)}
```

## Verification
- Add new item → "Item name added to cart" toast (bottom-right, green)
- Add existing item → "Item name quantity updated in cart" toast (bottom-right, blue)
- Remove item → "Item name removed from cart" toast (bottom-right, blue)
- Toasts auto-dismiss after 2 seconds
- Toasts appear at bottom-right so they don't overlap with header toasts
