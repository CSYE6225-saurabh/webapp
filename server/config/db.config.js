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
