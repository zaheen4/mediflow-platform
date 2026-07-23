const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const authRoutes = require("./routes/auth_routes");
const equipmentRoutes = require("./routes/equipment_routes");
const orderRoutes = require("./routes/order_routes");
const cartRoutes = require("./routes/cart_routes");
const categoryRoutes = require("./routes/category_routes");
const { notFoundMiddleware, errorMiddleware } = require("./middleware/errorMiddleware");
const logger = require("./utils/logger");

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(",") : ["http://localhost:5173"];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests, please try again later." },
});

app.use(limiter);

app.use(express.json({ limit: "10kb" }));

// Register Blueprints (Modularized Routes)
app.use(authRoutes);
app.use(equipmentRoutes);
app.use(orderRoutes);
app.use(cartRoutes);
app.use(categoryRoutes);

// 404 handler for unmatched routes
app.use(notFoundMiddleware);

// Global error handler (must be last)
app.use(errorMiddleware);

// Run the Express app (only when executed directly, not during tests)
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`);
    });
}

module.exports = app;
