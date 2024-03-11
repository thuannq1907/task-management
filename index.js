const express = require("express");
require("dotenv").config();
const database = require("./config/database");
const bodyParser = require('body-parser');
const cors = require('cors');

const routesApiVer1 = require("./api/v1/routes/index.route");

database.connect();

const app = express();
const port = process.env.PORT;

// Chỉ cho phép những tên miền cụ thể truy cập
// var corsOptions = {
//   origin: 'http://example.com',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

// app.use(cors(corsOptions));

// Cho phép tất cả tên miền truy cập
app.use(cors());

// parse application/json
app.use(bodyParser.json());

// API Routes
routesApiVer1(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});