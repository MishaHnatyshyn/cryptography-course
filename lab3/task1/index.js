const {createAccount, makeBet} = require('../api');

const MILLION = 1_000_000;
const M = 2 ** 32;

const getPositiveMod = (a, b) => ((a % b) + b) % b;

const extendedGcd = (a, b) => {
    let [oldR, r] = [a, b];
    let [oldS, s] = [1, 0];
    let [oldT, t] = [0, 1];

    while (r !== 0) {
        const quotient = Math.floor(oldR / r);
        [oldR, r] = [r, oldR - quotient * r];
        [oldS, s] = [s, oldS - quotient * s];
        [oldT, t] = [t, oldT - quotient * t];
    }

    return [oldR, oldS];
}

const modInverse = (b, n) => {
    const [gcd, s] = extendedGcd(b, n);
    return gcd === 1 ? getPositiveMod(s, n) : null;
};

const getIsOutOfRange = (value) => Math.abs(value) > 2 ** 31

const calculateNextValue = (a, number, c) => {
    const result = (a * number + c) % M;
    const isOutOfRange = getIsOutOfRange(result);
    if (!isOutOfRange) return result;
    return result > 0 ? result - M : result + M;
}

const getMultiplier = ([first, second, third], m) => {
    const mod = modInverse(second - first, m);
    if (!mod) return null;
    const diff = BigInt((third - second))
    return Number(getPositiveMod(diff * BigInt(mod), BigInt(m)));
}

const getIncrement = ([first, second], a, m) => getPositiveMod(second - first * a, m);

const findParameters = async (id) => {
    const numbers = [];
    for(let i = 0; i < 2; i++) {
        const response = await makeBet('Lcg', id, 1, 0);
        numbers.push(response.realNumber);
    }
    let multiplier = null;

    while(!multiplier) {
        const response = await makeBet('Lcg', id, 1, 0);
        numbers.push(response.realNumber);
        multiplier = getMultiplier(numbers, M);
    }
    const c = getIncrement(numbers.slice(-2), multiplier, M);

    return [multiplier, c, numbers[numbers.length - 1]];
}

const becomeMillionaire = async () => {
    const account = await createAccount();

    const [a, c, lastValue] = await findParameters(account.id);
    let money = 1;
    let number = lastValue;
    let bet = null;

    do {
        number = calculateNextValue(a, number, c);
        bet = await makeBet('Lcg', account.id, money, number);
        money = bet.account.money;
    } while (money < MILLION)

    console.log('Current money: ', money)
}

becomeMillionaire();