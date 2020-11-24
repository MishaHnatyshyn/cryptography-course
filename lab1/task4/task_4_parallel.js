const {getKeyLength} = require('../task2/task_2')
const { generateInitialPopulation, UPPER_CASE_ALPHABET, extractNGram, calculateNGramsFrequencies, BIGRAMS, TRIGRAMS } = require('../task3/task_3');
const GENERATIONS_COUNT = 1000;
const POPULATION_SIZE = 300;
const WorkerPool = require('./worker_pool')
const os = require('os')

const decode = (text, keys) => text.split('').map((letter, index) => UPPER_CASE_ALPHABET[keys[index % keys.length].indexOf(letter)]).join('');

const calculateScore = (decodedText) => {
    const {
        bigrams, totalBigrams, trigrams, totalTrigrams
    } = extractNGram(decodedText)

    const bigramsFrequencies = calculateNGramsFrequencies(bigrams, totalBigrams)
    const trigramsFrequencies = calculateNGramsFrequencies(trigrams, totalTrigrams)
    const bigramsScore = bigramsFrequencies.reduce((sum, bigram) => {
        return sum + bigram.frequency * Math.log2(BIGRAMS[bigram.key] || 0)
    }, 0)
    const trigramsScore = trigramsFrequencies.reduce((sum, trigram) => {
        return sum + trigram.frequency * Math.log2(TRIGRAMS[trigram.key] || 0)
    }, 0)
    return -(0.2 * bigramsScore + 0.8 * trigramsScore);
}

const fitness = (population, text, keys, index) => {
    population.forEach((variant) => {
        const variantsKeys = [...keys];
        variantsKeys[index] = variant.key;
        const decodedText = decode(text, variantsKeys)

        variant.score = calculateScore(decodedText);
    })
}

const generateInitialPopulations = (size, alphabetsCount) => {
    return [...new Array(alphabetsCount)].map(() => generateInitialPopulation(size))
}

const createTaskRunner = (pool) => (population, keys, index) => new Promise(resolve => {
    pool.runTask({  population, keys, index }, (err, selectedPopulation) => {
        resolve(selectedPopulation)
    })
})

const getKey = async (text) => {
    const workerPool = new WorkerPool(os.cpus().length, { POPULATION_SIZE, text });

    const runTaskInSeparateThread = createTaskRunner(workerPool);

    const alphabetsCount = getKeyLength(text);
    let currentPopulations = generateInitialPopulations(POPULATION_SIZE, alphabetsCount);
    for (let i = 0; i < GENERATIONS_COUNT; i++) {
        const keys = currentPopulations.map((population) => population.filter(key => key.score || i === 0).sort((a, b) => a.score - b.score)[0].key)
        currentPopulations = await Promise.all(currentPopulations.map((population, index) => runTaskInSeparateThread(population, keys, index)))
        console.log('Best key for generation', i, currentPopulations.map(population => population.filter(key => key.score).sort((a, b) => a.score - b.score)[0].key));
    }
    workerPool.close();
    return currentPopulations.map(population => population.filter(key => key.score).sort((a, b) => a.score - b.score)[0].key);
}

module.exports = {
    decode,
    getKey,
    calculateScore,
    fitness,
}
