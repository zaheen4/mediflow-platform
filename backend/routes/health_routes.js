const express = require("express");
const { executeQuery } = require("../utils/db_utils");

const router = express.Router();

router.get("/health", async (req, res) => {
    let dbStatus = "connected";
    try {
        await executeQuery("SELECT 1");
    } catch {
        dbStatus = "disconnected";
    }

    res.status(200).json({
        status: "ok",
        db: dbStatus,
        uptime: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
    });
});

module.exports = router;
