const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { userRegister } = require("../controllers/user.controller");

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("must be of atleast 3 characters"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Must be of length 6 characters"),
  ],
  userRegister
);

module.exports = router;