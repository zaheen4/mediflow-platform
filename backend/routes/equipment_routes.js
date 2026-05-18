const express = require('express');
const { executeQuery } = require('../utils/db_utils');
const { verifyToken } = require('../utils/auth_utils');

const router = express.Router();

function validateEquipment(data, isUpdate = false) {
    if (!isUpdate && (!data.name || data.name.trim().length === 0)) {
        return "Equipment name is required";
    }

    if (data.name && data.name.length > 100) {
        return "Equipment name must be under 100 characters";
    }

    if (data.price !== undefined) {
        const price = parseFloat(data.price);
        if (isNaN(price) || price < 0) {
            return "Price must be a non-negative number";
        }
    }

    if (data.quantity !== undefined) {
        const qty = parseInt(data.quantity);
        if (isNaN(qty) || qty < 0) {
            return "Quantity must be a non-negative integer";
        }
    }

    return null;
}

// Fetch all equipment (public route)
router.get('/equipment', async (req, res) => {
    try {
        const query = "SELECT * FROM equipment";
        const equipment = await executeQuery(query);
        res.status(200).json(equipment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Fetch details of a specific equipment (public route)
router.get('/equipment/:equipment_id', async (req, res) => {
    const { equipment_id } = req.params;
    try {
        const query = "SELECT * FROM equipment WHERE equipment_id = ?";
        const equipment = await executeQuery(query, [equipment_id]);
        if (equipment.length > 0) {
            res.status(200).json(equipment[0]);
        } else {
            res.status(404).json({ error: "Equipment not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add equipment (Admin only)
router.post('/add-equipment', verifyToken, async (req, res) => {
    if (req.user.role !== "Admin") {
        return res.status(403).json({ error: "Access denied" });
    }

    const { name, description, price, quantity, image_url } = req.body;

    const validationError = validateEquipment({ name, price, quantity });
    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    try {
        const query = "INSERT INTO equipment (name, description, price, quantity, image_url) VALUES (?, ?, ?, ?, ?)";
        await executeQuery(query, [name, description, parseFloat(price), parseInt(quantity), image_url || null]);
        res.status(201).json({ message: "Equipment added successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Modify equipment (Admin only)
router.put('/modify-equipment/:equipment_id', verifyToken, async (req, res) => {
    if (req.user.role !== "Admin") {
        return res.status(403).json({ error: "Access denied" });
    }

    const { equipment_id } = req.params;
    const { name, description, price, quantity, image_url } = req.body;

    const validationError = validateEquipment({ name, price, quantity }, true);
    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    try {
        const query = `
            UPDATE equipment
            SET name = ?, description = ?, price = ?, quantity = ?, image_url = ?
            WHERE equipment_id = ?
        `;
        await executeQuery(query, [name, description, price, quantity, image_url || null, equipment_id]);
        res.status(200).json({ message: "Equipment modified successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete equipment (Admin only)
router.delete('/delete-equipment/:equipment_id', verifyToken, async (req, res) => {
    if (req.user.role !== "Admin") {
        return res.status(403).json({ error: "Access denied" });
    }

    const { equipment_id } = req.params;
    try {
        const query = "DELETE FROM equipment WHERE equipment_id = ?";
        await executeQuery(query, [equipment_id]);
        res.status(200).json({ message: "Equipment deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
