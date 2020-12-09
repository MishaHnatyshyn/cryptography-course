const bcrypt = require('bcrypt');
const crypto = require('crypto');

const getSha1Hash = (data) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const sha1sum = crypto.createHash('md5');
    sha1sum.update(data + salt);
    return `${sha1sum.digest('hex')},${salt}`
}

const getMd5Hash = (data) => {
    const md5sum = crypto.createHash('md5');
    md5sum.update(data);
    return md5sum.digest('hex');
}

const getBcryptHash = (data) => {
    return bcrypt.hashSync(data, 16)
}

module.exports = {
    getBcryptHash,
    getMd5Hash,
    getSha1Hash
}