import { useState, useEffect, useCallback } from "react";
import api from "../../services/api";
import { FaEdit, FaTrash, FaPlus, FaBox, FaClipboardList, FaTags } from "react-icons/fa";
import { toast } from "sonner";

const AdminPage = () => {
    const [tab, setTab] = useState("equipment");
    const [equipment, setEquipment] = useState([]);
    const [orders, setOrders] = useState([]);
    const [categories, setCategories] = useState([]);
    const [editing, setEditing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(null);
    const [adding, setAdding] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(null);
    const [catEdit, setCatEdit] = useState(null);
    const [catSaving, setCatSaving] = useState(false);
    const [newCatName, setNewCatName] = useState("");
    const [newCatDesc, setNewCatDesc] = useState("");

    const [newEquipment, setNewEquipment] = useState({
        name: "",
        description: "",
        price: "",
        quantity: "",
        image_url: "",
        category_id: "",
    });

    const fetchEquipment = useCallback(async () => {
        try {
            const response = await api.get("/equipment");
            setEquipment(response.data);
        } catch (error) {
            console.error("Error fetching equipment:", error);
            toast.error("Failed to load equipment data.");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchOrders = useCallback(async () => {
        try {
            const response = await api.get("/all-orders");
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error("Failed to load orders.");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCategories = useCallback(async () => {
        try {
            const response = await api.get("/categories");
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }, []);

    useEffect(() => {
        if (tab === "equipment") {
            fetchEquipment();
        } else if (tab === "orders") {
            fetchOrders();
        } else {
            fetchCategories();
        }
        fetchCategories();
    }, [tab, fetchEquipment, fetchOrders, fetchCategories]);

    const handleEdit = (equip) => {
        setEditing(equip);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this equipment?")) return;

        setDeleting(id);
        try {
            await api.delete(`/delete-equipment/${id}`);
            fetchEquipment();
            toast.success("Equipment deleted successfully");
        } catch (error) {
            console.error("Error deleting equipment:", error);
            toast.error("Failed to delete equipment.");
        } finally {
            setDeleting(null);
        }
    };

    const handleSaveEdit = async () => {
        if (!editing.name || editing.name.trim().length === 0) {
            toast.error("Equipment name is required");
            return;
        }
        if (editing.price !== undefined && (isNaN(parseFloat(editing.price)) || parseFloat(editing.price) < 0)) {
            toast.error("Price must be a non-negative number");
            return;
        }

        setSaving(true);
        try {
            await api.put(`/modify-equipment/${editing.equipment_id}`, editing);
            setEditing(null);
            fetchEquipment();
            toast.success("Equipment updated successfully");
        } catch (error) {
            console.error("Error updating equipment:", error);
            toast.error("Failed to update equipment.");
        } finally {
            setSaving(false);
        }
    };

    const handleAddEquipment = async () => {
        if (!newEquipment.name || newEquipment.name.trim().length === 0) {
            toast.error("Equipment name is required");
            return;
        }
        const price = parseFloat(newEquipment.price);
        if (isNaN(price) || price < 0) {
            toast.error("Price must be a non-negative number");
            return;
        }
        const quantity = parseInt(newEquipment.quantity);
        if (isNaN(quantity) || quantity < 0) {
            toast.error("Quantity must be a non-negative integer");
            return;
        }

        setAdding(true);
        try {
            const payload = { ...newEquipment };
            if (!payload.category_id) delete payload.category_id;
            await api.post("/add-equipment", payload);
            setNewEquipment({ name: "", description: "", price: "", quantity: "", image_url: "", category_id: "" });
            fetchEquipment();
            toast.success("Equipment added successfully");
        } catch (error) {
            console.error("Error adding equipment:", error);
            toast.error("Failed to add equipment.");
        } finally {
            setAdding(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        setUpdatingStatus(orderId);
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            toast.success(`Order #${orderId} status updated to ${newStatus}`);
            fetchOrders();
        } catch (error) {
            console.error("Error updating order status:", error);
            toast.error("Failed to update order status.");
        } finally {
            setUpdatingStatus(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg text-red-500"></span>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold my-4 ml-28">Admin Dashboard</h2>

            <div className="flex gap-4 mb-6 ml-28" role="tablist">
                <button
                    className={`btn ${tab === "equipment" ? "btn-primary" : "btn-ghost"}`}
                    onClick={() => setTab("equipment")}
                    role="tab"
                    aria-selected={tab === "equipment"}
                >
                    <FaBox className="mr-1" /> Equipment
                </button>
                <button
                    className={`btn ${tab === "orders" ? "btn-primary" : "btn-ghost"}`}
                    onClick={() => setTab("orders")}
                >
                    <FaClipboardList className="mr-1" /> Orders
                </button>
                <button
                    className={`btn ${tab === "categories" ? "btn-primary" : "btn-ghost"}`}
                    onClick={() => setTab("categories")}
                >
                    <FaTags className="mr-1" /> Categories
                </button>
            </div>

            {tab === "equipment" ? (
                <div className="overflow-x-auto mx-auto flex justify-center rounded">
                    {equipment.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            No equipment found. Add your first item below.
                        </div>
                    ) : (
                        <table className="table-auto w-[85%]  border-collapse bg-white ">
                            <thead>
                                <tr className="bg-gray-300 border border-gray-300 ">
                                    <th className="p-2 w-[5%]">ID</th>
                                    <th className="p-2 w-[18%]">Name</th>
                                    <th className="p-2 w-[27%]">Description</th>
                                    <th className="p-2 w-[8%]">Price (BDT)</th>
                                    <th className="p-2 w-[8%]">Qty</th>
                                    <th className="p-2 w-[10%]">Category</th>
                                    <th className="p-2 w-[8%]">Image</th>
                                    <th className="p-2 w-[8%]">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {equipment.map((equip) => (
                                    <tr key={equip.equipment_id} className="border-b border-gray-300">
                                        <td className="p-2 text-center">{equip.equipment_id}</td>
                                        <td className="p-2">
                                            {editing?.equipment_id === equip.equipment_id ? (
                                                <input
                                                    type="text"
                                                    value={editing.name}
                                                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                                                    className="border rounded p-1 w-full"
                                                />
                                            ) : (
                                                equip.name
                                            )}
                                        </td>
                                        <td className="p-2">
                                            {editing?.equipment_id === equip.equipment_id ? (
                                                <input
                                                    type="text"
                                                    value={editing.description}
                                                    onChange={(e) =>
                                                        setEditing({ ...editing, description: e.target.value })
                                                    }
                                                    className="border rounded p-1 w-full"
                                                />
                                            ) : (
                                                equip.description
                                            )}
                                        </td>
                                        <td className="p-2 ">
                                            {editing?.equipment_id === equip.equipment_id ? (
                                                <input
                                                    type="number"
                                                    value={editing.price}
                                                    onChange={(e) => setEditing({ ...editing, price: e.target.value })}
                                                    className="border rounded p-1 w-full"
                                                />
                                            ) : (
                                                equip.price
                                            )}
                                        </td>
                                        <td className="p-2 text-center">
                                            {editing?.equipment_id === equip.equipment_id ? (
                                                <input
                                                    type="number"
                                                    value={editing.quantity}
                                                    onChange={(e) =>
                                                        setEditing({ ...editing, quantity: e.target.value })
                                                    }
                                                    className="border rounded p-1 w-full"
                                                />
                                            ) : (
                                                equip.quantity
                                            )}
                                        </td>
                                        <td className="p-2">
                                            {editing?.equipment_id === equip.equipment_id ? (
                                                <select
                                                    value={editing.category_id || ""}
                                                    onChange={(e) =>
                                                        setEditing({
                                                            ...editing,
                                                            category_id: e.target.value
                                                                ? parseInt(e.target.value)
                                                                : null,
                                                        })
                                                    }
                                                    className="border rounded p-1 w-full"
                                                >
                                                    <option value="">None</option>
                                                    {categories.map((c) => (
                                                        <option key={c.category_id} value={c.category_id}>
                                                            {c.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <span className="badge badge-ghost badge-sm">
                                                    {equip.category_name || "—"}
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-2">
                                            {editing?.equipment_id === equip.equipment_id ? (
                                                <input
                                                    type="text"
                                                    value={editing.image_url}
                                                    onChange={(e) =>
                                                        setEditing({ ...editing, image_url: e.target.value })
                                                    }
                                                    className="border rounded p-1 w-full"
                                                />
                                            ) : (
                                                <img
                                                    src={equip.image_url}
                                                    alt={equip.name}
                                                    className="w-16 h-16 object-cover rounded-lg mx-auto"
                                                />
                                            )}
                                        </td>
                                        <td className="p-2 flex justify-center gap-2">
                                            {editing?.equipment_id === equip.equipment_id ? (
                                                <button
                                                    className="btn btn-success btn-sm"
                                                    onClick={handleSaveEdit}
                                                    disabled={saving}
                                                >
                                                    {saving ? (
                                                        <span className="loading loading-spinner loading-xs"></span>
                                                    ) : (
                                                        "Save"
                                                    )}
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-warning btn-sm"
                                                    onClick={() => handleEdit(equip)}
                                                >
                                                    <FaEdit />
                                                </button>
                                            )}
                                            <button
                                                className="btn btn-error btn-sm"
                                                onClick={() => handleDelete(equip.equipment_id)}
                                                disabled={deleting === equip.equipment_id}
                                            >
                                                {deleting === equip.equipment_id ? (
                                                    <span className="loading loading-spinner loading-xs"></span>
                                                ) : (
                                                    <FaTrash />
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                <tr className="border-b border-gray-300">
                                    <td className="p-2">+</td>
                                    <td className="p-2">
                                        <input
                                            type="text"
                                            value={newEquipment.name}
                                            onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
                                            placeholder="New Name"
                                            className="border rounded p-1 w-full"
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="text"
                                            value={newEquipment.description}
                                            onChange={(e) =>
                                                setNewEquipment({ ...newEquipment, description: e.target.value })
                                            }
                                            placeholder="New Description"
                                            className="border rounded p-1 w-full"
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="number"
                                            value={newEquipment.price}
                                            onChange={(e) =>
                                                setNewEquipment({ ...newEquipment, price: e.target.value })
                                            }
                                            placeholder="Price"
                                            className="border rounded p-1 w-full"
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="number"
                                            value={newEquipment.quantity}
                                            onChange={(e) =>
                                                setNewEquipment({ ...newEquipment, quantity: e.target.value })
                                            }
                                            placeholder="Quantity"
                                            className="border rounded p-1 w-full"
                                        />
                                    </td>
                                    <td className="p-2">
                                        <select
                                            value={newEquipment.category_id}
                                            onChange={(e) =>
                                                setNewEquipment({ ...newEquipment, category_id: e.target.value })
                                            }
                                            className="border rounded p-1 w-full"
                                        >
                                            <option value="">None</option>
                                            {categories.map((c) => (
                                                <option key={c.category_id} value={c.category_id}>
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="text"
                                            value={newEquipment.image_url}
                                            onChange={(e) =>
                                                setNewEquipment({ ...newEquipment, image_url: e.target.value })
                                            }
                                            placeholder="Image URL"
                                            className="border rounded p-1 w-full"
                                        />
                                    </td>
                                    <td className="p-2 text-center">
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={handleAddEquipment}
                                            disabled={adding}
                                        >
                                            {adding ? (
                                                <span className="loading loading-spinner loading-xs"></span>
                                            ) : (
                                                <FaPlus />
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    )}
                </div>
            ) : (
                <div className="overflow-x-auto mx-auto flex justify-center rounded">
                    {orders.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No orders found.</div>
                    ) : (
                        <table className="table-auto w-[90%] border-collapse bg-white">
                            <thead>
                                <tr className="bg-gray-300 border border-gray-300">
                                    <th className="p-2">Order ID</th>
                                    <th className="p-2">User</th>
                                    <th className="p-2">Items</th>
                                    <th className="p-2">Total</th>
                                    <th className="p-2">Status</th>
                                    <th className="p-2">Date</th>
                                    <th className="p-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.order_id} className="border-b border-gray-300">
                                        <td className="p-2 text-center font-medium">#{order.order_id}</td>
                                        <td className="p-2">{order.username}</td>
                                        <td className="p-2 text-sm">
                                            {order.items && order.items.length > 0 ? (
                                                <ul className="list-disc list-inside">
                                                    {order.items.map((item, i) => (
                                                        <li key={i}>
                                                            {item.equipment_name} x{item.quantity}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <span className="text-gray-400">—</span>
                                            )}
                                        </td>
                                        <td className="p-2 text-right">{Number(order.total_amount).toFixed(2)}</td>
                                        <td className="p-2">
                                            <span
                                                className={`badge ${
                                                    order.status === "Completed"
                                                        ? "badge-success"
                                                        : order.status === "Cancelled"
                                                          ? "badge-error"
                                                          : "badge-warning"
                                                }`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-2 text-sm">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-2">
                                            {order.status === "Pending" ? (
                                                <div className="flex gap-1">
                                                    <button
                                                        className="btn btn-success btn-xs"
                                                        onClick={() => handleStatusChange(order.order_id, "Completed")}
                                                        disabled={updatingStatus === order.order_id}
                                                    >
                                                        {updatingStatus === order.order_id ? (
                                                            <span className="loading loading-spinner loading-xs"></span>
                                                        ) : (
                                                            "Complete"
                                                        )}
                                                    </button>
                                                    <button
                                                        className="btn btn-error btn-xs"
                                                        onClick={() => handleStatusChange(order.order_id, "Cancelled")}
                                                        disabled={updatingStatus === order.order_id}
                                                    >
                                                        {updatingStatus === order.order_id ? (
                                                            <span className="loading loading-spinner loading-xs"></span>
                                                        ) : (
                                                            "Cancel"
                                                        )}
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-sm">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {tab === "categories" && (
                <div className="mx-auto flex justify-center">
                    <div className="w-[85%]">
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={newCatName}
                                onChange={(e) => setNewCatName(e.target.value)}
                                placeholder="New category name"
                                className="input input-bordered input-sm flex-1"
                            />
                            <input
                                type="text"
                                value={newCatDesc}
                                onChange={(e) => setNewCatDesc(e.target.value)}
                                placeholder="Description (optional)"
                                className="input input-bordered input-sm flex-1"
                            />
                            <button
                                className="btn btn-primary btn-sm"
                                disabled={!newCatName.trim() || catSaving}
                                onClick={async () => {
                                    setCatSaving(true);
                                    try {
                                        await api.post("/categories", { name: newCatName, description: newCatDesc });
                                        setNewCatName("");
                                        setNewCatDesc("");
                                        fetchCategories();
                                        toast.success("Category created");
                                    } catch {
                                        toast.error("Failed to create category");
                                    } finally {
                                        setCatSaving(false);
                                    }
                                }}
                            >
                                {catSaving ? <span className="loading loading-spinner loading-xs"></span> : <FaPlus />}
                            </button>
                        </div>

                        {categories.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">No categories yet.</div>
                        ) : (
                            <table className="table-auto w-full border-collapse bg-white">
                                <thead>
                                    <tr className="bg-gray-300 border border-gray-300">
                                        <th className="p-2 w-[10%]">ID</th>
                                        <th className="p-2 w-[30%]">Name</th>
                                        <th className="p-2 w-[45%]">Description</th>
                                        <th className="p-2 w-[15%]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map((cat) => (
                                        <tr key={cat.category_id} className="border-b border-gray-300">
                                            <td className="p-2 text-center">{cat.category_id}</td>
                                            <td className="p-2">
                                                {catEdit?.category_id === cat.category_id ? (
                                                    <input
                                                        type="text"
                                                        value={catEdit.name}
                                                        onChange={(e) =>
                                                            setCatEdit({ ...catEdit, name: e.target.value })
                                                        }
                                                        className="border rounded p-1 w-full"
                                                    />
                                                ) : (
                                                    cat.name
                                                )}
                                            </td>
                                            <td className="p-2">
                                                {catEdit?.category_id === cat.category_id ? (
                                                    <input
                                                        type="text"
                                                        value={catEdit.description || ""}
                                                        onChange={(e) =>
                                                            setCatEdit({ ...catEdit, description: e.target.value })
                                                        }
                                                        className="border rounded p-1 w-full"
                                                    />
                                                ) : (
                                                    cat.description || "—"
                                                )}
                                            </td>
                                            <td className="p-2 flex justify-center gap-2">
                                                {catEdit?.category_id === cat.category_id ? (
                                                    <button
                                                        className="btn btn-success btn-xs"
                                                        disabled={catSaving}
                                                        onClick={async () => {
                                                            setCatSaving(true);
                                                            try {
                                                                await api.put(`/categories/${cat.category_id}`, {
                                                                    name: catEdit.name,
                                                                    description: catEdit.description,
                                                                });
                                                                setCatEdit(null);
                                                                fetchCategories();
                                                                toast.success("Category updated");
                                                            } catch {
                                                                toast.error("Failed to update category");
                                                            } finally {
                                                                setCatSaving(false);
                                                            }
                                                        }}
                                                    >
                                                        Save
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="btn btn-warning btn-xs"
                                                        onClick={() => setCatEdit(cat)}
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                )}
                                                <button
                                                    className="btn btn-error btn-xs"
                                                    onClick={async () => {
                                                        if (!window.confirm(`Delete "${cat.name}"?`)) return;
                                                        try {
                                                            await api.delete(`/categories/${cat.category_id}`);
                                                            fetchCategories();
                                                            toast.success("Category deleted");
                                                        } catch {
                                                            toast.error("Failed to delete category");
                                                        }
                                                    }}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;
