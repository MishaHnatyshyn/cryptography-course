const { Sequelize, DataTypes } = require('sequelize');

const createUserDataModel = (sequelize) => sequelize.define('UserData', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    phone: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    email: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    metadata: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    tableName: 'user_data',
})

module.exports = {
    createUserDataModel
}