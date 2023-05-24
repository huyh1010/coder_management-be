const { validationResult } = require("express-validator");
const { sendResponse, AppError } = require("../helpers/utils");
const Task = require("../models/Task");

const taskController = {};

taskController.getTasks = async (req, res, next) => {
  let { page } = req.query;
  page = parseInt(req.query.page) || 1;
  limit = 3;
  try {
    let offset = limit * (page - 1);
    const info = { isDeleted: false };
    let data = await Task.find(info).populate("assignee");
    data = data.slice(offset, offset + limit);
    sendResponse(
      res,
      200,
      true,
      { tasks: data },
      null,
      "Get Tasks Successfully"
    );
  } catch (err) {
    next(err);
  }
};

taskController.createTask = async (req, res, next) => {
  try {
    const info = req.body;
    //express validator
    const result = validationResult(req);
    if (!result.isEmpty()) {
      throw new AppError("400", "Bad Request", "Create user Error!");
    }
    const created = await Task.create(info);
    sendResponse(
      res,
      200,
      true,
      { task: created },
      null,
      "Create Task Successfully"
    );
  } catch (err) {
    next(err);
  }
};

taskController.getSingleTask = async (req, res, next) => {
  try {
    let { id } = req.params;
    const result = validationResult(req);
    if (!result.isEmpty()) {
      throw new AppError("400", "Bad Request", "Get Single Task Error!");
    }
    const singleTask = await Task.findById(id).populate("assignee");
    sendResponse(
      res,
      200,
      true,
      { task: singleTask },
      null,
      "Get Single Task Successfully"
    );
  } catch (err) {
    next(err);
  }
};

taskController.editTask = async (req, res, next) => {
  const { id } = req.params;
  const { ref, status } = req.body;
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      throw new AppError("400", "Bad Request", "Update Single Task Error!");
    }
    let found = await Task.findById(id);
    if (found.status === "done") {
      if (
        req.body.status === "pending" ||
        req.body.status === "working" ||
        req.body.status === "review"
      ) {
        throw new AppError("400", "Invalid Values", "Update Single Task Error");
      }
    } else if (status) {
      found.status = status;
    }

    found.assignee = ref;
    found = await found.save();
    sendResponse(
      res,
      200,
      true,
      { task: found },
      null,
      "Edit Single Task Successfully"
    );
  } catch (err) {
    next(err);
  }
};

taskController.deleteTask = async (req, res, next) => {
  try {
    let { id } = req.params;
    const result = validationResult(req);
    if (!result.isEmpty()) {
      throw new AppError("400", "Bad Request", "Delete Single Task Error!");
    }
    const deleted = await Task.findByIdAndUpdate(id, { isDeleted: true });
    sendResponse(
      res,
      200,
      true,
      { task: deleted },
      null,
      "Delete Single Task Successfully"
    );
  } catch (err) {
    next(err);
  }
};

module.exports = taskController;
