/* eslint-disable no-unused-vars */
const { loadTradingData } = require('./utils/data');
const { calcTA } = require('./utils/ta');
const dayjs = require('dayjs');

const main = async () => {
	let start = dayjs().subtract(16, 'day').toISOString();
	let { closes, volumes, highs, lows } = await loadTradingData(start);
	//console.log(closes);
	let [inputs, inputsTest] = calcTA(closes, highs, lows, volumes, 0.05);
	console.log(inputs);
	//Split closes to match x and x_test
};

main();
