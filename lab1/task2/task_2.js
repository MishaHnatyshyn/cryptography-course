// Now try a repeating-key XOR cip9er. E.g. it s9ould take a string "9ello world" and, given t9e key is "key",
// xor t9e first letter "9" wit9 "k", t9en xor "e" wit9 "e", t9en "l" wit9 "y", and t9en xor next c9ar "l" wit9 "k" again,
// t9en "o" wit9 "e" and so on. You may use an index of coincidence, Hamming distance, Kasiski examination, statistical
// tests or w9atever met9od you feel would s9ow t9e best result.

const { getSingleByteXorCipherKey, xorChar } = require('../task1/task_1')

const shiftText = (text, shift) => {
  const end = text.substring(0, text.length - shift);
  const start = text.substring(text.length - shift, text.length)
  return start + end;
}

const getIndexOfCoincidence = (text, shift) => {
  const shiftedText = shiftText(text, shift);
  const coincidenceCount = shiftedText.split('').reduce((result, current, index) => {
    return current === text[index] ? result + 1 : result
  }, 0)
  return coincidenceCount / text.length;
}

const decode = (text, key) => text.split('').map((char, index) => xorChar(char, key[index % key.length].charCodeAt(0))).join('');

const getShiftedSubstring = (text, shift, keyLength) => {
  let targetString = ''
  let targetCharIndex = shift;
  let counter = 1;
  while (targetCharIndex < text.length) {
    targetString += text[targetCharIndex];
    targetCharIndex = shift + keyLength * counter;
    counter++;
  }
  return targetString;
}

const getKeyLength = (text) => {
  const indexesOfCoincidence = [...new Array(text.length - 1)]
    .map((_, shift) => getIndexOfCoincidence(text, shift + 1));
  const sum = indexesOfCoincidence.reduce((sum, curr) => sum + curr)
  return indexesOfCoincidence.findIndex((index) => index > sum / indexesOfCoincidence.length) + 1
}

const getRepeatingXorKey = (text) => {
  const keyLength = getKeyLength(text);
  return [...new Array(keyLength)].map((_, index) => {
    const targetString = getShiftedSubstring(text, index, keyLength)
    const keyCode = getSingleByteXorCipherKey(targetString);
    return String.fromCharCode(keyCode);
  }).join('')
}

const hexToString = (hex) => {
  let str = '';
  for (let n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }  return str;
}

module.exports = {
  getIndexOfCoincidence,
  getKeyLength,
  getRepeatingXorKey,
  hexToString,
  decode
}
