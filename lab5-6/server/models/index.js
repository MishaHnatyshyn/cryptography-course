const { Sequelize } = require('sequelize');

const { createUserModel } = require('./user.model');
const { createUserDataModel } = require('./userData.model');

const sequelize = new Sequelize(process.env.DB_CONNECTION_STRING)

const UserModel = createUserModel(sequelize)
const UserDataModel = createUserDataModel(sequelize);

UserDataModel.belongsTo(UserModel);

module.exports = {
    sequelize,
    UserModel,
    UserDataModel
}