const {getKeyLength} = require('../lab1/task_2')
const { generateInitialPopulation, selection, crossover, calculateScore, UPPER_CASE_ALPHABET } = require('../lab1/task_3');
const {
    Worker, isMainThread, parentPort, workerData
} = require('worker_threads');
const GENERATIONS_COUNT = 500;
const POPULATION_SIZE = 100;
const WorkerPool = require('./worker_pool')
const os = require('os')

const text = 'KZBWPFHRAFHMFSNYSMNOZYBYLLLYJFBGZYYYZYEKCJVSACAEFLMAJZQAZYHIJFUNHLCGCINWFIHHHTLNVZLSHSVOZDPYSMNYJXHMNODNHPATXFWGHZPGHCVRWYSNFUSPPETRJSIIZSAAOYLNEENGHYAMAZBYSMNSJRNGZGSEZLNGHTSTJMNSJRESFRPGQPSYFGSWZMBGQFBCCEZTTPOYNIVUJRVSZSCYSEYJWYHUJRVSZSCRNECPFHHZJBUHDHSNNZQKADMGFBPGBZUNVFIGNWLGCWSATVSSWWPGZHNETEBEJFBCZDPYJWOSFDVWOTANCZIHCYIMJSIGFQLYNZZSETSYSEUMHRLAAGSEFUSKBZUEJQVTDZVCFHLAAJSFJSCNFSJKCFBCFSPITQHZJLBMHECNHFHGNZIEWBLGNFMHNMHMFSVPVHSGGMBGCWSEZSZGSEPFQEIMQEZZJIOGPIOMNSSOFWSKCRLAAGSKNEAHBBSKKEVTZSSOHEUTTQYMCPHZJFHGPZQOZHLCFSVYNFYYSEZGNTVRAJVTEMPADZDSVHVYJWHGQFWKTSNYHTSZFYHMAEJMNLNGFQNFZWSKCCJHPEHZZSZGDZDSVHVYJWHGQFWKTSNYHTSZFYHMAEDNJZQAZSCHPYSKXLHMQZNKOIOKHYMKKEIKCGSGYBPHPECKCJJKNISTJJZMHTVRHQSGQMBWHTSPTHSNFQZKPRLYSZDYPEMGZILSDIOGGMNYZVSNHTAYGFBZZYJKQELSJXHGCJLSDTLNEHLYZHVRCJHZTYWAFGSHBZDTNRSESZVNJIVWFIVYSEJHFSLSHTLNQEIKQEASQJVYSEVYSEUYSMBWNSVYXEIKWYSYSEYKPESKNCGRHGSEZLNGHTSIZHSZZHCUJWARNEHZZIWHZDZMADNGPNSYFZUWZSLXJFBCGEANWHSYSEGGNIVPFLUGCEUWTENKCJNVTDPNXEIKWYSYSFHESFPAJSWGTYVSJIOKHRSKPEZMADLSDIVKKWSFHZBGEEATJLBOTDPMCPHHVZNYVZBGZSCHCEZZTWOOJMBYJSCYFRLSZSCYSEVYSEUNHZVHRFBCCZZYSEUGZDCGZDGMHDYNAFNZHTUGJJOEZBLYZDHYSHSGJMWZHWAFTIAAY';

const decode = (text, keys) => text.split('').map((letter, index) => UPPER_CASE_ALPHABET[keys[index % keys.length].indexOf(letter)]).join('');


const generateInitialPopulations = (size, alphabetsCount) => {
    return [...new Array(alphabetsCount)].map(() => generateInitialPopulation(size))
}

const fitness = (population, text, keys, index) => {
    population.forEach((variant) => {
        const variantsKeys = [...keys];
        variantsKeys[index] = variant.key;
        const decodedText = decode(text, variantsKeys)

        variant.score = calculateScore(decodedText);
    })
}

const createPromisedWorker = (population, keys, index) => new Promise(resolve => {
    const worker = new Worker('./lab1/lab_4_worker.js', { workerData: {
            population, keys, index, text, POPULATION_SIZE
        } })
    worker.on('message', (selectedPopulation) => resolve(selectedPopulation))
})

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
        console.log(i)
        const keys = currentPopulations.map((population) => population.sort((a, b) => a.score - b.score)[0].key)
        console.time('START')
        currentPopulations = await Promise.all(currentPopulations.map((population, index) => runTaskInSeparateThread(population, keys, index)))
        console.timeEnd('START')
        console.log(currentPopulations.map(population => population.sort((a, b) => a.score - b.score)[0].key));
    }

    return currentPopulations.map(population => population.sort((a, b) => a.score - b.score)[0].key);
}

(async () => {
    const key = await getKey(text);
    console.log('KEY: ', key);
    decode(text, key);
})()


