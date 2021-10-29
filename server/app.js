"use strict";
const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const sequelize = require("./model/index");
const User = require("./model/user");
const routes = require("./routes/index");

//reset database
sequelize.sync();

//database connection
sequelize.authenticate().then(()=>{
    console.log("Database Connection Successful");
}).catch(err => {
    if (err) throw err
})

//middleware design
const app = express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors("*"));
app.use(express.json());

// calling routes
routes(app);

//server connection
const port = process.env.PORT || 4000
app.listen(port, () => console.log("Server is listening on port " + port))
