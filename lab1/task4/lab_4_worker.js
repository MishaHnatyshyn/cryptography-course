const {
  parentPort, workerData
} = require('worker_threads');

const { selection, crossover } = require('../task3/task_3');
const { fitness } = require('./task_4_parallel');

const { text, POPULATION_SIZE } = workerData

parentPort.on('message', ({ population, keys, index}) => {
  fitness(population, text, keys, index);

  const selectedPopulation = selection(population);

  while (selectedPopulation.length < POPULATION_SIZE) {
    crossover(selectedPopulation);
  }

  parentPort.postMessage(selectedPopulation);
})
