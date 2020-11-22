const {
  Worker, isMainThread, parentPort, workerData
} = require('worker_threads');

const { selection, crossover, calculateScore, UPPER_CASE_ALPHABET } = require('../lab1/task_3');

const { population, text, keys, index, POPULATION_SIZE } = workerData

const decode = (text, keys) => text.split('').map((letter, index) => UPPER_CASE_ALPHABET[keys[index % keys.length].indexOf(letter)]).join('');

const fitness = (population, text, keys, index) => {
  population.forEach((variant) => {
    const variantsKeys = [...keys];
    variantsKeys[index] = variant.key;
    const decodedText = decode(text, variantsKeys)

    variant.score = calculateScore(decodedText);
  })
}

fitness(population, text, keys, index);
const selectedPopulation = selection(population);

while (selectedPopulation.length < POPULATION_SIZE) {
  crossover(selectedPopulation);
}

parentPort.postMessage(selectedPopulation);
