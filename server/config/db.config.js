<<<<<<< HEAD
module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "saurabh",
    DB: "webapp",
    dialect: "mysql"
  };
=======
const dotenv = require('dotenv');
dotenv.config()

//Database configurations
module.exports = {
    HOST: process.env.HOST,
    USER: process.env.USERNAME,
    PASSWORD: process.env.PASSWORD,
    DB: process.env.DB,
    dialect : 'mysql'
  };
>>>>>>> 16c43141a5e4d5f8c4531e4705dd8503656f0160
