const Task = require("../models/task.model");

// [GET] /api/v1/tasks/
module.exports.index = async (req, res) => {
  const find = {
    deleted: false
  };

  // Filter Status
  if(req.query.status) {
    find.status = req.query.status;
  }
  // End Filter Status

  const tasks = await Task.find(find);

  res.json(tasks);
}

// [GET] /api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
  const id = req.params.id;

  const task = await Task.findOne({
    _id: id,
    deleted: false
  });

  res.json(task);
}