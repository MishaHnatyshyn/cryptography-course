const argon2 = require('argon2');
const { SHA3 } = require('sha3');

class HashService {
    getDigest(password) {
        return new SHA3(512).update(password).digest('hex');
    }

    async compare(text, hashedText) {
        const digest = this.getDigest(text)
        try {
            await argon2.verify(digest, hashedText);
            return true
        } catch (e) {
            return false
        }
    }

    async hash(text) {
        const digest = this.getDigest(text)
        return argon2.hash(digest);
    }
}

module.exports = HashService;