const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config({ path: path.join(__dirname, '.env')})

const AuthService = require('./services/auth.service');
const HashService = require('./services/hash.service');
const AuthController = require("./controllers/auth.controller");
const { sequelize, UserModel } = require('./models/')

const app = express()
const PORT = 8080;

app.use(cors())
app.use(express.json())

const hashService = new HashService()
const authService = new AuthService(UserModel, hashService);
const authController = new AuthController(authService);

app.post('/login', authController.login);
app.post('/register', authController.register);

(async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log('Server has been started on port: ', PORT))
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})()