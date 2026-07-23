const express = require("express");
const { executeQuery } = require("../utils/db_utils");
const { verifyToken } = require("../utils/auth_utils");
const { requireAdmin } = require("../middleware/auth");
const { NotFoundError } = require("../utils/errors");

const router = express.Router();

// Get all categories
router.get("/categories", async (req, res) => {
    const categories = await executeQuery("SELECT * FROM categories ORDER BY name");
    res.status(200).json(categories);
});

// Get single category
router.get("/categories/:id", async (req, res) => {
    const { id } = req.params;
    const categories = await executeQuery("SELECT * FROM categories WHERE category_id = ?", [id]);
    if (categories.length === 0) throw new NotFoundError("Category not found");
    res.status(200).json(categories[0]);
});

// Create category (Admin only)
router.post("/categories", verifyToken, requireAdmin, async (req, res) => {
    const { name, description } = req.body;
    if (!name || name.trim().length === 0) {
        return res.status(400).json({ error: "Category name is required" });
    }
    const result = await executeQuery("INSERT INTO categories (name, description) VALUES (?, ?)", [
        name.trim(),
        description || null,
    ]);
    res.status(201).json({ message: "Category created", category_id: result.insertId });
});

// Update category (Admin only)
router.put("/categories/:id", verifyToken, requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    if (!name || name.trim().length === 0) {
        return res.status(400).json({ error: "Category name is required" });
    }
    const result = await executeQuery("UPDATE categories SET name = ?, description = ? WHERE category_id = ?", [
        name.trim(),
        description || null,
        id,
    ]);
    if (result.affectedRows === 0) throw new NotFoundError("Category not found");
    res.status(200).json({ message: "Category updated" });
});

// Delete category (Admin only)
router.delete("/categories/:id", verifyToken, requireAdmin, async (req, res) => {
    const { id } = req.params;
    const result = await executeQuery("DELETE FROM categories WHERE category_id = ?", [id]);
    if (result.affectedRows === 0) throw new NotFoundError("Category not found");
    res.status(200).json({ message: "Category deleted" });
});

module.exports = router;
