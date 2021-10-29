const Sequelize = require('sequelize');
const dbConnect = require('./index');

const Image = dbConnect.define(
    "Image",
    { 
      id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: true
      },
      file_name: {
          type: Sequelize.STRING,
          allowNull: false
      },
      url: {
          type: Sequelize.STRING,
          allowNull: false
      },
      userID: {
          type: Sequelize.UUID,
          foreignKey: true,
          allowNull: false
      }
    },
    {
      timestamp: true
    }
  );
Image.associate = function (models) {
    Image.belongsTo(models.User, {
        onDelete: "cascade",
        as: "ProfileImage",
        foreignKey: "userID",
    });
};
module.exports = Image;