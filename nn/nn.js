/* eslint-disable no-unused-vars */
//const { Matrix } = require('ml-matrix');
const randomFloat = require('random-float-pro');
const random = require('random');
const seedrandom = require('seedrandom');
const dfd = require('danfojs-node');

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

	mutate() {
		//const
		for (const layer of this.WHidden) {
			layer;
		}
	}

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
	/* predict function is definitely broken */
	predict(x) {
		//console.log(`x: ${x}`);
		const net = this;
		function applyActivation(x) {
			return leakyRelu(x);
		}
		/* Inputs */
		console.log(`fail at inputs`);
		console.log(`x rows: ${x.shape[0]}\nx cols: ${x.shape[1]}`);
		console.log(
			`this.WHidden[0] rows: ${this.WHidden[0].shape[0]}\nthis.WHidden[0] cols: ${this.WHidden[0].shape[1]}`
		);

		let hiddenLayerInput = x.mmul(this.WHidden[0]);

		let hiddenIndexes = hiddenLayerInput.index;
		hiddenIndexes.forEach((row) => {
			row.forEach((x, i) => {
				row[i] = x + net.BHidden[0].index[0][i];
			});
		});
		//hiddenLayerInput.apply(addBHidden);
		//console.log(`hiddenLayerInput: ${hiddenLayerInput}`);

		let inputActivations = hiddenLayerInput.copy();
		inputActivations.apply(applyActivation);

		/* Hidden Layers */
		var last = inputActivations.copy();
		//console.log(`input activations: ${inputActivations}`);
		for (let i = 1; i < this.WHidden.length; i++) {
			console.log(`in for loop`);
			hiddenLayerInput = last.mul(net.WHidden[i]);
			(function (h) {
				var j = i;
				function hiddenCb(x, y) {
					let temp1 = this.get(x, y);
					//console.log(`temp1: ${temp1}`);
					let temp2 = net.BHidden[j].get(0, y);
					//console.log(`temp2: ${temp2}`);
					this.set(x, y, temp1 + temp2);
				}
				return h.apply(hiddenCb);
			})(hiddenLayerInput);
			//hiddenLayerInput.apply();
			let hiddenLayerActivations = hiddenLayerInput.clone();
			hiddenLayerInput.apply(applyActivation);
			last = hiddenLayerActivations;
		}

		/* Output */
		let outputLayerInput = last.mmul(this.WOut);
		function cb3(i, j) {
			this.set(i, j, this.get(i, j) + net.BOut.get(0, j));
		}
		//console.log(
		//`outputLayerInput.rows: ${outputLayerInput.rows}\noutputLayerInput.columns: ${outputLayerInput.columns}`
		//);
		outputLayerInput.apply(cb3);

		return outputLayerInput.apply(applyActivation);
	}
};

const newLayer = async (inputs, outputs) => {
	//console.log(`outputs: ${outputs}`);

	function genRandom(x) {
		return (
			x +
			randomFloat({
				min: Math.pow(2, -(1023 - 1)),
				max: Math.pow(2, 1023) * (2 - Math.pow(2, -52))
			})
		);
	}

	/* BUG SEEMS TO BE FIXED */
	/* PENDING FURTHER INPUT VALIDATION TESTING */
	let tempWeights = new dfd.DataFrame(new Array(inputs).fill(new Array(outputs).fill(0.0)));
	let tempBias = new dfd.DataFrame(new Array(1).fill(new Array(outputs).fill(0.0)));
	const weights = tempWeights.apply({ callable: genRandom });
	const bias = tempBias.apply({ callable: genRandom });
	return [weights, bias];
};

const newNeuralNet = async (config, mutateRate, mutateScale) => {
	random.use(seedrandom(toString(Date.now() * 1000000)));

	let net = new NeuralNet(config, mutateRate, mutateScale);
	console.log(config.hiddenLayers);

	/* Layers */
	net.WHidden = new Array(config.hiddenLayers);
	net.BHidden = new Array(config.hiddenLayers);

	[net.WHidden[0], net.BHidden[0]] = await newLayer(config.inputNeurons, config.hiddenNeurons);
	console.log(`net.WHidden[0] rows: ${net.WHidden[0].shape[0]}`);
	console.log(`net.WHidden[0] cols: ${net.WHidden[0].shape[1]}`);

	/* Hidden Layers*/
	for (let i = 1; i < config.hiddenLayers; i++) {
		[net.WHidden[i], net.BHidden[i]] = await newLayer(config.hiddenNeurons, config.hiddenNeurons);
	}

	/* Outputs */
	[net.WOut, net.BOut] = await newLayer(config.hiddenNeurons, config.outputNeurons);
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
