const express = require("express");
const { executeQuery } = require("../utils/db_utils");
const { verifyToken } = require("../utils/auth_utils");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/admin/stats", verifyToken, requireAdmin, async (req, res) => {
    const [equipmentCount] = await executeQuery("SELECT COUNT(*) AS total FROM equipment WHERE deleted_at IS NULL");
    const [orderCount] = await executeQuery("SELECT COUNT(*) AS total FROM orders");
    const [userCount] = await executeQuery("SELECT COUNT(*) AS total FROM users");
    const [revenue] = await executeQuery(
        "SELECT COALESCE(SUM(total_amount), 0) AS total FROM orders WHERE status = 'Completed'"
    );
    const [pendingOrders] = await executeQuery("SELECT COUNT(*) AS total FROM orders WHERE status = 'Pending'");
    const [lowStock] = await executeQuery(
        "SELECT COUNT(*) AS total FROM equipment WHERE quantity <= 5 AND deleted_at IS NULL"
    );
    const [recentOrders] = await executeQuery(
        `SELECT o.order_id, o.total_amount, o.status, o.created_at, u.username
         FROM orders o
         JOIN users u ON o.user_id = u.user_id
         ORDER BY o.created_at DESC
         LIMIT 5`
    );
    const [monthlyRevenue] = await executeQuery(
        `SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, COALESCE(SUM(total_amount), 0) AS total
         FROM orders
         WHERE status = 'Completed' AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
         GROUP BY DATE_FORMAT(created_at, '%Y-%m')
         ORDER BY month`
    );

    res.json({
        equipment: equipmentCount.total,
        orders: orderCount.total,
        users: userCount.total,
        revenue: revenue.total,
        pendingOrders: pendingOrders.total,
        lowStock: lowStock.total,
        recentOrders,
        monthlyRevenue,
    });
});

module.exports = router;
