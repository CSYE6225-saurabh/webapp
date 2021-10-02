const Sequelize = require('sequelize');
const connection = require('../config/db.config')
const sqlze = new Sequelize(
  connection.DB,
  connection.USER,
  connection.PASSWORD,
  {
    dialect: connection.dialect,
    host: connection.host,
    define: {
      timestamp : false
    }
  },

)
module.exports = sqlze;