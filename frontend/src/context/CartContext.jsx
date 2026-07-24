/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import api from "../services/api";
import { toast } from "sonner";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [cart, setCart] = useState([]);
    const [synced, setSynced] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            const storedCart = localStorage.getItem("cart");
            setCart(storedCart ? JSON.parse(storedCart) : []);
            setSynced(false);
            setLoading(false);
            return;
        }

        const localCart = localStorage.getItem("cart");
        const localItems = localCart ? JSON.parse(localCart) : [];

        const initCart = async () => {
            try {
                if (localItems.length > 0) {
                    await api.post("/cart/merge", { items: localItems });
                    localStorage.removeItem("cart");
                }
                const res = await api.get("/cart");
                setCart(res.data.items || []);
                setSynced(true);
            } catch {
                setCart(localItems);
                setSynced(false);
            } finally {
                setLoading(false);
            }
        };

        initCart();
    }, [user]);

    useEffect(() => {
        if (!synced && user === null) {
            localStorage.setItem("cart", JSON.stringify(cart));
        }
    }, [cart, synced, user]);

    const addToCart = useCallback(
        async (equip) => {
            const fallbackAdd = () => {
                setCart((prev) => {
                    const itemIndex = prev.findIndex((item) => item.equipment_id === equip.equipment_id);
                    if (itemIndex !== -1) {
                        const updated = [...prev];
                        updated[itemIndex].quantity += 1;
                        return updated;
                    }
                    return [...prev, { ...equip, quantity: 1 }];
                });
                toast.success(`${equip.name} added to cart`);
            };

            if (synced) {
                try {
                    await api.post("/cart/add", { equipment_id: equip.equipment_id });
                    const res = await api.get("/cart");
                    setCart(res.data.items || []);
                    toast.success(`${equip.name} added to cart`);
                } catch (error) {
                    if (error.response?.status === 401) {
                        fallbackAdd();
                    } else {
                        toast.error(error.response?.data?.message || "Failed to add to cart");
                    }
                }
            } else {
                fallbackAdd();
            }
        },
        [synced]
    );

    const removeFromCart = useCallback(
        async (id) => {
            const item = cart.find((item) => item.equipment_id === id);
            if (item) {
                toast.info(`${item.name} removed from cart`);
            }
            if (synced) {
                try {
                    await api.delete(`/cart/remove/${id}`);
                } catch {
                    // remove locally regardless
                }
            }
            setCart((prev) => prev.filter((item) => item.equipment_id !== id));
        },
        [synced, cart]
    );

    const updateQuantity = useCallback(
        async (id, newQuantity) => {
            const qty = Math.max(1, newQuantity);
            if (synced) {
                try {
                    await api.put(`/cart/update/${id}`, { quantity: qty });
                } catch {
                    // update locally regardless
                }
            }
            setCart((prev) => prev.map((item) => (item.equipment_id === id ? { ...item, quantity: qty } : item)));
        },
        [synced]
    );

    const clearCart = useCallback(async () => {
        if (synced) {
            try {
                await api.delete("/cart");
            } catch {
                // clear locally regardless
            }
        }
        setCart([]);
        if (!synced) {
            localStorage.removeItem("cart");
        }
    }, [synced]);

    const getTotalItems = useCallback(() => {
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    }, [cart]);

    const getTotalPrice = useCallback(() => {
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }, [cart]);

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
                loading,
                synced,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;
