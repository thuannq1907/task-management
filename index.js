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

app.get("/tasks/detail/:id", async (req, res) => {
  const id = req.params.id;

  const task = await Task.findOne({
    _id: id,
    deleted: false
  });

  res.json(task);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});