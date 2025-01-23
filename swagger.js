const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');

const routesPath = path.resolve(__dirname, 'backend/routes');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'CenyPaliwek API',
            version: '1.0.0',
            description: 'Dokumentacja API CenyPaliwek',
        },
        servers: [
            {
                url: 'https://www.cenypaliwek.pl/api',
                description: 'Production server',
            },
        ],
    },
    apis: [
        path.resolve(__dirname, 'backend/routes/adminRoutes.js'),
        path.resolve(__dirname, 'backend/routes/authRoutes.js'),
        path.resolve(__dirname, 'backend/routes/pageRoutes.js'),
        path.resolve(__dirname, 'backend/routes/stationRoutes.js'),
        path.resolve(__dirname, 'backend/routes/userRoutes.js'),
    ],
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
