const express = require('express');
const userController = require('../controller/userController');
const verifyRoute = express.Router();

verifyRoute.route("/")
    .get(userController.verifyUser);

module.exports = verifyRoute;