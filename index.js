/* eslint-disable no-unused-vars */
const { loadTradingData } = require('./utils/data');
const { calcTA } = require('./utils/ta');
const dayjs = require('dayjs');
const { NeuralNetConfig } = require('./nn/nn');
const { generatePopulation, poolSelection } = require('./nn/population');
const { runSim } = require('./simulation/trading');

const main = async () => {
	let candleStart = dayjs().subtract(16, 'day').toISOString();
	let { closes, volumes, highs, lows } = await loadTradingData(candleStart);

	let [inputs, inputsTest] = await calcTA(closes, highs, lows, volumes, 0.05);

	//Split closes to match x and x_test
	let rows = inputs.rows;
	let halfCloseVar = Math.ceil(closes.length / 2);
	let closesTest = closes.slice(0, halfCloseVar);
	closes = closes.slice(-halfCloseVar);

	let benchmark = (closes[closes.length - 1] / closes[0] - 1) * 100;
	let benchTest = (closes[closes.length - 1] / closesTest[0] - 1) * 100;
	let c = inputs.shape[1];

	let concurrentSims = 3;
	let episodes = 100000;
	let populationSize = 10;
	//let populationSize = 350;
	let decayInterval = 50;
	let config = new NeuralNetConfig(c, 2, 32, 2);

	let population = await generatePopulation(config, 0.15, 0.1, populationSize);

	let start = dayjs();
	for (let i = 0; i < episodes; i++) {
		/* Scale Back Mutation */
		if (i % decayInterval == 0) {
			/* GOLANG FOR LOOP */
			for (const model of population) {
				let mutateRate = Math.max(0.02, model.MutationRate - 0.005);
				let mutateScale = Math.max(0.01, model.MutationRate - 0.005);
				model.setMutation(mutateRate, mutateScale);
			}
		}
		var fitness = new Array(populationSize).fill(0.0);

		//population.forEach(async (model, j) => {
		//fitness[j] = await runSim(model, inputs, closes);
		//console.log(`is it going to work???? Ahhh: ${fitness[j]}`);
		//});

		for (let j = 0; j < 10; j++) {
			fitness[j] = await runSim(population[j], inputs, closes);
			//console.log(fitness[j]);
		}
		//fitness[0] = test(population[0], inputs, closes);
		//console.log(`is it going to work???? Ahhh: ${fitness[0]}`);

		var nextGenIndexes = await poolSelection(fitness);
		console.log(nextGenIndexes);
	}
};

main();
