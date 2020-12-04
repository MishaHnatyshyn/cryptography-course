const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config({ path: path.join(__dirname, '.env')})

const AuthService = require('./services/auth.service');
const HashService = require('./services/hash.service');
const DataEncryptionService = require('./services/dataEncryption.service');
const UserDataService = require('./services/userData.service');
const AuthController = require("./controllers/auth.controller");
const UserDataController = require('./controllers/userData.controller');
const { sequelize, UserModel, UserDataModel } = require('./models/');
const {keyStorageConnection, KeyStorageModel} = require('./models/keyStorage.model');

const app = express()
const PORT = 8080;

app.use(cors())
app.use(express.json())

const hashService = new HashService()
const authService = new AuthService(UserModel, hashService, UserDataModel);
const dataEncryptionService = new DataEncryptionService(KeyStorageModel);
const userDataService = new UserDataService(UserDataModel, dataEncryptionService);
const authController = new AuthController(authService);
const userDataController = new UserDataController(userDataService, authService);

app.post('/login', authController.login);
app.post('/register', authController.register);
app.put('/user', userDataController.updateData);
app.post('/user', userDataController.getData);

(async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        await keyStorageConnection.authenticate();
        await keyStorageConnection.sync();
        app.listen(PORT, () => console.log('Server has been started on port: ', PORT))
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})()