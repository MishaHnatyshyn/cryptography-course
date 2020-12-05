class UserDataService {
    constructor(userDataModel, dataEncryptionService) {
        this.userDataModel = userDataModel;
        this.dataEncryptionService = dataEncryptionService;
    }

    async getUserData(userId) {
        const {email, phone, address} = await this.userDataModel.findOne({where: { UserId: userId }});
        return this.dataEncryptionService.decrypt(userId, {email, phone, address});
    }

    async updateUserData(userId, data) {
        const encryptedData = await this.dataEncryptionService.encrypt(userId, data);
        await this.userDataModel.update(encryptedData, {where: { UserId: userId }});
    };
}

module.exports = UserDataService;