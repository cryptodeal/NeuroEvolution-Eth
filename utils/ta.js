/* eslint-disable no-unused-vars */
const talib = require('talib-binding');
const Matrix = require('ml-matrix');

const calcTA = (closes, highs, lows, volumes, testSize) => {
	var values = [];
	var signalCount = 0;

	//Money Flow Index (invert signal)
	let mfi = talib.MFI(highs, lows, closes, volumes, 16);
	for (let i = 0; i < mfi.length; i++) {
		mfi[i] = 100 - mfi[i];
	}
	values = values.push(mfi);
	signalCount++;

	//verify grabbing correct data
	//MACD histogram
	let [, , hist] = talib.MACD(closes, 12, 24, 9);
	values = values.push(hist);
	signalCount++;

	//Moving average (diff from close)
	let ma = talib.SMA(closes, 175);
	for (let i = 0; i < ma.length; i++) {
		ma[i] = closes[i] - ma[i];
	}
	values = values.push(ma);

	//BB
	let [upper, , lower] = talib.BBANDS(closes, 40, 2, 2, 0);
	for (let i = 0; i < upper.length; i++) {
		upper[i] = closes[i] - upper[i];
		lower[i] = closes[i] - lower[i];
	}
	values = values.push(upper);
	values = values.push(lower);
	signalCount += 2;

	//CCI (invert)
	let cci = talib.CCI(highs, lows, closes, 17);
	for (let i = 0; i < cci.length; i++) {
		cci[i] = -1 * cci[i];
	}
	values = values.push(cci);
	signalCount++;

	var transposed = new Matrix(values);
	var denseInputs = transposed.clone();

	//Split test and train
	var nSamples = denseInputs.rows();
	var nFeatures = denseInputs.columns();
	var splitIndex = nSamples / 2;
	var xTrain = new Matrix(splitIndex, nFeatures);
	var xTest = new Matrix(nSamples - splitIndex, nFeatures);

	for (let i = 0; i < nSamples; i++) {
		//i < splitIndex ?
	}
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

module.exports = { minMaxScale };
