const { ValidationError } = require("./errors");

function requireFields(body, fields) {
    for (const field of fields) {
        if (
            body[field] === undefined ||
            body[field] === null ||
            (typeof body[field] === "string" && body[field].trim() === "")
        ) {
            throw new ValidationError(`Field '${field}' is required`);
        }
    }
}

function validateUsername(username) {
    if (!username || username.length < 3 || username.length > 50) {
        throw new ValidationError("Username must be between 3 and 50 characters");
    }
}

function validatePassword(password) {
    if (!password || password.length < 6) {
        throw new ValidationError("Password must be at least 6 characters");
    }
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        throw new ValidationError("Invalid email format");
    }
}

function validateEquipmentData(data, isUpdate = false) {
    if (!isUpdate && (!data.name || data.name.trim().length === 0)) {
        throw new ValidationError("Equipment name is required");
    }

    if (data.name && data.name.length > 100) {
        throw new ValidationError("Equipment name must be under 100 characters");
    }

    if (data.price !== undefined) {
        const price = parseFloat(data.price);
        if (isNaN(price) || price < 0) {
            throw new ValidationError("Price must be a non-negative number");
        }
    }

    if (data.quantity !== undefined) {
        const qty = parseInt(data.quantity);
        if (isNaN(qty) || qty < 0) {
            throw new ValidationError("Quantity must be a non-negative integer");
        }
    }
}

function validateOrderItems(items) {
    if (!items || !Array.isArray(items) || items.length === 0) {
        throw new ValidationError("Order must contain at least one item");
    }

    for (const item of items) {
        if (!item.equipment_id || !item.quantity || item.quantity <= 0) {
            throw new ValidationError("Invalid item data");
        }
    }
}

module.exports = {
    requireFields,
    validateUsername,
    validatePassword,
    validateEmail,
    validateEquipmentData,
    validateOrderItems,
};
