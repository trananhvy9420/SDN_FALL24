const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/auth.controller.js");
authRouter.route("/").post(authController.signIn);
module.exports = authRouter;
