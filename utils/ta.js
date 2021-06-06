/* eslint-disable no-unused-vars */
const { Matrix } = require('ml-matrix');
const { BBands } = require('./ta-lib/bbands');
const { Sma } = require('./ta-lib/sma');
const { Macd } = require('./ta-lib/macd');
const { Cci } = require('./ta-lib/cci');
const { Mfi } = require('./ta-lib/mfi');
const calcTA = (closes, highs, lows, volumes, testSize) => {
	console.log(closes.length, highs.length, lows.length, volumes.length);
	var values = [];
	var signalCount = 0;

	/*Money Flow Index (invert signal)
  PORTED & WORKING*/
	let mfi = Mfi(highs, lows, closes, volumes, 16);
	for (let i = 0; i < mfi.length; i++) {
		mfi[i] = 100 - mfi[i];
	}
	values.push(mfi);
	signalCount++;
	console.log(`mfi: ${mfi.length}`);

	/*MACD histogram
  PORTED & WORKING*/
	let { outMACDHist } = Macd(closes, 12, 24, 9);
	values.push(outMACDHist);
	signalCount++;
	console.log(`hist: ${outMACDHist.length}`);

	/*  Moving average (diff from close)
  PORTED & WORKING */
	let ma = Sma(closes, 175);
	for (let i = 0; i < ma.length; i++) {
		ma[i] = closes[i] - ma[i];
	}
	values.push(ma);
	console.log(`ma: ${ma.length}`);

	/* BB
  PORTED & WORKING */
	let { outRealUpperBand, outRealMiddleBand, outRealLowerBand } = BBands(closes, 40, 2, 2);
	for (let i = 0; i < outRealUpperBand.length; i++) {
		outRealUpperBand[i] = closes[i] - outRealUpperBand[i];
		outRealLowerBand[i] = closes[i] - outRealLowerBand[i];
	}
	values.push(outRealUpperBand);
	values.push(outRealLowerBand);
	console.log(`upper: ${outRealUpperBand.length}`);
	console.log(`lower: ${outRealLowerBand.length}`);

	signalCount += 2;

	/*CCI (invert)
  PORTED & WORKING*/
	let cci = Cci(highs, lows, closes, 17);
	for (let i = 0; i < cci.length; i++) {
		cci[i] = -1 * cci[i];
	}
	values.push(cci);
	signalCount++;
	console.log(`cci: ${cci.length}`);

	var transposed = new Matrix(values);
	var denseInputs = transposed.clone();

	//Split test and train
	var nSamples = denseInputs.rows;
	var nFeatures = denseInputs.columns;
	var splitIndex = nSamples / 2;
	var xTrain = new Matrix(splitIndex, nFeatures);
	var xTest = new Matrix(nSamples - splitIndex, nFeatures);

	for (let i = 0; i < nSamples; i++) {
		i < splitIndex
			? xTrain.setRow(i, denseInputs.getRow(i))
			: xTrain.setRow(i - splitIndex, denseInputs.getRow(i));
	}

	//Scale inputs
	var scaler = xTrain.standardDeviation();
	console.log(`scaler: ${scaler}`);
	xTrain.scale();
	xTest.scale(scaler);

	return { xTrain, xTest };
};

const minMaxScale = (inputs) => {
	let min = Number.NEGATIVE_INFINITY;
	let max = Number.POSITIVE_INFINITY;
	inputs.map((input) => {
		min = Math.min(input, min);
		max = Math.max(input, max);
	});
	max -= min;

	const scaled = [];
	inputs.map((input) => {
		scaled.push((input - min) / max);
	});
	return scaled;
};

module.exports = { minMaxScale, calcTA };
