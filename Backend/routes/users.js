const express = require('express');
const { signup, verificationEmail, login, changePassword, forgetPassword, resetPassword, getUserById } = require('../controllers/userController');
const auth = require('../middleware/auth');
const userRouter = express.Router();

// Signup
userRouter.post("/signup", signup);

// OTP verification email
userRouter.post("/sent-otp", verificationEmail);

// Login
userRouter.post("/login", login);

// Change password
userRouter.post("/change-password", auth, changePassword);

// Forget password
userRouter.post("/forget-password", forgetPassword);

// Reset password
userRouter.post("/reset-password/:token", resetPassword);

// Get user by id
userRouter.get("/get-user/:token", getUserById);

module.exports = userRouter;