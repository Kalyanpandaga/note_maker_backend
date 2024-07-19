const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const Note = sequelize.define('Note', {
    note_id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    background_colour: {
      type: DataTypes.STRING,
      allowNull: true
    },
    trashed_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    archived_at: {
      type: DataTypes.DATE,
      allowNull: true
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

  return Note;
};