import { useState, useEffect } from "react";
import api from "../../services/api";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get("/my-orders");
                setOrders(res.data);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <h2 className="text-2xl font-bold">No orders yet</h2>
                <p className="text-gray-500">Your order history will appear here after checkout.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Order History</h1>
            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order.order_id} className="card bg-base-100 shadow-md">
                        <div className="card-body">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="card-title">Order #{order.order_id}</h2>
                                    <p className="text-sm text-gray-500">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className="badge badge-primary badge-lg">
                                    ${parseFloat(order.total_amount).toFixed(2)}
                                </span>
                            </div>
                            <div className="divider my-2"></div>
                            <div className="overflow-x-auto">
                                <table className="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>Equipment</th>
                                            <th>Quantity</th>
                                            <th>Unit Price</th>
                                            <th>Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.items.map((item) => (
                                            <tr key={item.order_item_id}>
                                                <td>{item.equipment_name}</td>
                                                <td>{item.quantity}</td>
                                                <td>${parseFloat(item.unit_price).toFixed(2)}</td>
                                                <td>${(item.quantity * item.unit_price).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderHistory;
