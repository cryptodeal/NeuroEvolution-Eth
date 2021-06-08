/* eslint-disable no-unused-vars */
const { Matrix } = require('ml-matrix');
const random = require('random');
const seedrandom = require('seedrandom');

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
		this._config = neuralNetConfig;
		this._mutationRate = mutateRate;
		this._mutationScale = mutateScale;
	}
	get config() {
		return this._config;
	}
	set config(config) {
		this._config = config;
	}
	get mutationRate() {
		return this._mutationRate;
	}
	set mutationRate(mutateRate) {
		this._mutationRate = mutateRate;
	}
	get mutationScale() {
		return this._mutationScale;
	}
	set mutationScale(mutateScale) {
		this._mutationScale = mutateScale;
	}

	mutate() {}

	copy() {
		let copy = new NeuralNet(this._config, this._mutationRate, this._mutationScale);

		/* Layers */
		copy.WHidden = new Array(this._config.hiddenLayers);
		copy.BHidden = new Array(this._config.hiddenLayers);

		/* Copy Weights */
		for (let i = 0; i < this._config.hiddenLayers; i++) {
			copy.WHidden[i] = this.WHidden[i].clone();
			copy.BHidden[i] = this.BHidden[i].clone();
		}

		/* Outputs */
		copy.WOut = this.WOut.clone();
		copy.BOut = this.BOut.clone();

		return copy;
	}

	setMutation(mutateRate, mutateScale) {
		this._mutationRate = mutateRate;
		this._mutationScale = mutateScale;
	}

	predict(x) {
		var net = this;
		function applyActivation(i, j) {
			this.set(i, j, leakyRelu(this.get(i, j)));
		}
		/* Inputs */
		let hiddenLayerInput = x.mmul(this.WHidden[0]);

		function cb(i, j) {
			this.set(i, j, this.get(i, j) + net.BHidden[0].get(0, j));
		}
		hiddenLayerInput.apply(cb);

		let inputActivations = hiddenLayerInput.clone().apply(applyActivation);

		/* Hidden Layers */
		function cb2(i, j) {
			this.get(i, j) + net.BHidden[i].get(0, j);
		}
		let last = inputActivations;
		for (let i = 1; i < this.WHidden.length; i++) {
			let hiddenLayerInput = last.mmul(this.WHidden[i]);
			hiddenLayerInput.apply(cb2);

			let hiddenLayerActivations = hiddenLayerInput.clone().apply(applyActivation);
			last = hiddenLayerActivations;
		}

		/* Output */
		let outputLayerInput = last.mmul(this.WOut);
		net = this;
		function cb3(i, j) {
			this.set(i, j, this.get(i, j) + net.BOut.get(0, j));
		}
		outputLayerInput.apply(cb3);

		return outputLayerInput.apply(applyActivation);
	}
};

const newLayer = (inputs, outputs) => {
	const normal = random.normal();
	function cb(i, j) {
		this.set(i, j, normal());
	}

	/* THIS SEEMS TO BE WHERE THE PROGRAM IS GETTING FUCKED */
	const weights = new Matrix(inputs, outputs);
	weights.apply(cb);
	const bias = new Matrix(1, outputs);
	bias.apply(cb);

	return [weights, bias];
};

const newNeuralNet = (config, mutateRate, mutateScale) => {
	random.use(seedrandom(toString(Date.now() * 1000000)));

	let net = new NeuralNet(config, mutateRate, mutateScale);

	/* Layers */
	net.WHidden = new Array(config.hiddenLayers);
	net.BHidden = new Array(config.hiddenLayers);

	/* Inputs */
	/* BUG SEEMS TO ARISE WHEN CREATING NEW LAYERS */
	[net.WHidden[0], net.BHidden[0]] = newLayer(net.config.inputNeurons, net.config.hiddenNeurons);
	console.log(`net.WHidden[0] rows: ${net.WHidden[0].rows}`);
	console.log(`net.WHidden[0] cols: ${net.WHidden[0].columns}`);

	/* Hidden Layers*/
	for (let i = 1; i < config.hiddenLayers; i++) {
		[net.WHidden[i], net.BHidden[i]] = newLayer(net.config.hiddenNeurons, net.config.hiddenNeurons);
	}

	/* Outputs */
	[net.WOut, net.BOut] = newLayer(net.config.hiddenNeurons, net.config.outputNeurons);
	return net;
};

const sigmoid = (x) => {
	return 1.0 / (1.0 + Math.exp(-x));
};

const relu = (x) => {
	if (x > 0) return x;
	return 0;
};

const leakyRelu = (x) => {
	if (x > 0) return x;
	return 0.01 * x;
};

module.exports = { NeuralNet, NeuralNetConfig, newLayer, newNeuralNet };
