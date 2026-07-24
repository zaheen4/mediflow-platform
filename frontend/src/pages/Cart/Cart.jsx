import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa";
import { CartContext } from "../../context/CartContext";
import api from "../../services/api";
import { toast } from "sonner";
import bdt_icon2 from "../../assets/bdt_icon2.svg";

const Cart = () => {
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const { cart, removeFromCart, updateQuantity, clearCart, getTotalPrice, getTotalItems } = useContext(CartContext);

    const handleCheckout = async () => {
        if (cart.length === 0) {
            toast.warning("Your cart is empty!");
            return;
        }

        setSubmitting(true);
        try {
            const orderData = {
                items: cart.map((item) => ({
                    equipment_id: item.equipment_id,
                    quantity: item.quantity,
                })),
            };

            const response = await api.post("/create-order", orderData);

            await clearCart();
            toast.success(`Order placed successfully! Order ID: ${response.data.orderId}`);
            navigate("/");
        } catch (error) {
            console.error("Checkout error:", error);
            toast.error(error.response?.data?.message || "Failed to place order. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleQuantityChange = (id, delta) => {
        const item = cart.find((i) => i.equipment_id === id);
        if (!item) return;
        const newQty = item.quantity + delta;
        if (newQty >= 1) {
            updateQuantity(id, newQty);
        }
    };

    return (
        <div className="container mx-auto p-6 min-h-screen">
            <h2 className="text-3xl font-bold text-center mb-8">Shopping Cart</h2>

            {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <FaShoppingCart className="h-24 w-24 text-base-content/50 mb-4" />
                    <p className="text-xl text-base-content/70 mb-4">Your cart is empty</p>
                    <Link to="/buy-equipment" className="btn btn-primary">
                        Browse Equipment
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map((item, idx) => (
                            <div key={item.equipment_id}>
                                {idx > 0 && <div className="divider mt-0 mb-4"></div>}
                                <div className="flex gap-4">
                                    <figure className="w-28 h-28 bg-base-200 rounded-lg overflow-hidden flex-shrink-0">
                                        <img
                                            className="w-full h-full object-cover"
                                            src={item.image_url}
                                            alt={item.name}
                                        />
                                    </figure>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="card-title text-lg">{item.name}</h3>
                                        <p className="text-sm text-base-content/70 line-clamp-2">{item.description}</p>
                                        <p className="text-lg font-semibold flex items-center gap-1 mt-1">
                                            <img src={bdt_icon2} alt="BDT" className="size-5 dark-invert" />
                                            {item.price}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <button
                                                className="btn btn-outline btn-sm"
                                                onClick={() => handleQuantityChange(item.equipment_id, -1)}
                                                disabled={item.quantity <= 1}
                                                aria-label="Decrease quantity"
                                            >
                                                <FaMinus />
                                            </button>
                                            <input
                                                type="number"
                                                className="input input-bordered w-16 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                value={item.quantity || 1}
                                                onChange={(e) => {
                                                    const val = parseInt(e.target.value);
                                                    if (val >= 1) updateQuantity(item.equipment_id, val);
                                                }}
                                                min="1"
                                            />
                                            <button
                                                className="btn btn-outline btn-sm"
                                                onClick={() => handleQuantityChange(item.equipment_id, 1)}
                                                aria-label="Increase quantity"
                                            >
                                                <FaPlus />
                                            </button>
                                            <button
                                                className="btn btn-ghost btn-circle text-error ml-auto"
                                                onClick={() => removeFromCart(item.equipment_id)}
                                                title="Remove item"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-base-100 shadow-md rounded-lg p-6 sticky top-24">
                            <h3 className="card-title text-xl mb-4">Order Summary</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-base-content/70">Items</span>
                                    <span>{getTotalItems()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-base-content/70">Subtotal</span>
                                    <span className="font-medium">BDT {getTotalPrice().toFixed(2)}</span>
                                </div>
                                <div className="divider my-2"></div>
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span>BDT {getTotalPrice().toFixed(2)}</span>
                                </div>
                            </div>
                            <button
                                className="btn btn-error btn-lg w-full mt-6"
                                onClick={handleCheckout}
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <span className="loading loading-spinner loading-sm"></span>
                                ) : (
                                    "Proceed to Checkout"
                                )}
                            </button>
                            <button
                                className="btn btn-ghost btn-sm w-full mt-2 text-base-content/60 hover:text-error"
                                onClick={async () => {
                                    await clearCart();
                                    toast.info("Cart cleared");
                                }}
                            >
                                Clear Cart
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
