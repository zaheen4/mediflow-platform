const express = require("express");
const {
    executeQuery,
    beginTransaction,
    queryWithConnection,
    commitTransaction,
    rollbackTransaction,
} = require("../utils/db_utils");
const { verifyToken } = require("../utils/auth_utils");
const { requireAdmin } = require("../middleware/auth");
const { AppError, NotFoundError, ValidationError } = require("../utils/errors");
const { validateOrderItems, validateOrderStatus } = require("../utils/validation");
const logger = require("../utils/logger");
const { logAudit } = require("../utils/audit");

const router = express.Router();

// Create a new order (authenticated users only)
router.post("/create-order", verifyToken, async (req, res) => {
    const { items } = req.body;

    validateOrderItems(items);

    let connection;
    try {
        connection = await beginTransaction();

        const validatedItems = [];
        let totalAmount = 0;

        for (const item of items) {
            const equipment = await queryWithConnection(
                connection,
                "SELECT equipment_id, name, price, quantity FROM equipment WHERE equipment_id = ? AND deleted_at IS NULL FOR UPDATE",
                [item.equipment_id]
            );

            if (equipment.length === 0) {
                throw new NotFoundError(`Equipment with ID ${item.equipment_id} not found`);
            }

            const eq = equipment[0];

            if (eq.quantity < item.quantity) {
                throw new ValidationError(
                    `Insufficient stock for ${eq.name}. Available: ${eq.quantity}, requested: ${item.quantity}`
                );
            }

            const subtotal = parseFloat(eq.price) * item.quantity;
            totalAmount += subtotal;

            validatedItems.push({
                equipment_id: eq.equipment_id,
                quantity: item.quantity,
                price_at_purchase: eq.price,
            });
        }

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

            const result = await queryWithConnection(
                connection,
                "UPDATE equipment SET quantity = quantity - ? WHERE equipment_id = ? AND quantity >= ?",
                [item.quantity, item.equipment_id, item.quantity]
            );

            if (result.affectedRows === 0) {
                throw new ValidationError(`Insufficient stock for equipment ID ${item.equipment_id}`);
            }
        }

        await commitTransaction(connection);
        connection = null;
        res.status(201).json({ message: "Order created successfully", orderId });
        logAudit({
            user_id: req.user.user_id,
            action: "create_order",
            entity_type: "order",
            entity_id: orderId,
            details: { totalAmount, itemCount: validatedItems.length },
        });
    } catch (error) {
        if (connection) {
            try {
                await rollbackTransaction(connection);
            } catch (rollbackError) {
                logger.error("Rollback failed:", rollbackError);
            }
        }
        if (error instanceof AppError) throw error;
        throw error;
    }
});

// Get order history for the authenticated user
router.get("/my-orders", verifyToken, async (req, res) => {
    const { page, limit } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 0;
    const offset = (pageNum - 1) * limitNum;

    const countResult = await executeQuery("SELECT COUNT(*) AS total FROM orders WHERE user_id = ?", [
        req.user.user_id,
    ]);
    const total = countResult[0].total;

    let orders;
    if (limitNum > 0) {
        orders = await executeQuery(
            "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?",
            [req.user.user_id, limitNum, offset]
        );
    } else {
        orders = await executeQuery("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC", [
            req.user.user_id,
        ]);
    }

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

    if (!page && !limit) {
        return res.status(200).json(orders);
    }

    res.status(200).json({
        data: orders,
        total,
        page: pageNum,
        limit: limitNum || orders.length,
        totalPages: limitNum > 0 ? Math.ceil(total / limitNum) : 1,
    });
});

// Get all orders (Admin only)
router.get("/all-orders", verifyToken, requireAdmin, async (req, res) => {
    const { page, limit } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 0;
    const offset = (pageNum - 1) * limitNum;

    const countResult = await executeQuery("SELECT COUNT(*) AS total FROM orders");
    const total = countResult[0].total;

    let orders;
    if (limitNum > 0) {
        orders = await executeQuery(
            `SELECT o.*, u.username
             FROM orders o
             JOIN users u ON o.user_id = u.user_id
             ORDER BY o.created_at DESC
             LIMIT ? OFFSET ?`,
            [limitNum, offset]
        );
    } else {
        orders = await executeQuery(
            `SELECT o.*, u.username
             FROM orders o
             JOIN users u ON o.user_id = u.user_id
             ORDER BY o.created_at DESC`
        );
    }

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

    if (!page && !limit) {
        return res.status(200).json(orders);
    }

    res.status(200).json({
        data: orders,
        total,
        page: pageNum,
        limit: limitNum || orders.length,
        totalPages: limitNum > 0 ? Math.ceil(total / limitNum) : 1,
    });
});

// Update order status (Admin only)
router.put("/orders/:id/status", verifyToken, requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    validateOrderStatus(status);

    const order = await executeQuery("SELECT * FROM orders WHERE order_id = ?", [id]);
    if (order.length === 0) {
        throw new NotFoundError("Order not found");
    }

    if (order[0].status === status) {
        return res.json({ message: "Order status unchanged" });
    }

    const previousStatus = order[0].status;

    let connection;
    try {
        connection = await beginTransaction();

        await queryWithConnection(connection, "UPDATE orders SET status = ? WHERE order_id = ?", [status, id]);

        // Restore stock when cancelling
        if (status === "Cancelled" && previousStatus !== "Cancelled") {
            const items = await queryWithConnection(
                connection,
                "SELECT equipment_id, quantity FROM order_items WHERE order_id = ?",
                [id]
            );
            for (const item of items) {
                await queryWithConnection(
                    connection,
                    "UPDATE equipment SET quantity = quantity + ? WHERE equipment_id = ?",
                    [item.quantity, item.equipment_id]
                );
            }
        }

        await commitTransaction(connection);
        connection = null;

        logger.info(`Order ${id} status updated from ${previousStatus} to ${status}`);
        res.json({ message: "Order status updated" });
        logAudit({
            user_id: req.user.user_id,
            action: "update_order_status",
            entity_type: "order",
            entity_id: parseInt(id),
            details: { from: previousStatus, to: status },
        });
    } catch (error) {
        if (connection) await rollbackTransaction(connection);
        throw error;
    }
});

module.exports = router;
