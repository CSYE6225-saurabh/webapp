const express = require('express');
const userController = require('../controller/userController');
const imageController = require('../controller/imageupload');
const userRouter = express.Router();
const multer = require('multer');
const upload = multer({dest: 'uploads/'});

//create routes
userRouter.route("/self")
    .get(userController.getUser)
    .put(userController.editUser);

userRouter.route("/")
    .post(userController.saveUser);
userRouter.route("/image")
    .post(upload.single('image'),imageController.imageUpload)
    .get(imageController.getImage)
    .delete(imageController.deleteImage);
module.exports = userRouter;