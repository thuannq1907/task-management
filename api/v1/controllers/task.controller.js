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

  // Sort
  const sort = {};
  if(req.query.sortKey && req.query.sortValue) {
    // add req.query.sortKey vào sort để có thể lấy đc sortKey user gửi lên (chứ k fix cứng)
    sort[req.query.sortKey] = req.query.sortValue;
  }
  // End Sort

  const tasks = await Task.find(find).sort(sort);

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