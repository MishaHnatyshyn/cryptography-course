const { getPasswords } = require('./generator');
const { getSha1Hash, getMd5Hash, getBcryptHash } = require('./hash');
const fs = require('fs');
const path = require('path');

const HASHING_SCHEMES = {
    SHA1_WITH_SALT: getSha1Hash,
    MD5: getMd5Hash,
    BCRYPT: getBcryptHash,
}

const createFiles = () => {
    Object.keys(HASHING_SCHEMES).forEach((scheme) => {
        const filename = scheme + '-hash.csv';
        const passwords = getPasswords();
        const data = passwords.map((password, i) => {
            console.log(scheme, i);
            return HASHING_SCHEMES[scheme](password)
        });
        const result = data.join('\n');
        fs.writeFile(path.join(__dirname, filename), result, { encoding: 'utf-8' }, (err, data) => {
            if (err) {
                console.error(err);
            }
        });
    })
}

createFiles();