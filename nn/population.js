const { newNeuralNet } = require('./nn');
const random = require('random');

const generatePopulation = async (config, mutateRate, mutateScale, size) => {
	//console.log(`Config: ${JSON.stringify(config)}`);
	let population = new Array(size);
	for (let i = 0; i < size; i++) {
		population[i] = await newNeuralNet(config, mutateRate, mutateScale);
	}
	return population;
};

const poolSelection = async (fitnessScores) => {
	var selectedIndexes = new Array(fitnessScores.length);

	/* Square All Scores First */
	var squared = new Array(fitnessScores.length);
	for (let i = 0; i < fitnessScores.length; i++) {
		squared[i] = fitnessScores[i] * fitnessScores[i];
		if (fitnessScores[i] < 0) squared[i] *= -1;
	}

	/* Find Min And Max To Normalize Scores */
	let min = Number.NEGATIVE_INFINITY;
	let max = Number.POSITIVE_INFINITY;
	let maxIdx = 0;
	squared.forEach((score, i) => {
		min = Math.min(min, score);
		if (score > max) {
			maxIdx = i;
			max = score;
		}
	});

	/* Keep Best Model */
	selectedIndexes[0] = maxIdx;

	/* All Scores Are The Same */
	var normalizedScores = new Array(fitnessScores.length);
	if (min == max) {
		var newScore = 1 / fitnessScores.length;
		for (let i = 0; i < fitnessScores.length; i++) {
			normalizedScores[i] = newScore;
		}
	} else {
		var sum = 0;

		/* Subtract Min From Array */
		for (let i = 0; i < fitnessScores.length; i++) {
			normalizedScores[i] = squared[i] - min;
			sum += normalizedScores[i];
		}

		/* Divide By Sum */
		for (let i = 0; i < fitnessScores.length; i++) {
			normalizedScores[i] /= sum;
		}
	}

	/* Pool Selection */
	for (let i = 0; i < fitnessScores.length; i++) {
		var index = 0;
		var count = 0;

		/* Fitness Proportionate Selection */
		var r = random.float();
		while (count < r && index < fitnessScores.length) {
			count += normalizedScores[index];
			index++;
		}

		selectedIndexes[i] = index - 1;
	}

	return selectedIndexes;
};

const createNewPopulation = (indexes, lastGen) => {
	var newPop = new Array(lastGen.length);
	indexes.forEach((index, i) => {
		newPop[i] = lastGen[index].clone();
		if (i != 0) newPop[i].mutate();
	});
};
module.exports = { generatePopulation, poolSelection, createNewPopulation };
