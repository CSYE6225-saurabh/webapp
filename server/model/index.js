const Sequelize = require('sequelize');
const connection = require('../config/db.config')


//Create a database connection
const sqlze = new Sequelize(
  connection.db,
  connection.user,
  connection.password,
  {
    dialect: connection.dialect,
    replication: {
      read:[
        {host: connection.hostReplica}
      ],
      write: {
        host: connection.host
      }
    }
  },
)
module.exports = sqlze;