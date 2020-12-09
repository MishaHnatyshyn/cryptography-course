const fs = require('fs');
const path = require('path');

const SYMBOLS = '!@#$%^&*()_+-=';
const LETTERS_TO_NUMBERS_MAP = {
    'l': 1,
    'i': 1,
    'o': 0,
    's': 5,
}
const PASSWORDS_AMOUNT = 100_000;
const commonPasswords = fs.readFileSync(path.join(__dirname, 'data', 'common-passwords.txt'), 'utf8').split('\n');
const mostCommonPasswords = fs.readFileSync(path.join(__dirname, 'data', 'top-100-passwords.txt'), 'utf8').split('\n');
const commonWords = fs.readFileSync(path.join(__dirname, 'data', 'common-words.txt'), 'utf8').split('\n');

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const getRandomYear = () => getRandomInt(1980, 2020);

const generateTheMostCommonPassword = () => {
    const passwordIndex = getRandomInt(0, mostCommonPasswords.length - 1);
    return mostCommonPasswords[passwordIndex];
}

const generateCommonPassword = () => {
    const passwordIndex = getRandomInt(0, commonPasswords.length - 1);
    return commonPasswords[passwordIndex];
}

const generateRandomPassword = () => {
    const passLength = getRandomInt(5, 16);
    return new Array(passLength).fill(0).map(() => String.fromCharCode(getRandomInt(32, 126))).join('');
}

const getRandomWord = () => {
    const wordIndex = getRandomInt(0, commonWords.length - 1);
    return commonWords[wordIndex]
}

const replaceLetterWithUpperCase = (string, index) => {
    const letter = string[index].toUpperCase();
    const stringArray = string.split('');
    stringArray.splice(index, 1, letter);
    return stringArray.join('')
}

const generateHumanLikePassword = () => {
    let password = getRandomWord();
    if (password.length < 5) {
        password += getRandomWord();
    }

    if (Math.random() > 0.75) {
        const year = getRandomYear();
        password = Math.random() > .5 ? year + password : password + year;
    }

    if (Math.random() > 0.3 && password.length < 8) {
        const numbersCount = getRandomInt(1, 4);
        const numbers = new Array(numbersCount).fill(0).map(() => getRandomInt(0, 9)).join('');
        password = Math.random() > .5 ? numbers + password : password + numbers;
    }

    if (Math.random() > 0.4) {
        const letterIndex = getRandomInt(0, 3);
        const letterToReplace = Object.keys(LETTERS_TO_NUMBERS_MAP)[letterIndex];
        const regExp = new RegExp(letterToReplace, 'gi');
        password = password.replace(regExp, LETTERS_TO_NUMBERS_MAP[letterToReplace]);
    }

    if (Math.random() > 0.6) {
        const symbolIndex = getRandomInt(0, SYMBOLS.length - 1);
        password += SYMBOLS[symbolIndex];
    }

    if (Math.random() > 0.5) {
        const count = getRandomInt(1 ,4);
        new Array(count).fill(0).forEach(() => {
            const index = getRandomInt(0, password.length - 1);
            password = replaceLetterWithUpperCase(password, index)
        })
    }

    return password;
}

const generatePasswordsSet = (count, fn) => {
    return new Array(count).fill(0).map(fn)
}

const getPasswords = () => {
    const passwords = [];
    const mostCommonPasswordsCount = getRandomInt(0.05 * PASSWORDS_AMOUNT, 0.1 * PASSWORDS_AMOUNT);
    passwords.push(generatePasswordsSet(mostCommonPasswordsCount, generateTheMostCommonPassword))

    const commonPasswordsCount = getRandomInt(0.5 * PASSWORDS_AMOUNT, 0.9 * PASSWORDS_AMOUNT)
    passwords.push(generatePasswordsSet(commonPasswordsCount, generateCommonPassword))

    const randomPasswordsCount = getRandomInt(0.01 * PASSWORDS_AMOUNT, 0.05 * PASSWORDS_AMOUNT);
    passwords.push(generatePasswordsSet(Math.min(randomPasswordsCount, PASSWORDS_AMOUNT - passwords.flat().length), generateRandomPassword))

    const humanLikePasswordsCount = PASSWORDS_AMOUNT - passwords.flat().length;
    passwords.push(generatePasswordsSet(humanLikePasswordsCount, generateHumanLikePassword))

    return passwords.flat().sort(() => Math.random() > 0.5 ? -1 : 1);
}

module.exports = {
    getPasswords
}