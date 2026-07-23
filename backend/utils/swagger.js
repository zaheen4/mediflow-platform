const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "MediFlow API",
            version: "1.0.0",
            description: "Medical equipment e-commerce platform API",
        },
        servers: [{ url: "http://localhost:5000", description: "Development" }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },
    apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };
