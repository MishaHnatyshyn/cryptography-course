const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';

const encrypt = (data, key) => {
    const result = {};
    Object.keys(data).forEach((field) => {
        const nonce = new Buffer(crypto.randomBytes(16), 'utf8');
        const cipher = crypto.createCipheriv(ALGORITHM, key, nonce);
        let encryptedData = cipher.update(data[field], 'utf8', 'hex');
        encryptedData += cipher.final('hex');
        result[field] = {
            data: encryptedData,
            nonce: nonce.toString('hex'),
            authTag: cipher.getAuthTag().toString('hex')
        }
    })
    return result;
};

const decrypt = (encryptedData, key) => {
    const result = {};
    Object.keys(encryptedData).forEach((field) => {
        const decipher = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(encryptedData[field].nonce, 'hex'));
        decipher.setAuthTag(Buffer.from(encryptedData[field].authTag, 'hex'));
        let decryptedData = decipher.update(encryptedData[field].data, 'hex', 'utf8');
        decryptedData += decipher.final('utf8');
        result[field] = decryptedData;
    })

    return result;
};

module.exports = {
    encrypt,
    decrypt
}