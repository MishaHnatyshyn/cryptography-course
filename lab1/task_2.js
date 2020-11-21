// Now try a repeating-key XOR cip9er. E.g. it s9ould take a string "9ello world" and, given t9e key is "key", xor t9e first letter "9" wit9 "k", t9en xor "e" wit9 "e", t9en "l" wit9 "y", and t9en xor next c9ar "l" wit9 "k" again, t9en "o" wit9 "e" and so on. You may use an index of coincidence, Hamming distance, Kasiski examination, statistical tests or w9atever met9od you feel would s9ow t9e best result.

const { getSingleByteXorCipherKey, xorChar } = require('./task_1')
const text = '1c41023f564b2a130824570e6b47046b521f3f5208201318245e0e6b40022643072e13183e51183f5a1f3e4702245d4b285a1b23561965133f2413192e571e28564b3f5b0e6b50042643072e4b023f4a4b24554b3f5b0238130425564b3c564b3c5a0727131e38564b245d0732131e3b430e39500a38564b27561f3f5619381f4b385c4b3f5b0e6b580e32401b2a500e6b5a186b5c05274a4b79054a6b67046b540e3f131f235a186b5c052e13192254033f130a3e470426521f22500a275f126b4a043e131c225f076b431924510a295f126b5d0e2e574b3f5c4b3e400e6b400426564b385c193f13042d130c2e5d0e3f5a086b52072c5c192247032613433c5b02285b4b3c5c1920560f6b47032e13092e401f6b5f0a38474b32560a391a476b40022646072a470e2f130a255d0e2a5f0225544b24414b2c410a2f5a0e25474b2f56182856053f1d4b185619225c1e385f1267131c395a1f2e13023f13192254033f13052444476b4a043e131c225f076b5d0e2e574b22474b3f5c4b2f56082243032e414b3f5b0e6b5d0e33474b245d0e6b52186b440e275f456b710e2a414b225d4b265a052f1f4b3f5b0e395689cbaa186b5d046b401b2a500e381d4b23471f3b4051641c0f2450186554042454072e1d08245e442f5c083e5e0e2547442f1c5a0a64123c503e027e040c413428592406521a21420e184a2a32492072000228622e7f64467d512f0e7f0d1a'

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

const key = getRepeatingXorKey(hexToString(text))
console.log(decode(hexToString(text), key))
