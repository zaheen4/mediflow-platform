const express = require("express");
const { executeQuery } = require("../utils/db_utils");
const { verifyToken } = require("../utils/auth_utils");
const { requireAdmin } = require("../middleware/auth");
const { NotFoundError } = require("../utils/errors");
const { validateEquipmentData } = require("../utils/validation");

const router = express.Router();

// Fetch all equipment (public route)
router.get("/equipment", async (req, res) => {
    const query = "SELECT * FROM equipment";
    const equipment = await executeQuery(query);
    res.status(200).json(equipment);
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
