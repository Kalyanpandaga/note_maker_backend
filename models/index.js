const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Import model definition functions
const UserProfileModel = require('./userProfile');
const NoteModel = require('./note');
const TagModel = require('./tag');
const TokenModel = require('./token');

// Define models
const UserProfile = UserProfileModel(sequelize, DataTypes);
const Note = NoteModel(sequelize, DataTypes);
const Tag = TagModel(sequelize, DataTypes);
const Token = TokenModel(sequelize, DataTypes);

// Associations
UserProfile.hasOne(Token, { foreignKey: 'user_id' });
Token.belongsTo(UserProfile, { foreignKey: 'user_id' });

UserProfile.hasMany(Note, { foreignKey: 'user_id' });
Note.belongsTo(UserProfile, { foreignKey: 'user_id' });

Note.belongsToMany(Tag, { through: 'NoteTags', foreignKey: 'note_id' });
Tag.belongsToMany(Note, { through: 'NoteTags', foreignKey: 'tag_id' });

module.exports = {
  UserProfile,
  Note,
  Tag,
  Token,
  sequelize,
  Sequelize
};