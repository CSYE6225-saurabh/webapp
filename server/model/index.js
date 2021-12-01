const Sequelize = require('sequelize');
const connection = require('../config/db.config')


//Create a database connection
const sqlze = new Sequelize(
  connection.DB,
  connection.USER,
  connection.PASSWORD,
  {
    dialect: connection.dialect,
    replication: {
      read:[
        {host: connection.HOSTREADREPLICA}
      ],
      write: {
        host: connection.HOST
      }
    }
  },
)
module.exports = sqlze;