const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.KEY_STORAGE_DB_CONNECTION_STRING, { logging: false });

const KeyStorageModel = sequelize.define('KeyStorage', {
    userId: {
        type: DataTypes.UUID,
        primaryKey: true
    },
    DEK: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'key_storage',
})


module.exports = {
    KeyStorageModel,
    keyStorageConnection: sequelize
}