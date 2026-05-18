const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth_routes');
const equipmentRoutes = require('./routes/equipment_routes');

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Register Blueprints (Modularized Routes)
app.use(authRoutes);
app.use(equipmentRoutes);

// Run the Express app
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
