const express = require("express");
require("dotenv").config();
const database = require("./config/database");

const Task = require("./models/task.model");

database.connect();

const app = express();
const port = process.env.PORT;

app.get("/tasks", async (req, res) => {
  const tasks = await Task.find({
    deleted: false
  });

  res.json(tasks);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});