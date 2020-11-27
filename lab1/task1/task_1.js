const { ALPHABET, FREQUENCY_TABLE } = require('../constants')

const decode = (text, key) => text.split('').map(char => xorChar(char, key)).join('');

const xor = (char, key) => char.charCodeAt(0) ^ key;

const xorChar = (char, key) => String.fromCharCode(xor(char, key));

const KEY_LENGTH = 256;

const getSingleByteXorCipherKey = (text) => [...new Array(KEY_LENGTH - 1)].map((_, key) => {
    const decoded = decode(text, key + 1);
    const result = ALPHABET.reduce((sum, curr ) => {
        const frequency = decoded.split('').filter(char => char === curr).length / decoded.length;
        return sum + Math.abs(frequency - FREQUENCY_TABLE[curr])
    }, 0)
    return { key: key + 1, result };
}).sort((a, b) => a.result - b.result)[0].key;


module.exports = {
    getSingleByteXorCipherKey, xorChar, decode
}
