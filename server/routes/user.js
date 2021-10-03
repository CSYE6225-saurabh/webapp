const express = require('express');
const userController = require('../controller/userController');
const userRouter = express.Router();

//create routes
userRouter.route("/self")
    .get(userController.getUser)
    .put(userController.editUser);

userRouter.route("/")
    .post(userController.saveUser);

module.exports = userRouter;