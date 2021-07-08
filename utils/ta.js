/* eslint-disable no-unused-vars */
const { BBands } = require('./ta-lib/bbands');
const { Sma } = require('./ta-lib/sma');
const { Macd } = require('./ta-lib/macd');
const { Cci } = require('./ta-lib/cci');
const { Mfi } = require('./ta-lib/mfi');
const dfd = require('danfojs-node');

const calcTA = (closes, highs, lows, volumes) => {
	var values = [];
	var signalCount = 0;

	/* Money Flow Index (invert signal)
  PORTED & WORKING */
	let mfi = Mfi(highs, lows, closes, volumes, 16);
	for (let i = 0; i < mfi.length; i++) {
		mfi[i] = 100 - mfi[i];
	}
	values.push(mfi);
	signalCount++;

	/* MACD histogram
  PORTED & WORKING???? */
	let [, , outMACDHist] = Macd(closes, 12, 24, 9);
	values.push(outMACDHist);
	signalCount++;

	/* Moving average (diff from close)
  PORTED & WORKING */
	let ma = Sma(closes, 175);
	for (let i = 0; i < ma.length; i++) {
		ma[i] = closes[i] - ma[i];
	}
	values.push(ma);
	signalCount++;

	/* BB
  PORTED & WORKING */
	let [outRealUpperBand, , outRealLowerBand] = BBands(closes, 40, 2, 2);
	for (let i = 0; i < outRealUpperBand.length; i++) {
		outRealUpperBand[i] = closes[i] - outRealUpperBand[i];
		outRealLowerBand[i] = closes[i] - outRealLowerBand[i];
	}
	values.push(outRealUpperBand);
	values.push(outRealLowerBand);
	signalCount += 2;

	/* CCI (invert)
  PORTED & WORKING */
	let cci = Cci(highs, lows, closes, 17);
	for (let i = 0; i < cci.length; i++) {
		cci[i] = -1 * cci[i];
	}
	values.push(cci);
	signalCount++;
	var transposed = new dfd.DataFrame(values).T;
	console.log(`transposed rows: ${transposed.shape[0]}\ntransposed cols: ${transposed.shape[1]}`);

	var denseInputs = transposed.copy();

	/* Split test and train */
	var [nSamples, nFeatures] = denseInputs.shape;
	var splitIndex = nSamples / 2;

	/* Create xTrain */
	var xTrain = new dfd.DataFrame(new Array(splitIndex).fill(new Array(nFeatures).fill(0.0)));
	console.log(`xTrain rows: ${xTrain.shape[0]}\nxTest cols: ${xTrain.shape[1]}`);

	/* Create xTest */
	var xTest = new dfd.DataFrame(
		new Array(nSamples - splitIndex).fill(new Array(nFeatures).fill(0.0))
	);
	console.log(`xTest rows: ${xTest.shape[0]}\nxTest cols: ${xTest.shape[1]}`);

	for (let i = 0; i < nSamples; i++) {
		if (i < splitIndex) {
			xTrain.index[i] = denseInputs.iloc({ rows: [i] });
		} else {
			xTest.index[i - splitIndex] = denseInputs.iloc({ rows: [i] });
		}
	}

	/* Scale Inputs */
	let scaler = new dfd.StandardScaler();
	scaler.fit(xTrain);
	let scaledXTrain = scaler.transform(xTrain);
	let scaledXTest = scaler.transform(xTest);

	return [scaledXTrain, scaledXTest];
};

const minMaxScale = (inputs) => {
	let min = Number.NEGATIVE_INFINITY;
	let max = Number.POSITIVE_INFINITY;
	inputs.map((input) => {
		min = Math.min(input, min);
		max = Math.max(input, max);
	});
	max -= min;

	const scaled = new Array(inputs.length).fill(0.0);
	inputs.forEach((input, i) => {
		scaled[i] = (input - min) / max;
	});
	return scaled;
};

module.exports = { minMaxScale, calcTA };
