const Sequelize = require('sequelize');
const dbConnect = require('./index');
const User = dbConnect.define('User',{
    UserId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    FirstName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    LastName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    UserName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        noUpdate: true
    },
    Password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

module.exports = User;