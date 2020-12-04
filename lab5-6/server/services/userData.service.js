class UserDataService {
    constructor(userDataModel, dataEncryptionService) {
        this.userDataModel = userDataModel;
        this.dataEncryptionService = dataEncryptionService;
    }

    async getUserData(userId) {
        const data = await this.userDataModel.findOne({where: { UserId: userId }});
        const metadata = JSON.parse(data.metadata);
        if (Object.keys(metadata).length === 0) {
            return {
                phone: '',
                email: '',
                address: ''
            }
        }

        const dataForDecryption = {};
        Object.keys(metadata).forEach((field) => {
            dataForDecryption[field] = {
                data: data[field],
                nonce: metadata[field].nonce,
                authTag: metadata[field].authTag
            }
        })
        return this.dataEncryptionService.decrypt(userId, dataForDecryption);
    }

    async updateUserData(userId, data) {
        const encryptedData = await this.dataEncryptionService.encrypt(userId, data);
        const metadata = {};
        const dataToSave = {};

        Object.keys(encryptedData).forEach((field) => {
            const {data,...encryptionMetadata} = encryptedData[field];
            dataToSave[field] = data;
            metadata[field] = encryptionMetadata;
        });
        await this.userDataModel.update({...dataToSave, metadata: JSON.stringify(metadata)}, {where: { UserId: userId }});
    };
}

module.exports = UserDataService;