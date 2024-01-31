const express = require("express");
const cors = require("cors");
require('dotenv').config();

// Initialization
const app = express();

// Configuration
app.set("port", process.env.PORT || 3000);

// cors middleware
app.use(cors());

// Swagger Documentation
const swaggerDocs = require('../docs/swagger');
swaggerDocs(app, app.get('port'))

// Routes
app.use(require("../routers/file.routes"));

module.exports = app;
