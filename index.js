/* eslint-disable no-unused-vars */
const { loadTradingData } = require('./utils/data');
const { calcTA } = require('./utils/ta');
const dayjs = require('dayjs');
const { NeuralNetConfig } = require('./nn/nn');
const { generatePopulation } = require('./nn/population');
const { runSim } = require('./simulation/trading');

const main = async () => {
	let candleStart = dayjs().subtract(16, 'day').toISOString();
	let { closes, volumes, highs, lows } = await loadTradingData(candleStart);

	let [inputs, inputsTest] = calcTA(closes, highs, lows, volumes, 0.05);

	//Split closes to match x and x_test
	let rows = inputs.rows;
	let halfCloseVar = Math.ceil(closes.length / 2);
	let closesTest = closes.slice(0, halfCloseVar);
	closes = closes.slice(-halfCloseVar);

	let benchmark = (closes[closes.length - 1] / closes[0] - 1) * 100;
	let benchTest = (closes[closes.length - 1] / closesTest[0] - 1) * 100;
	let c = inputs.columns;
	console.log(c);

	let concurrentSims = 3;
	let episodes = 100000;
	let populationSize = 1;
	//let populationSize = 350;
	let decayInterval = 50;
	let config = new NeuralNetConfig(c, 2, 32, 2);

	let population = generatePopulation(config, 0.15, 0.1, populationSize);

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
		let fitness = new Array(populationSize);
		console.log(`population[0].WHidden[0].rows: ${population[0].WHidden[0].rows}`);
		console.log(`population[0].WHidden[0].columns: ${population[0].WHidden[0].columns}`);
		fitness[0] = runSim(population[0], inputs, closes);
		console.log(`is it going to work???? Ahhh: ${fitness[0]}`);
	}
};

main();
