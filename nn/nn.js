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
		const applyActivation = (i, j) => {
			return leakyRelu(this.get(i, j));
		};
		console.log(`x rows: ${x.rows}\nx cols: ${x.columns}`);
		console.log(
			`this.WHidden[0] rows: ${this.WHidden[0].rows}\nthis.WHidden[0] cols: ${this.WHidden[0].columns}`
		);
		/* Inputs */
		/* FAILING AT MATRIX.MUL */
		/* SOME MATRIX DIMENSIONS ARE FUCKED */
		let hiddenLayerInput = Matrix.mul(x, this.WHidden[0]);
		/* EXPECTED DIMENSIONS (FROM GO) */
		/* 
      hiddenLayerInput rows: 768 
      hiddenLayerInput cols: 32
      x col: 6 - I RETURN 6
      x rows: 768 - I RETURN 768
      net.WHidden[0] rows: 6 - WELP... THIS IS CURRENTLY 32; SO I AM DOING SOMETHING VERY WRONG HAHAHAHA
      net.WHidden[0] col: 32 - CORRECT WOOHOO!!!!
    */
		hiddenLayerInput.apply((i, j) => {
			return this.get(i, j) + this.BHidden[0].get(0, j);
		});

		let inputActivations = hiddenLayerInput.clone().apply(applyActivation);

		/* Hidden Layers */
		let last = inputActivations;
		for (let i = 1; i < this.WHidden.length; i++) {
			var net = this;
			let hiddenLayerInput = Matrix.mul(last, this.WHidden[i]);

			hiddenLayerInput.apply((i, j) => {
				return this.get(i, j) + net.BHidden[i].get(0, j);
			});

			let hiddenLayerActivations = hiddenLayerInput.clone().apply(applyActivation);
			last = hiddenLayerActivations;
		}

		/* Output */
		let outputLayerInput = Matrix.multiply(last, this.WOut);
		net = this;
		outputLayerInput.apply((i, j) => {
			return this.get(i, j) + net.BOut.get(0, j);
		});

		return outputLayerInput.apply(applyActivation);
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

const newNeuralNet = (config, mutateRate, mutateScale) => {
	random.use(seedrandom(toString(Date.now() * 1000000)));

	let net = new NeuralNet(config, mutateRate, mutateScale);

	/* Layers */
	net.WHidden = new Array(config.hiddenLayers);
	net.BHidden = new Array(config.hiddenLayers);

	/* Inputs */
	[net.WHidden[0], net.BHidden[0]] = newLayer(net.config.inputNeurons, net.config.hiddenNeurons);

	/* Hidden Layers*/
	for (let i = 0; i < config.hiddenLayers; i++) {
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
