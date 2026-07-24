import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaShoppingCart, FaTruck, FaCreditCard, FaMoneyBillWave } from "react-icons/fa";
import { CartContext } from "../../context/CartContext";
import api from "../../services/api";
import { toast } from "sonner";
import bdt_icon2 from "../../assets/bdt_icon2.svg";

const paymentMethods = [
    { value: "cash-on-delivery", label: "Cash on Delivery", icon: FaMoneyBillWave },
    { value: "card", label: "Credit/Debit Card", icon: FaCreditCard },
];

const Checkout = () => {
    const navigate = useNavigate();
    const { cart, getTotalPrice, getTotalItems, clearCart } = useContext(CartContext);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        full_name: "",
        phone: "",
        address: "",
        city: "",
        payment_method: "cash-on-delivery",
    });

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handlePlaceOrder = async () => {
        if (!form.full_name.trim()) {
            toast.error("Full name is required");
            return;
        }
        if (!form.phone.trim()) {
            toast.error("Phone number is required");
            return;
        }
        if (!form.address.trim()) {
            toast.error("Shipping address is required");
            return;
        }
        if (!form.city.trim()) {
            toast.error("City is required");
            return;
        }

        setSubmitting(true);
        try {
            const shipping_address = `${form.full_name}\n${form.address}\n${form.city}`;
            const response = await api.post("/create-order", {
                items: cart.map((item) => ({
                    equipment_id: item.equipment_id,
                    quantity: item.quantity,
                })),
                shipping_address,
                contact_phone: form.phone,
                payment_method: form.payment_method,
            });

            await clearCart();
            toast.success(`Order placed successfully! Order ID: ${response.data.orderId}`);
            navigate("/orders");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to place order. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="container mx-auto p-6 min-h-screen">
                <div className="flex flex-col items-center justify-center py-20">
                    <FaShoppingCart className="h-24 w-24 text-base-content/50 mb-4" />
                    <p className="text-xl text-base-content/70 mb-4">Your cart is empty</p>
                    <Link to="/buy-equipment" className="btn btn-primary">
                        Browse Equipment
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 min-h-screen">
            <h2 className="text-3xl font-bold text-center mb-8">Checkout</h2>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
                <div className="lg:col-span-3 space-y-6">
                    <div className="card bg-base-100 shadow-md">
                        <div className="card-body">
                            <h3 className="card-title flex items-center gap-2">
                                <FaTruck /> Shipping Address
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                                <div className="sm:col-span-2">
                                    <label className="label">
                                        <span className="label-text">Full Name</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={form.full_name}
                                        onChange={handleChange}
                                        className="input input-bordered w-full"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="label">
                                        <span className="label-text">Phone Number</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        className="input input-bordered w-full"
                                        placeholder="01XXXXXXXXX"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="label">
                                        <span className="label-text">Address</span>
                                    </label>
                                    <textarea
                                        name="address"
                                        value={form.address}
                                        onChange={handleChange}
                                        className="textarea textarea-bordered w-full"
                                        rows="3"
                                        placeholder="Street, building, apartment"
                                    />
                                </div>
                                <div>
                                    <label className="label">
                                        <span className="label-text">City</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={form.city}
                                        onChange={handleChange}
                                        className="input input-bordered w-full"
                                        placeholder="Dhaka"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-md">
                        <div className="card-body">
                            <h3 className="card-title flex items-center gap-2">
                                <FaCreditCard /> Payment Method
                            </h3>
                            <div className="flex flex-col gap-2 mt-2">
                                {paymentMethods.map((method) => {
                                    const Icon = method.icon;
                                    return (
                                        <label
                                            key={method.value}
                                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                                form.payment_method === method.value
                                                    ? "border-primary bg-primary/5"
                                                    : "border-base-300 hover:border-base-content/30"
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value={method.value}
                                                checked={form.payment_method === method.value}
                                                onChange={handleChange}
                                                className="radio radio-primary radio-sm"
                                            />
                                            <Icon className="text-lg text-base-content/70" />
                                            <span>{method.label}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="card bg-base-100 shadow-md sticky top-24">
                        <div className="card-body">
                            <h3 className="card-title text-xl mb-4">Order Summary</h3>

                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {cart.map((item) => (
                                    <div key={item.equipment_id} className="flex gap-3">
                                        <figure className="w-14 h-14 bg-base-200 rounded-lg overflow-hidden flex-shrink-0">
                                            <img
                                                className="w-full h-full object-cover"
                                                src={item.image_url}
                                                alt={item.name}
                                            />
                                        </figure>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{item.name}</p>
                                            <p className="text-xs text-base-content/70">Qty: {item.quantity}</p>
                                            <p className="text-sm font-semibold flex items-center gap-1">
                                                <img src={bdt_icon2} alt="BDT" className="size-4 dark-invert" />
                                                {(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="divider my-2"></div>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-base-content/70">Items</span>
                                    <span>{getTotalItems()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-base-content/70">Subtotal</span>
                                    <span className="font-medium flex items-center gap-1">
                                        <img src={bdt_icon2} alt="BDT" className="size-4 dark-invert" />
                                        {getTotalPrice().toFixed(2)}
                                    </span>
                                </div>
                                <div className="divider my-2"></div>
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span className="flex items-center gap-1">
                                        <img src={bdt_icon2} alt="BDT" className="size-5 dark-invert" />
                                        {getTotalPrice().toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <button
                                className="btn btn-error btn-lg w-full mt-6"
                                onClick={handlePlaceOrder}
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <span className="loading loading-spinner loading-sm"></span>
                                ) : (
                                    "Place Order"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
