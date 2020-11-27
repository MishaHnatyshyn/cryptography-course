const {createAccount, makeBet} = require('../api');
const MersenneTwister = require('mersenne-twister');

const MILLION = 1_000_000;
const MERSENNE_TWISTER_STATES_COUNT = 624;
const BIT_SIZE = 32;

const retrieveStates = async (accountId) => {
    const numbers = [];
    for (let i = 0; i < MERSENNE_TWISTER_STATES_COUNT; i++) {
        const response = await makeBet('BetterMt', accountId, 1, 0);
        numbers.push(response.realNumber)
        console.log('bet:', i);
    }
    return numbers;
}

const unBitshiftRightXor = (value,shift) => {
    let result = 0;
    for (let i = 0; i < BIT_SIZE; i++) {
        result = value ^ result >>> shift
    }
    return result;
}

const unBitshiftLeftXor = (value, shift, mask) => {
    let result = 0;
    for (let i = 0; i < BIT_SIZE; i++) {
        result = (result << shift & mask) ^ value
    }
    return result;
}

const untemper = (value) => {
    let untemperedValue = value;
    untemperedValue = unBitshiftRightXor(untemperedValue, 18);
    untemperedValue = unBitshiftLeftXor(untemperedValue, 15, 0xefc60000);
    untemperedValue = unBitshiftLeftXor(untemperedValue, 7, 0x9d2c5680);
    untemperedValue = unBitshiftRightXor(untemperedValue, 11);
    return untemperedValue
}

const createHackedGenerator = function* (states) {
    const hackedStates = states.map(untemper)
    const generator = new MersenneTwister();

    generator.mt = hackedStates;

    while (true) {
        yield generator.random_int();
    }
}

const becomeMillionaire = async () => {
    const account = await createAccount();
    const states = await retrieveStates(account.id);
    const generator = createHackedGenerator(states);

    let money = 325;
    let bet = null;

    do {
        const number = generator.next().value;
        bet = await makeBet('BetterMt', account.id, money, number);
        money = bet.account.money;
    } while (money < MILLION)

    console.log(bet);
    console.log('Current money: ', money)
}

becomeMillionaire();
