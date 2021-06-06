const { newNetwork } = require('./nn');

const generatePopulation = (config, mutateRate, mutateScale, size) => {
	return Array.from({ length: size }, () => newNetwork(config, mutateRate, mutateScale));
};
module.exports = { generatePopulation };
