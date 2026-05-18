# Migrate Cart Usage to CartContext

## Goal
Replace the local cart state in `Shop.jsx` and `Cart.jsx` with the centralized `CartContext`.

## Files to Touch
- `frontend/src/pages/Equipment/Shop.jsx`
- `frontend/src/pages/Cart/Cart.jsx`

## Steps

### 1. Update Shop.jsx

Remove local cart state and use context instead:

```jsx
// Remove these imports/lines:
import React, { useState, useEffect } from 'react';
const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
});
const addToCart = (equip) => { ... };  // entire function

// Add this import:
import { useContext } from "react";
import { CartContext } from "../Context/CartContext";

// Inside the component, get cart functions from context:
const { cart, addToCart, getTotalItems } = useContext(CartContext);

// Update the floating cart button to use getTotalItems:
// Before:
Cart ({Object.values(cart).reduce((sum, item) => sum + item.quantity, 0)})

// After:
Cart ({getTotalItems()})
```

Full updated `Shop.jsx`:
```jsx
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import bdt_icon2 from "../../assets/bdt_icon2.svg";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { CartContext } from "../Context/CartContext";

const BuyEquipment = () => {
    const [equipment, setEquipment] = useState([]);
    const { cart, addToCart, getTotalItems } = useContext(CartContext);
    const navigate = useNavigate();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        axios.get(`${API_BASE_URL}/equipment`)
            .then(response => setEquipment(response.data))
            .catch(error => console.error('There was an error fetching the equipment data!', error));
    }, []);

    return (
        <div className='justify-center flex mx-36 py-10'>
            <div className='grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3 w-[90%]'>
                {equipment.map((equip) => (
                    <div key={equip.equipment_id} className="card items-center bg-[#ffffff] shadow-[0_0_20px_rgba(0,0,0,0.2)]">
                        <figure className="w-48 h-48 flex items-center justify-center">
                            <img className="h-full py-2" src={equip.image_url} alt={equip.name} />
                        </figure>
                        <div className="card-body w-full bg-[#ffcece] rounded-md">
                            <h2 className="card-title">{equip.name}</h2>
                            <p>{equip.description}</p>
                            <p className='pt-4 text-[16px] flex items-center'>
                                <img src={bdt_icon2} alt="bdt_icon" className='size-5' /> {equip.price}
                            </p>
                            <div className="card-actions justify-end">
                                <button className="btn btn-soft btn-error text-black hover:text-white" onClick={() => addToCart(equip)}>
                                    Add to cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <button
                className="fixed bottom-18 right-20 bg-red-500 text-white p-4 rounded-full shadow-lg flex items-center gap-2"
                onClick={() => navigate('/cart')}
            >
                <FaShoppingCart />
                Cart ({getTotalItems()})
            </button>
        </div>
    );
};

export default BuyEquipment;
```

### 2. Update Cart.jsx

Replace local state with context:

```jsx
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from "react-icons/fa";
import { FaBuyNLarge } from 'react-icons/fa6';
import { CartContext } from "../Context/CartContext";

const Cart = () => {
    const navigate = useNavigate();
    const { cart, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useContext(CartContext);

    const handleCheckout = () => {
        clearCart();
        alert("Checkout successful! Your cart has been cleared.");
    };

    return (
        <div className="container mx-auto p-6 min-h-screen">
            <h2 className="text-3xl font-bold text-center mb-3">Shopping Cart</h2>
            <div className="grid grid-cols-1 gap-6 w-[85%] mx-auto">
                {cart.map((item) => (
                    <div key={item.equipment_id} className="card flex flex-row bg-[#ffffff] shadow-md p-4">
                        <figure className="w-24 h-24 bg-gray-100 flex items-center justify-center mr-4">
                            <img className="w-full h-full object-cover" src={item.image_url} alt={item.name} />
                        </figure>
                        <div className="ml-4 flex-1">
                            <h3 className="font-bold">{item.name}</h3>
                            <p className="text-gray-600">{item.description}</p>
                            <p className="font-semibold">Price: {item.price} BDT</p>
                            <div className="flex items-center mt-2">
                                <input
                                    type="number"
                                    className="border p-1 w-16 text-center"
                                    value={item.quantity || 1}
                                    onChange={(e) => updateQuantity(item.equipment_id, parseInt(e.target.value))}
                                    min="1"
                                />
                                <button className="text-red-600 ml-4" onClick={() => removeFromCart(item.equipment_id)}>
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {cart.length > 0 && (
                <button
                    className="fixed bottom-18 right-20 bg-red-500 text-white p-4 rounded-full shadow-lg font-bold"
                    onClick={handleCheckout}
                >
                    Checkout: {getTotalPrice().toFixed(2)} BDT
                </button>
            )}
        </div>
    );
};

export default Cart;
```

## Verification
- Add items to cart from BuyEquipment → should appear in Cart
- Update quantity in Cart → should persist
- Remove item from Cart → should disappear
- Checkout → cart clears
- No more duplicated localStorage logic
