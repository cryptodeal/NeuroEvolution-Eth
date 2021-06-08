const { newNeuralNet } = require('./nn');

const generatePopulation = (config, mutateRate, mutateScale, size) => {
	console.log(`Config: ${JSON.stringify(config)}`);
	let population = new Array(size);
	for (let i = 0; i < size; i++) {
		population[i] = newNeuralNet(config, mutateRate, mutateScale);
	}
	return population;
};
module.exports = { generatePopulation };
