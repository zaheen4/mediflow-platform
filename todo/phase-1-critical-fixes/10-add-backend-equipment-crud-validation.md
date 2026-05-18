# Add Backend Equipment CRUD Validation

## Goal
Add input validation to the equipment routes (`add-equipment`, `modify-equipment`) to prevent invalid data from reaching the database.

## Files to Touch
- `backend/routes/equipment_routes.js`

## Current State
Both POST and PUT handlers accept any body and directly insert/update:
```js
const { name, description, price, quantity, image_url } = req.body;
const query = "INSERT INTO equipment (...) VALUES (?, ?, ?, ?, ?)";
```

No validation on:
- Name being required
- Price being a positive number
- Quantity being a non-negative integer

## Steps

1. Open `backend/routes/equipment_routes.js`

2. Add a validation helper at the top of the file (after imports):
```js
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
```

3. Update the `POST /add-equipment` handler:
```js
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
```

4. Update the `PUT /modify-equipment/:equipment_id` handler:
```js
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
        await executeQuery(query, [
            name, description,
            price !== undefined ? parseFloat(price) : undefined,
            quantity !== undefined ? parseInt(quantity) : undefined,
            image_url || null, equipment_id
        ]);
        res.status(200).json({ message: "Equipment modified successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
```

## Verification
- Add equipment with empty name → 400 error
- Add equipment with price -10 → 400 error
- Add equipment with quantity -5 → 400 error
- Add equipment with name > 100 chars → 400 error
- Valid equipment → should work as before
- Modify equipment with invalid price → 400 error
