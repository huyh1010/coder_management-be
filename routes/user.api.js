const express = require("express");
const {
  getUsers,
  getSingleUser,
  createUser,
} = require("../controllers/user.controller");
const { body, param } = require("express-validator");
const router = express.Router();

/**
 * @route Get api/users
 * @description Get a list of users
 * @access private
 * @allowedQueries: name
 */
router.get("/", getUsers);

/**
 * @route GET api/users/:id
 * @description Get user by id
 * @access public
 */
router.get("/:id", param("id").exists().isMongoId(), getSingleUser);

/**
 * @route POST api/users
 * @description Create a new user
 * @access private, manager
 * @requiredBody: name
 */
router.post("/", body("name").exists().isString(), createUser);

module.exports = router;
