const { ema } = require('./ema');
const Macd = (inReal, inFastPeriod, inSlowPeriod, inSignalPeriod) => {
	if (inSlowPeriod < inFastPeriod) {
		[inSlowPeriod, inFastPeriod] = [inFastPeriod, inSlowPeriod];
	}

	let k1 = 0.0;
	let k2 = 0.0;
	if (inSlowPeriod != 0) {
		k1 = 2.0 / parseFloat(inSlowPeriod + 1);
	} else {
		inSlowPeriod = 26;
		k1 = 0.075;
	}
	if (inFastPeriod != 0) {
		k2 = 2.0 / parseFloat(inFastPeriod + 1);
	} else {
		inFastPeriod = 12;
		k2 = 0.15;
	}

	let lookbackSignal = inSignalPeriod - 1;
	let lookbackTotal = lookbackSignal;
	lookbackTotal += inSlowPeriod - 1;

	let fastEMABuffer = ema(inReal, inFastPeriod, k2);
	let slowEMABuffer = ema(inReal, inSlowPeriod, k1);
	for (let i = 0; i < fastEMABuffer.length; i++) {
		fastEMABuffer[i] = fastEMABuffer[i] - slowEMABuffer[i];
	}

	let outMACD = new Array(inReal.length);
	for (let i = lookbackTotal - 1; i < fastEMABuffer.length; i++) {
		outMACD[i] = fastEMABuffer[i];
	}
	let outMACDSignal = ema(outMACD, inSignalPeriod, 2.0 / parseFloat(inSignalPeriod + 1));

	let outMACDHist = new Array(inReal.length);
	for (let i = lookbackTotal; i < outMACDHist.length; i++) {
		outMACDHist[i] = outMACD[i] - outMACDSignal[i];
	}
	return { outMACD, outMACDSignal, outMACDHist };
};
module.exports = { Macd };
