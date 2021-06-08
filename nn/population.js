const { newNeuralNet } = require('./nn');

const generatePopulation = (config, mutateRate, mutateScale, size) => {
	return Array.from({ length: size }, () => newNeuralNet(config, mutateRate, mutateScale));
};
module.exports = { generatePopulation };
