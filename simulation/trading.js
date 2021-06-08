/* eslint-disable no-unused-vars */
const { Wallet } = require('./wallet');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

const runSim = (model, inputs, closes) => {
	let wallet = new Wallet(10000.0, 0.0035);

	let modelOutputs = model.predict(inputs);

	for (let i = 0; i < closes.length; i++) {
		/* Buy Or Sell Signal */
		modelOutputs.get(i, 0) > modelOutputs.get(i, 1)
			? wallet.buySignal(closes[i])
			: wallet.sellSignal(closes[i]);
	}

	/* Close Any Positions*/
	wallet.sellSignal(closes[closes.length - 1]);
	return wallet.getReturn();
};
module.exports = { runSim };
