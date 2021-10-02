const express = require('express');
const userController = require('../controller/userController');

const userRouter = express.Router();

// userRouter.route("/self")
//     .get(userController.getAll)
//     .put(userController.editUser);

userRouter.route("/")
    .post(userController.saveUser);

// userRouter.route("/")
//     .delete(userController.deleteUser);

module.exports = userRouter;