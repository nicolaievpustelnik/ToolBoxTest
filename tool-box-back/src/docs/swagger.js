const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// Metadata APIS
const options = {
  failOnErrors: true,
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ToolBoxTest',
      version: '1.0.0',
    },
  },
  apis: ['src/routers/*.routes.js'],
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app, port) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  app.get('/docs.json', (req, res) => {
    res.setHeader('Contemt-Type', 'application/json');
    res.send(swaggerSpec);
  });
}

module.exports = swaggerDocs;