const express = require("express");
const {
    executeQuery,
    beginTransaction,
    queryWithConnection,
    commitTransaction,
    rollbackTransaction,
} = require("../utils/db_utils");
const { verifyToken } = require("../utils/auth_utils");

const router = express.Router();

// Create a new order (authenticated users only)
router.post("/create-order", verifyToken, async (req, res) => {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Order must contain at least one item" });
    }

    const validatedItems = [];
    let totalAmount = 0;

    try {
        for (const item of items) {
            if (!item.equipment_id || !item.quantity || item.quantity <= 0) {
                return res.status(400).json({ error: "Invalid item data" });
            }

            const equipment = await executeQuery(
                "SELECT equipment_id, name, price, quantity FROM equipment WHERE equipment_id = ?",
                [item.equipment_id]
            );

            if (equipment.length === 0) {
                return res.status(404).json({ error: `Equipment with ID ${item.equipment_id} not found` });
            }

            const eq = equipment[0];

            if (eq.quantity < item.quantity) {
                return res.status(400).json({
                    error: `Insufficient stock for ${eq.name}. Available: ${eq.quantity}, requested: ${item.quantity}`,
                });
            }

            const subtotal = parseFloat(eq.price) * item.quantity;
            totalAmount += subtotal;

            validatedItems.push({
                equipment_id: eq.equipment_id,
                quantity: item.quantity,
                price_at_purchase: eq.price,
            });
        }
    } catch (error) {
        console.error("Error validating order items:", error);
        return res.status(500).json({ error: "Failed to validate order" });
    }

    let connection;
    try {
        connection = await beginTransaction();

        const orderResult = await queryWithConnection(
            connection,
            "INSERT INTO orders (user_id, total_amount) VALUES (?, ?)",
            [req.user.user_id, totalAmount]
        );

        const orderId = orderResult.insertId;

        for (const item of validatedItems) {
            await queryWithConnection(
                connection,
                "INSERT INTO order_items (order_id, equipment_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)",
                [orderId, item.equipment_id, item.quantity, item.price_at_purchase]
            );

            await queryWithConnection(
                connection,
                "UPDATE equipment SET quantity = quantity - ? WHERE equipment_id = ?",
                [item.quantity, item.equipment_id]
            );
        }

        await commitTransaction(connection);
        connection = null;
        res.status(201).json({ message: "Order created successfully", orderId });
    } catch (error) {
        if (connection) await rollbackTransaction(connection);
        console.error("Error creating order:", error);
        res.status(500).json({ error: "Failed to create order" });
    }
});

// Get order history for the authenticated user
router.get("/my-orders", verifyToken, async (req, res) => {
    try {
        const orders = await executeQuery("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC", [
            req.user.user_id,
        ]);

        for (const order of orders) {
            const items = await executeQuery(
                `SELECT oi.*, e.name AS equipment_name, oi.price_at_purchase AS unit_price, e.image_url
                 FROM order_items oi
                 JOIN equipment e ON oi.equipment_id = e.equipment_id
                 WHERE oi.order_id = ?`,
                [order.order_id]
            );
            order.items = items;
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
});

// Get all orders (Admin only)
router.get("/all-orders", verifyToken, async (req, res) => {
    if (req.user.role !== "Admin") {
        return res.status(403).json({ error: "Access denied" });
    }

    try {
        const orders = await executeQuery(
            `SELECT o.*, u.username
             FROM orders o
             JOIN users u ON o.user_id = u.user_id
             ORDER BY o.created_at DESC`
        );

        for (const order of orders) {
            const items = await executeQuery(
                `SELECT oi.*, e.name AS equipment_name, oi.price_at_purchase AS unit_price
                 FROM order_items oi
                 JOIN equipment e ON oi.equipment_id = e.equipment_id
                 WHERE oi.order_id = ?`,
                [order.order_id]
            );
            order.items = items;
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching all orders:", error);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
});

module.exports = router;
