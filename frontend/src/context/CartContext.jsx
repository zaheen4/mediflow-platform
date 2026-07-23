/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { toast } from "sonner";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [cart, setCart] = useState(() => {
        const storedCart = localStorage.getItem("cart");
        return storedCart ? JSON.parse(storedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        if (!user) {
            setCart([]);
            localStorage.removeItem("cart");
        }
    }, [user]);

    const addToCart = (equip) => {
        const itemIndex = cart.findIndex((item) => item.equipment_id === equip.equipment_id);

        if (itemIndex !== -1) {
            const updatedCart = [...cart];
            updatedCart[itemIndex].quantity += 1;
            setCart(updatedCart);
            toast.info(`${equip.name} quantity updated in cart`);
        } else {
            setCart([...cart, { ...equip, quantity: 1 }]);
            toast.success(`${equip.name} added to cart`);
        }
    };

    const removeFromCart = (id) => {
        const item = cart.find((item) => item.equipment_id === id);
        if (item) {
            toast.info(`${item.name} removed from cart`);
        }
        setCart(cart.filter((item) => item.equipment_id !== id));
    };

    const updateQuantity = (id, newQuantity) => {
        setCart((prevCart) =>
            prevCart.map((item) => (item.equipment_id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item))
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
