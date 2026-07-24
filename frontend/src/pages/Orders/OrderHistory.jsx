import { useState, useEffect } from "react";
import api from "../../services/api";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const res = await api.get("/my-orders", { params: { page, limit: 10 } });
                const body = res.data;
                if (Array.isArray(body)) {
                    setOrders(body);
                    setTotalPages(1);
                } else {
                    setOrders(body.data);
                    setTotalPages(body.totalPages);
                }
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [page]);

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
                <p className="text-base-content/70">Your order history will appear here after checkout.</p>
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
                                    <p className="text-sm text-base-content/70">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className="badge badge-primary badge-lg">
                                    BDT {parseFloat(order.total_amount).toFixed(2)}
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
                                                <td>BDT {parseFloat(item.unit_price).toFixed(2)}</td>
                                                <td>BDT {(item.quantity * item.unit_price).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                        className="btn btn-sm"
                        disabled={page <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                        Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                            key={p}
                            className={`btn btn-sm ${p === page ? "btn-primary" : "btn-ghost"}`}
                            onClick={() => setPage(p)}
                        >
                            {p}
                        </button>
                    ))}
                    <button
                        className="btn btn-sm"
                        disabled={page >= totalPages}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
