const express = require("express");
const { executeQuery } = require("../utils/db_utils");
const { verifyToken } = require("../utils/auth_utils");
const { requireAdmin } = require("../middleware/auth");
const { NotFoundError } = require("../utils/errors");
const { validateEquipmentData } = require("../utils/validation");

const router = express.Router();

// Fetch all equipment (public route, supports pagination & search)
router.get("/equipment", async (req, res) => {
    const { page, limit, search } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 0;
    const offset = (pageNum - 1) * limitNum;

    let whereClause = "";
    const params = [];
    if (search) {
        whereClause = " WHERE name LIKE ? OR description LIKE ?";
        const pattern = `%${search}%`;
        params.push(pattern, pattern);
    }

    const countResult = await executeQuery(`SELECT COUNT(*) AS total FROM equipment${whereClause}`, params);
    const total = countResult[0].total;

    let equipment;
    if (limitNum > 0) {
        equipment = await executeQuery(`SELECT * FROM equipment${whereClause} ORDER BY equipment_id LIMIT ? OFFSET ?`, [
            ...params,
            limitNum,
            offset,
        ]);
    } else {
        equipment = await executeQuery(`SELECT * FROM equipment${whereClause} ORDER BY equipment_id`);
    }

    // Return flat array when no pagination/search requested (backward compat)
    if (!page && !limit && !search) {
        return res.status(200).json(equipment);
    }

    res.status(200).json({
        data: equipment,
        total,
        page: pageNum,
        limit: limitNum || equipment.length,
        totalPages: limitNum > 0 ? Math.ceil(total / limitNum) : 1,
    });
});

// Fetch details of a specific equipment (public route)
router.get("/equipment/:equipment_id", async (req, res) => {
    const { equipment_id } = req.params;
    const query = "SELECT * FROM equipment WHERE equipment_id = ?";
    const equipment = await executeQuery(query, [equipment_id]);
    if (equipment.length > 0) {
        res.status(200).json(equipment[0]);
    } else {
        throw new NotFoundError("Equipment not found");
    }
});

// Add equipment (Admin only)
router.post("/add-equipment", verifyToken, requireAdmin, async (req, res) => {
    const { name, description, price, quantity, image_url } = req.body;

    validateEquipmentData({ name, price, quantity });

    const query = "INSERT INTO equipment (name, description, price, quantity, image_url) VALUES (?, ?, ?, ?, ?)";
    await executeQuery(query, [name, description, parseFloat(price), parseInt(quantity), image_url || null]);
    res.status(201).json({ message: "Equipment added successfully" });
});

// Modify equipment (Admin only)
router.put("/modify-equipment/:equipment_id", verifyToken, requireAdmin, async (req, res) => {
    const { equipment_id } = req.params;
    const { name, description, price, quantity, image_url } = req.body;

    validateEquipmentData({ name, price, quantity }, true);

    const query = `
        UPDATE equipment
        SET name = ?, description = ?, price = ?, quantity = ?, image_url = ?
        WHERE equipment_id = ?
    `;
    await executeQuery(query, [name, description, price, quantity, image_url || null, equipment_id]);
    res.status(200).json({ message: "Equipment modified successfully" });
});

// Delete equipment (Admin only)
router.delete("/delete-equipment/:equipment_id", verifyToken, requireAdmin, async (req, res) => {
    const { equipment_id } = req.params;
    const query = "DELETE FROM equipment WHERE equipment_id = ?";
    await executeQuery(query, [equipment_id]);
    res.status(200).json({ message: "Equipment deleted successfully" });
});

module.exports = router;
