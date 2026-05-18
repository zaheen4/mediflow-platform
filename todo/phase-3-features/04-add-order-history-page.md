# Add Order History Page

## Goal
Create a page where users can view their past orders, and Admins can view all orders.

## Files to Create
- `src/components/Orders/OrderHistory.jsx`

## Files to Touch
- `src/routes/Route.jsx`
- `src/components/Home/Navbar.jsx` (optional: add link)

## Steps

1. Create `src/components/Orders/OrderHistory.jsx`:

```jsx
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";
import { toast, ToastContainer } from "react-toastify";

const OrderHistory = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const endpoint = user.role === "Admin"
                    ? `${API_BASE_URL}/all-orders`
                    : `${API_BASE_URL}/my-orders`;

                const response = await axios.get(endpoint, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setOrders(response.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
                toast.error("Failed to load order history.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg text-red-500"></span>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 min-h-screen">
            <h2 className="text-3xl font-bold text-center mb-6">
                {user.role === "Admin" ? "All Orders" : "My Orders"}
            </h2>

            {orders.length === 0 ? (
                <p className="text-center text-gray-500 text-lg">No orders found.</p>
            ) : (
                <div className="space-y-6 w-[85%] mx-auto">
                    {orders.map((order) => (
                        <div key={order.order_id} className="card bg-white shadow-md p-6">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h3 className="font-bold text-lg">Order #{order.order_id}</h3>
                                    <p className="text-gray-500 text-sm">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </p>
                                    {user.role === "Admin" && (
                                        <p className="text-gray-500 text-sm">Customer: {order.username}</p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <span className={`badge ${
                                        order.status === "Completed" ? "badge-success" :
                                        order.status === "Cancelled" ? "badge-error" : "badge-warning"
                                    }`}>
                                        {order.status}
                                    </span>
                                    <p className="font-semibold mt-1">{order.total_amount} BDT</p>
                                </div>
                            </div>

                            <div className="divider my-2"></div>

                            <div className="space-y-2">
                                {order.items.map((item) => (
                                    <div key={item.order_item_id} className="flex items-center gap-4">
                                        <img
                                            src={item.image_url}
                                            alt={item.name}
                                            className="w-12 h-12 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-sm text-gray-500">
                                                Qty: {item.quantity} × {item.price_at_purchase} BDT
                                            </p>
                                        </div>
                                        <p className="font-semibold">
                                            {(item.quantity * item.price_at_purchase).toFixed(2)} BDT
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ToastContainer position="top-center" autoClose={3000} theme="light" />
        </div>
    );
};

export default OrderHistory;
```

2. Add the route in `src/routes/Route.jsx`:

```jsx
import OrderHistory from "../components/Orders/OrderHistory";

// Inside the routes array, as a child of Home:
{
    path: "/orders",
    element: (
        <ProtectedRoute>
            <OrderHistory />
        </ProtectedRoute>
    ),
},
```

3. (Optional) Add a link in the Navbar dropdown for logged-in users:
```jsx
<li>
    <Link to="/orders">Order History</Link>
</li>
```

## Verification
- User logs in, navigates to `/orders` → sees their orders
- Admin navigates to `/orders` → sees all orders with customer names
- Empty state shows "No orders found"
- Loading spinner appears while fetching
- Order cards show status badge, date, items with images and prices
