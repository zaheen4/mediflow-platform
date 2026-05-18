# Create CartContext

## Goal
Create a React Context to manage cart state globally, replacing the duplicated localStorage-based cart logic in `BuyEquipment.jsx` and `Cart.jsx`.

## Files to Create
- `src/components/Context/CartContext.jsx`

## Steps

1. Create `src/components/Context/CartContext.jsx`:

```jsx
import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [cart, setCart] = useState(() => {
        const storedCart = localStorage.getItem("cart");
        return storedCart ? JSON.parse(storedCart) : [];
    });

    // Persist cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    // Clear cart on logout
    useEffect(() => {
        if (!user) {
            setCart([]);
            localStorage.removeItem("cart");
        }
    }, [user]);

    const addToCart = (equip) => {
        setCart((prevCart) => {
            const itemIndex = prevCart.findIndex(
                (item) => item.equipment_id === equip.equipment_id
            );

            if (itemIndex !== -1) {
                const updatedCart = [...prevCart];
                updatedCart[itemIndex].quantity += 1;
                return updatedCart;
            } else {
                return [...prevCart, { ...equip, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (id) => {
        setCart((prevCart) => prevCart.filter((item) => item.equipment_id !== id));
    };

    const updateQuantity = (id, newQuantity) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.equipment_id === id
                    ? { ...item, quantity: Math.max(1, newQuantity) }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem("cart");
    };

    const getTotalItems = () => {
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    };

    const getTotalPrice = () => {
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getTotalItems,
                getTotalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;
```

2. Wrap the app with `CartProvider` in `src/main.jsx`:
```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router-dom";
import { router } from './routes/Route';
import AuthProvider from './components/Context/AuthContext';
import CartProvider from './components/Context/CartContext';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <CartProvider>
                <RouterProvider router={router} />
            </CartProvider>
        </AuthProvider>
    </StrictMode>,
)
```

## Verification
- App should load without errors
- Cart state is now centralized — no functional change yet (migration is next task)
- Cart clears automatically when user logs out
