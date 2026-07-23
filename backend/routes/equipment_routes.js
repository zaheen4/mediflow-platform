const express = require("express");
const { executeQuery } = require("../utils/db_utils");
const { verifyToken } = require("../utils/auth_utils");
const { requireAdmin } = require("../middleware/auth");
const { NotFoundError } = require("../utils/errors");
const { validateEquipmentData } = require("../utils/validation");

const router = express.Router();

const equipmentSelect = "e.*, c.name AS category_name";
const equipmentJoin = " LEFT JOIN categories c ON e.category_id = c.category_id";

// Fetch all equipment (public route, supports pagination, search & category filter)
router.get("/equipment", async (req, res) => {
    const { page, limit, search, category } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 0;
    const offset = (pageNum - 1) * limitNum;

    const conditions = [];
    const params = [];
    if (search) {
        conditions.push("(e.name LIKE ? OR e.description LIKE ?)");
        const pattern = `%${search}%`;
        params.push(pattern, pattern);
    }
    if (category) {
        conditions.push("e.category_id = ?");
        params.push(category);
    }

    const whereClause = conditions.length > 0 ? " WHERE " + conditions.join(" AND ") : "";
    const baseQuery = `FROM equipment e${equipmentJoin}${whereClause}`;
    const orderClause = " ORDER BY e.equipment_id";

    const countResult = await executeQuery(`SELECT COUNT(*) AS total ${baseQuery}`, params);
    const total = countResult[0].total;

    let equipment;
    if (limitNum > 0) {
        equipment = await executeQuery(`SELECT ${equipmentSelect} ${baseQuery}${orderClause} LIMIT ? OFFSET ?`, [
            ...params,
            limitNum,
            offset,
        ]);
    } else {
        equipment = await executeQuery(`SELECT ${equipmentSelect} ${baseQuery}${orderClause}`, params);
    }

    if (!page && !limit && !search && !category) {
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
    const equipment = await executeQuery(
        `SELECT ${equipmentSelect} FROM equipment e ${equipmentJoin} WHERE e.equipment_id = ?`,
        [equipment_id]
    );
    if (equipment.length > 0) {
        res.status(200).json(equipment[0]);
    } else {
        throw new NotFoundError("Equipment not found");
    }
});

// Add equipment (Admin only)
router.post("/add-equipment", verifyToken, requireAdmin, async (req, res) => {
    const { name, description, price, quantity, image_url, category_id } = req.body;

    validateEquipmentData({ name, price, quantity });

    const query =
        "INSERT INTO equipment (name, description, price, quantity, image_url, category_id) VALUES (?, ?, ?, ?, ?, ?)";
    await executeQuery(query, [
        name,
        description,
        parseFloat(price),
        parseInt(quantity),
        image_url || null,
        category_id || null,
    ]);
    res.status(201).json({ message: "Equipment added successfully" });
});

// Modify equipment (Admin only)
router.put("/modify-equipment/:equipment_id", verifyToken, requireAdmin, async (req, res) => {
    const { equipment_id } = req.params;
    const { name, description, price, quantity, image_url, category_id } = req.body;

    validateEquipmentData({ name, price, quantity }, true);

    const query =
        "UPDATE equipment SET name = ?, description = ?, price = ?, quantity = ?, image_url = ?, category_id = ? WHERE equipment_id = ?";
    await executeQuery(query, [
        name,
        description,
        price,
        quantity,
        image_url || null,
        category_id || null,
        equipment_id,
    ]);
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
