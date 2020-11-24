const {getKeyLength} = require('../lab1/task_2')
const { generateInitialPopulation, UPPER_CASE_ALPHABET } = require('../lab1/task_3');
const GENERATIONS_COUNT = 1000;
const POPULATION_SIZE = 200;
const WorkerPool = require('./worker_pool')
const os = require('os')

const text = 'KZBWPFHRAFHMFSNYSMNOZYBYLLLYJFBGZYYYZYEKCJVSACAEFLMAJZQAZYHIJFUNHLCGCINWFIHHHTLNVZLSHSVOZDPYSMNYJXHMNODNHPATXFWGHZPGHCVRWYSNFUSPPETRJSIIZSAAOYLNEENGHYAMAZBYSMNSJRNGZGSEZLNGHTSTJMNSJRESFRPGQPSYFGSWZMBGQFBCCEZTTPOYNIVUJRVSZSCYSEYJWYHUJRVSZSCRNECPFHHZJBUHDHSNNZQKADMGFBPGBZUNVFIGNWLGCWSATVSSWWPGZHNETEBEJFBCZDPYJWOSFDVWOTANCZIHCYIMJSIGFQLYNZZSETSYSEUMHRLAAGSEFUSKBZUEJQVTDZVCFHLAAJSFJSCNFSJKCFBCFSPITQHZJLBMHECNHFHGNZIEWBLGNFMHNMHMFSVPVHSGGMBGCWSEZSZGSEPFQEIMQEZZJIOGPIOMNSSOFWSKCRLAAGSKNEAHBBSKKEVTZSSOHEUTTQYMCPHZJFHGPZQOZHLCFSVYNFYYSEZGNTVRAJVTEMPADZDSVHVYJWHGQFWKTSNYHTSZFYHMAEJMNLNGFQNFZWSKCCJHPEHZZSZGDZDSVHVYJWHGQFWKTSNYHTSZFYHMAEDNJZQAZSCHPYSKXLHMQZNKOIOKHYMKKEIKCGSGYBPHPECKCJJKNISTJJZMHTVRHQSGQMBWHTSPTHSNFQZKPRLYSZDYPEMGZILSDIOGGMNYZVSNHTAYGFBZZYJKQELSJXHGCJLSDTLNEHLYZHVRCJHZTYWAFGSHBZDTNRSESZVNJIVWFIVYSEJHFSLSHTLNQEIKQEASQJVYSEVYSEUYSMBWNSVYXEIKWYSYSEYKPESKNCGRHGSEZLNGHTSIZHSZZHCUJWARNEHZZIWHZDZMADNGPNSYFZUWZSLXJFBCGEANWHSYSEGGNIVPFLUGCEUWTENKCJNVTDPNXEIKWYSYSFHESFPAJSWGTYVSJIOKHRSKPEZMADLSDIVKKWSFHZBGEEATJLBOTDPMCPHHVZNYVZBGZSCHCEZZTWOOJMBYJSCYFRLSZSCYSEVYSEUNHZVHRFBCCZZYSEUGZDCGZDGMHDYNAFNZHTUGJJOEZBLYZDHYSHSGJMWZHWAFTIAAY';

const generateInitialPopulations = (size, alphabetsCount) => {
    return [...new Array(alphabetsCount)].map(() => generateInitialPopulation(size))
}

const workerPool = new WorkerPool(os.cpus().length, { POPULATION_SIZE, text });

const runTaskInSeparateThread = (population, keys, index) => new Promise(resolve => {
    workerPool.runTask({  population, keys, index }, (err, selectedPopulation) => {
        resolve(selectedPopulation)
    })
})

const getKey = async (text) => {
    const alphabetsCount = getKeyLength(text);
    let currentPopulations = generateInitialPopulations(POPULATION_SIZE, alphabetsCount);
    for (let i = 0; i < GENERATIONS_COUNT; i++) {
        const keys = currentPopulations.map((population) => population.sort((a, b) => a.score - b.score)[0].key)
        currentPopulations = await Promise.all(currentPopulations.map((population, index) => runTaskInSeparateThread(population, keys, index)))
        console.log('Best key for generation', i, currentPopulations.map(population => population.sort((a, b) => a.score - b.score)[0].key));
    }
    workerPool.close();



    return currentPopulations.map(population => population.sort((a, b) => a.score - b.score)[0].key);
}
const decode = (text, keys) => text.split('').map((letter, index) => keys[index % keys.length][UPPER_CASE_ALPHABET.indexOf(letter)]).join('');


(async () => {
    const key = await getKey(text);
    console.log('KEY: ', key);
    console.log(decode(text, key));
})()
