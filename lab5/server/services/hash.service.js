const argon2 = require('argon2');
const { SHA3 } = require('sha3');

class HashService {
    getSha3Digest(password) {
        return new SHA3(512).update(password).digest('hex');
    }

    async compare(text, hashedText) {
        const digest = this.getSha3Digest(text)
        try {
            await argon2.verify(digest, hashedText);
            return true
        } catch (e) {
            return false
        }
    }

    async hash(text) {
        const sha2Digest = this.getSha3Digest(text)
        return argon2.hash(sha2Digest);
    }
}

module.exports = HashService;