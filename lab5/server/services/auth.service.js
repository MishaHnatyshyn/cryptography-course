const { UserAlreadyExistsError, WrongCredentialsError, ValidationError } = require('./auth.errors');

class AuthService {
    constructor(userModel, hashService) {
        this.userModel = userModel;
        this.hashService = hashService;
    }

    async createUser(username, password) {
        const exitingUser = await this.userModel.findOne({ where: {username} })
        if (exitingUser) {
            throw new UserAlreadyExistsError('User with provided username already exists')
        }
        const hashedPassword = await this.hashService.hash(password);
        const user = await this.userModel.create({ username, password: hashedPassword });
        return { id: user.id, username: user.username};
    }

    async validateUserCredentials(username, password) {
        const user = await this.userModel.findOne({ where: { username }, attributes: ['id', 'username']})
        if (!user) {
            throw new WrongCredentialsError('No user found with provided username')
        }

        const isPasswordCorrect = this.hashService.compare(password, user.password);
        if (!isPasswordCorrect) {
            throw WrongCredentialsError('Password is wrong');
        }
        return user;
    }

    validatePassword(password) {
        if (password.length < 8) {
            throw ValidationError('Min password length is 8!')
        }
        if (!/[A-Z]/.test(password)) {
            throw ValidationError('At least one capital letter is required')
        }
        if (!/[a-z]/.test(password)) {
            throw ValidationError('At least one small letter is required')
        }
        if (!/[0-9]/.test(password)) {
            throw ValidationError('At least one number is required')
        }
        if (!/[\!\@\#\$\%\^\&\*\(\)\_\+\{\}\[\]\:\;]/.test(password)) {
            throw ValidationError('At least one special character is required')
        }
    }
}

module.exports = AuthService;