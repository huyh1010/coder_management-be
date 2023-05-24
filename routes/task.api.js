const express = require("express");
const {
  getTasks,
  createTask,
  getSingleTask,
  editTask,
  deleteTask,
} = require("../controllers/task.controller");
const { body, param } = require("express-validator");
const router = express.Router();

/**
 * @route Get  api/tasks
 * @description Get a list of tasks
 * @access private

 */
router.get("/", getTasks);

/**
 * @route Create api/tasks
 * @description Create a task
 * @access private
 * @requiredBody name, description
 */
router.post(
  "/",
  body("name").isString().exists(),
  body("description").isString().exists(),
  createTask
);

/**
 * @route get api/tasks/:id
 * @description Get a single task by id
 *  @access public

 */
router.get("/:id", param("id").exists().isMongoId(), getSingleTask);

/**
 * @route put api/tasks/:id
 * @description Update a single task by id, assign task to user, update status of task
 *  @access private, manager

 */
router.put("/:id", param("id").exists().isMongoId(), editTask);

/**
 * @route delete api/tasks/:id
 * @description delete a single task by id
 *  @access private, manager

 */
router.delete("/:id", param("id").exists().isMongoId(), deleteTask);

module.exports = router;
