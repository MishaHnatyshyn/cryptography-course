const {getRequest} = require('./request');
const uuid = require('uuid');
const ACCOUNT_PATH = '/casino/createacc';
const BET_BASE_PATH = '/casino/play';

const ID = uuid.v4();

const createAccount = () => {
    const queryParams = {
        id: ID
    }
    return getRequest(ACCOUNT_PATH, queryParams);
}

const makeBet = (mode, accountId, bet, number) => {
    const betPath = `${BET_BASE_PATH}${mode}`;
    const queryParams = {
        id: accountId,
        bet,
        number
    }

    return getRequest(betPath, queryParams)
}

module.exports = {
    createAccount, makeBet
}