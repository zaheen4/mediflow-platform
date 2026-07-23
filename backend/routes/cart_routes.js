const express = require("express");
const { executeQuery } = require("../utils/db_utils");
const { verifyToken } = require("../utils/auth_utils");
const { NotFoundError, ValidationError } = require("../utils/errors");

const router = express.Router();

router.get("/cart", verifyToken, async (req, res) => {
    const items = await executeQuery(
        `SELECT c.equipment_id, c.quantity, e.name, e.price, e.image_url, e.quantity AS stock
         FROM cart_items c
         JOIN equipment e ON c.equipment_id = e.equipment_id
         WHERE c.user_id = ?
         ORDER BY c.cart_item_id`,
        [req.user.user_id]
    );

    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = items.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0);

    res.json({ items, totalItems, totalPrice });
});

router.post("/cart/add", verifyToken, async (req, res) => {
    const { equipment_id, quantity = 1 } = req.body;

    if (!equipment_id) {
        throw new ValidationError("equipment_id is required");
    }

    const equipment = await executeQuery("SELECT equipment_id, name FROM equipment WHERE equipment_id = ?", [
        equipment_id,
    ]);
    if (equipment.length === 0) {
        throw new NotFoundError("Equipment not found");
    }

    const existing = await executeQuery("SELECT quantity FROM cart_items WHERE user_id = ? AND equipment_id = ?", [
        req.user.user_id,
        equipment_id,
    ]);

    if (existing.length > 0) {
        await executeQuery("UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND equipment_id = ?", [
            quantity,
            req.user.user_id,
            equipment_id,
        ]);
    } else {
        await executeQuery("INSERT INTO cart_items (user_id, equipment_id, quantity) VALUES (?, ?, ?)", [
            req.user.user_id,
            equipment_id,
            quantity,
        ]);
    }

    res.status(201).json({ message: "Item added to cart" });
});

router.put("/cart/update/:equipment_id", verifyToken, async (req, res) => {
    const { equipment_id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
        throw new ValidationError("quantity must be at least 1");
    }

    const existing = await executeQuery("SELECT 1 FROM cart_items WHERE user_id = ? AND equipment_id = ?", [
        req.user.user_id,
        equipment_id,
    ]);
    if (existing.length === 0) {
        throw new NotFoundError("Item not found in cart");
    }

    await executeQuery("UPDATE cart_items SET quantity = ? WHERE user_id = ? AND equipment_id = ?", [
        quantity,
        req.user.user_id,
        equipment_id,
    ]);

    res.json({ message: "Cart item updated" });
});

router.delete("/cart/remove/:equipment_id", verifyToken, async (req, res) => {
    const { equipment_id } = req.params;

    await executeQuery("DELETE FROM cart_items WHERE user_id = ? AND equipment_id = ?", [
        req.user.user_id,
        equipment_id,
    ]);

    res.json({ message: "Item removed from cart" });
});

router.delete("/cart", verifyToken, async (req, res) => {
    await executeQuery("DELETE FROM cart_items WHERE user_id = ?", [req.user.user_id]);

    res.json({ message: "Cart cleared" });
});

router.post("/cart/merge", verifyToken, async (req, res) => {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.json({ message: "Nothing to merge" });
    }

    for (const item of items) {
        if (!item.equipment_id || !item.quantity) continue;

        const existing = await executeQuery("SELECT quantity FROM cart_items WHERE user_id = ? AND equipment_id = ?", [
            req.user.user_id,
            item.equipment_id,
        ]);

        if (existing.length > 0) {
            await executeQuery("UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND equipment_id = ?", [
                item.quantity,
                req.user.user_id,
                item.equipment_id,
            ]);
        } else {
            await executeQuery("INSERT INTO cart_items (user_id, equipment_id, quantity) VALUES (?, ?, ?)", [
                req.user.user_id,
                item.equipment_id,
                item.quantity,
            ]);
        }
    }

    res.json({ message: "Cart merged successfully" });
});

module.exports = router;
