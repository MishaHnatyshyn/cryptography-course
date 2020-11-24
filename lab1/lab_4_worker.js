const {
  parentPort, workerData
} = require('worker_threads');

const { selection, crossover, calculateScore, UPPER_CASE_ALPHABET } = require('../lab1/task_3');

const { text, POPULATION_SIZE } = workerData

const decode = (text, keys) => text.split('').map((letter, index) => keys[index % keys.length][UPPER_CASE_ALPHABET.indexOf(letter)]).join('');

const fitness = (population, text, keys, index) => {
  population.forEach((variant) => {
    const variantsKeys = [...keys];
    variantsKeys[index] = variant.key;
    const decodedText = decode(text, variantsKeys)

    variant.score = calculateScore(decodedText);
  })
}

parentPort.on('message', ({ population, keys, index}) => {
  fitness(population, text, keys, index);

  const selectedPopulation = selection(population);

  while (selectedPopulation.length < POPULATION_SIZE) {
    crossover(selectedPopulation);
  }

  parentPort.postMessage(selectedPopulation);
})
