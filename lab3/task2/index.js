const {createAccount, makeBet} = require('../api');
const MersenneTwister = require('mersenne-twister');

const MILLION = 1_000_000;

const getCurrentTime = () => (new Date()).getTime() / 1000;

const getMersenneTwisterGenerator = async (id, prevTime, nextTime) => {
    const response = await makeBet('Mt', id, 1, 0);
    let seed = prevTime;
    let newGeneratedValue = null;
    let generator = null;
    do {
        generator = new MersenneTwister(seed);
        newGeneratedValue = generator.random_int();
        seed++;
    } while (newGeneratedValue !== response.realNumber && seed < nextTime + 1)
    return generator;
}

const becomeMillionaire = async () => {
    const timeBeforeCreating = getCurrentTime();
    const account = await createAccount();
    const timeAfterCreating = getCurrentTime();

    const generator = await getMersenneTwisterGenerator(account.id, timeBeforeCreating, timeAfterCreating);

    let money = 1;
    let bet = null;

    do {
        bet = await makeBet('Mt', account.id, money, generator.random_int());
        money = bet.account.money;
    } while (money < MILLION)

    console.log(bet);
    console.log('Current money: ', money)
}

becomeMillionaire();
