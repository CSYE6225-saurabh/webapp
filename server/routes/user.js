const express = require('express');
const userController = require('../controller/userController');

const userRouter = express.Router();

userRouter.route("/self")
    .get(userController.getUser)
//     .put(userController.editUser);

userRouter.route("/")
    .post(userController.saveUser);

// userRouter.route("/del")
//     .delete(userController.deleteUser);

module.exports = userRouter;