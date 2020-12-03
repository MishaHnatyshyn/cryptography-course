const { Sequelize, DataTypes } = require('sequelize');

const createUserModel = (sequelize) => sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    username: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    passwordVersion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    compromised: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'users',
})

module.exports = {
    createUserModel
}