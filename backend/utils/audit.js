const { executeQuery } = require("./db_utils");

async function logAudit({ user_id, action, entity_type, entity_id, details }) {
    try {
        await executeQuery(
            "INSERT INTO audit_log (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)",
            [user_id || null, action, entity_type || null, entity_id || null, details ? JSON.stringify(details) : null]
        );
    } catch (err) {
        // Audit logging should never break the main operation
        console.error("Audit log error:", err.message);
    }
}

module.exports = { logAudit };
