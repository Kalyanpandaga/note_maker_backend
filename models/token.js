const { v4: uuidv4 } = require('uuid');
module.exports = (sequelize, DataTypes) => {
    const Token = sequelize.define('Token', {
      token_id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true
      },
      access_token: {
        type: DataTypes.STRING,
        allowNull: false
      },
      refresh_token: {
        type: DataTypes.STRING,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'UserProfiles',
          key: 'user_id'
        }
      }
    }, {
      timestamps: true
    });
  
    return Token;
  };