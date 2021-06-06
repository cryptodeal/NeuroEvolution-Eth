/* eslint-disable no-unused-vars */
const { loadTradingData } = require('./utils/data');
const { calcTA } = require('./utils/ta');
const dayjs = require('dayjs');
const { NeuralNetConfig } = require('./nn/nn');
const { generatePopulation } = require('./nn/population');

const main = async () => {
	let start = dayjs().subtract(16, 'day').toISOString();
	let { closes, volumes, highs, lows } = await loadTradingData(start);
	//console.log(closes);

	let [inputs, inputsTest] = calcTA(closes, highs, lows, volumes, 0.05);

	//Split closes to match x and x_test
	let rows = inputs.rows;
	let halfCloseVar = Math.ceil(closes.length / 2);
	let closesTest = closes.slice(0, halfCloseVar);
	closes = closes.slice(-halfCloseVar);

	let benchmark = (closes[closes.length - 1] / closes[0] - 1) * 100;
	let benchTest = (closes[closes.length - 1] / closesTest[0] - 1) * 100;
	let c = inputs.columns;

	let concurrentSims = 3;
	let episodes = 100000;
	let populationSize = 350;
	let decayInterval = 50;
	let config = new NeuralNetConfig(c, 2, 32, 2);

	let population = generatePopulation(config, 0.15, 0.1, populationSize);
};

main();
