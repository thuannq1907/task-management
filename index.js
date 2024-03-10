const express = require("express");
require("dotenv").config();
const database = require("./config/database");

const routesApiVer1 = require("./api/v1/routes/index.route");

database.connect();

const app = express();
const port = process.env.PORT;

// API Routes
routesApiVer1(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});