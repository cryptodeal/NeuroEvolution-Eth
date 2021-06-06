const { Matrix } = require('ml-matrix');
const random = require('random');

const NeuralNetConfig = class {
	constructor(inputNeurons, outputNeurons, hiddenNeurons, hiddenLayers) {
		this.inputNeurons = inputNeurons;
		this.outputNeurons = outputNeurons;
		this.hiddenNeurons = hiddenNeurons;
		this.hiddenLayers = hiddenLayers;
	}
};

const NeuralNet = class {
	constructor(neuralNetConfig, mutateRate, mutateScale) {
		this.config = neuralNetConfig;
		this.mutationRate = mutateRate;
		this.mutationScale = mutateScale;
	}
};

const newLayer = (inputs, outputs) => {
	let weights = new Matrix(inputs, outputs);
	let bias = new Matrix(1, outputs);
	const normal = random.normal();

	/* VERIFY THAT I HAVE TRANSLATED FOLLOWING LOOPS FROM GO CORRECTLY */
	weights.apply((row, col) => {
		weights.set(row, col, normal());
	});

	bias.apply((row, col) => {
		bias.set(row, col, normal());
	});

	return [weights, bias];
};
module.exports = { NeuralNet, NeuralNetConfig, newLayer };
