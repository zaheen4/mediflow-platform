# Implement Checkout with Order Persistence

## Goal
Replace the current `alert()`-based checkout in `Cart.jsx` with a real API call that saves the order to the database.

## Files to Touch
- `frontend/src/pages/Cart/Cart.jsx`

## Current State
```jsx
const handleCheckout = () => {
    setCart([]);
    localStorage.removeItem("cart");
    alert("Checkout successful! Your cart has been cleared.");
};
```

## Steps

1. Open `frontend/src/pages/Cart/Cart.jsx`

2. Add imports:
```jsx
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../Context/AuthContext";
```

3. Add context access inside the component:
```jsx
const { user } = useContext(AuthContext);
const { cart, clearCart, getTotalPrice } = useContext(CartContext);
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
```

4. Replace `handleCheckout` with:
```jsx
const handleCheckout = async () => {
    if (cart.length === 0) {
        toast.warn("Your cart is empty!");
        return;
    }

    try {
        const orderData = {
            items: cart.map(item => ({
                equipment_id: item.equipment_id,
                quantity: item.quantity,
                price: item.price,
            })),
            totalAmount: getTotalPrice(),
        };

        const response = await axios.post(
            `${API_BASE_URL}/create-order`,
            orderData,
            {
                headers: { Authorization: `Bearer ${user.token}` },
            }
        );

        clearCart();
        toast.success(`Order placed successfully! Order ID: ${response.data.orderId}`);
        navigate("/");
    } catch (error) {
        console.error("Checkout error:", error);
        toast.error("Failed to place order. Please try again.");
    }
};
```

5. Add `ToastContainer` at the bottom of the return JSX if not already present:
```jsx
import { ToastContainer } from "react-toastify";

// At the end of the JSX:
<ToastContainer position="top-center" autoClose={3000} theme="light" />
```

## Verification
- Add items to cart, click checkout → order is saved to MySQL
- Success toast shows order ID
- Cart is cleared after successful checkout
- User is redirected to home page
- If backend is down or token is invalid → error toast appears
- Verify in MySQL: `SELECT * FROM orders;` and `SELECT * FROM order_items;`
