const userModel = require("../models/user.model");
const blackListTokenModel = require("../models/blacklistToken.model");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator");

const userRegister = async (req, res, next) => {
  const errors = validationResult(res);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { fullname, email, password } = req.body;
  const hashedpassword = await userModel.hashPassword(password);
  const user = await userService.createUser({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password: hashedpassword,
  });

  const token = await user.generateAuthToken();
  res.status(201).json({ token, user });
};

const userLogin = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Find the user and include the password field
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not found",
      });
    }

    // Compare the provided password with the stored hash
    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not found",
      });
    }

    // Generate a JWT token
    const token = user.generateAuthToken();
    res.cookie("token", token);

    // Return the user details and token
    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "An unexpected error occurred",
    });
  }
};
const getUserProfile = async (req, res) => {
  res.status(201).json(req.user);
};
const logoutUser = async (req, res) => {
  res.clearCookie("token");
  const token = req.cookie?.token || req.headers.authorization.split(" ")[1];
  await blackListTokenModel.create({ token });
  res.status(200).json({
    message: "Logged out",
  });
};

module.exports = {
  userRegister,
  userLogin,
  getUserProfile,
  logoutUser,
};
