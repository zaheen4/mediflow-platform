import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from "react-icons/fa";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const Cart = () => {
    const navigate = useNavigate();
    const { cart, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

            <ToastContainer position="top-center" autoClose={3000} theme="light" />
        </div>
    );
};

export default Cart;
