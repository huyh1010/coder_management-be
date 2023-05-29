const { sendResponse, AppError } = require("../helpers/utils");
const Task = require("../models/Task");
const User = require("../models/User");
const { validationResult } = require("express-validator");

const userController = {};

userController.getUsers = async (req, res, next) => {
  let { page, limit } = req.query;
  page = parseInt(req.query.page) || 1;
  limit = parseInt(req.query.limit) || 10;
  try {
    let offset = limit * (page - 1);
    let { name } = req.query;
    let data = "";
    const info = {};
    if (name) {
      data = await User.find({ name: name });
    } else {
      data = await User.find(info);
    }

    data = data.slice(offset, offset + limit);

    sendResponse(
      res,
      200,
      true,
      { user: data },
      null,
      name ? "Get User with Name Successfully" : "Get Users Successfully"
    );
  } catch (err) {
    next(err);
  }
};

userController.getSingleUser = async (req, res, next) => {
  try {
    let { id } = req.params;

    const result = validationResult(req);
    if (!result.isEmpty()) {
      throw new AppError("400", "Bad Request", "Get Single User Error!");
    }
    // find task lists that are assigned to this id user
    const taskLists = await Task.find({ assignee: id });
    // find the user through id
    let singleUser = await User.findById(id);
    // add task lists to the tasks field in user document
    singleUser.tasks = taskLists;
    singleUser = await singleUser.save();
    sendResponse(
      res,
      200,
      true,
      singleUser,
      null,
      "Get Single User Successfully"
    );
  } catch (err) {
    next(err);
  }
};

userController.createUser = async (req, res, next) => {
  try {
    const info = req.body;
    //express validator
    const result = validationResult(req);
    if (!result.isEmpty()) {
      throw new AppError("400", "Bad Request", "Create user Error!");
    }

    const name = await User.findOne({ name: info.name });
    if (name) {
      throw new AppError("400", "Bad Request", "User already exist!");
    } else {
      const created = await User.create(info);
      sendResponse(
        res,
        200,
        true,
        { user: created },
        null,
        "Create User Successfully"
      );
    }
  } catch (err) {
    next(err);
  }
};

module.exports = userController;
