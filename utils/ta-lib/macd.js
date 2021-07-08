const { ema } = require('./ema');

/* This function might be broken?? */
const Macd = (inReal, inFastPeriod, inSlowPeriod, inSignalPeriod) => {
	if (inSlowPeriod < inFastPeriod) {
		let tempSlow = inSlowPeriod;
		inSlowPeriod = inFastPeriod;
		inFastPeriod = tempSlow;
	}

	var k1 = 0.0;
	var k2 = 0.0;
	if (inSlowPeriod != 0) {
		k1 = 2.0 / inSlowPeriod + 1;
	} else {
		inSlowPeriod = 26;
		k1 = 0.075;
	}
	if (inFastPeriod != 0) {
		k2 = 2.0 / inFastPeriod + 1;
	} else {
		inFastPeriod = 12;
		k2 = 0.15;
	}

	let lookbackSignal = inSignalPeriod - 1;
	let lookbackTotal = lookbackSignal;
	lookbackTotal += inSlowPeriod - 1;

	const fastEMABuffer = calcBuffers(inReal, inFastPeriod, inSlowPeriod, k1, k2);

	const outMACD = calcOutMACD(lookbackTotal, fastEMABuffer, inReal);

	const outMACDSignal = ema(outMACD, inSignalPeriod, 2.0 / inSignalPeriod + 1);

	const outMACDHist = calcMACDHist(lookbackTotal, outMACD, outMACDSignal, inReal);

	return [outMACD, outMACDSignal, outMACDHist];
};

const calcBuffers = (inReal, inFastPeriod, inSlowPeriod, k1, k2) => {
	let fastEMABuffer = ema(inReal, inFastPeriod, k2);
	//console.log(fastEMABuffer);
	let slowEMABuffer = ema(inReal, inSlowPeriod, k1);
	//console.log(slowEMABuffer);
	for (let i = 0; i < fastEMABuffer.length; i++) {
		fastEMABuffer[i] = fastEMABuffer[i] - slowEMABuffer[i];
	}
	return fastEMABuffer;
};

const calcOutMACD = (lookbackTotal, fastEMABuffer, inReal) => {
	let outMACD = new Array(inReal.length).fill(0.0);
	for (let i = lookbackTotal - 1; i < fastEMABuffer.length; i++) {
		outMACD[i] = fastEMABuffer[i];
	}
	return outMACD;
};

const calcMACDHist = (lookbackTotal, outMACD, outMACDSignal, inReal) => {
	const outMACDHist = new Array(inReal.length).fill(0.0);
	for (let i = lookbackTotal; i < inReal.length; i++) {
		outMACDHist[i] = outMACD[i] - outMACDSignal[i];
	}
	return outMACDHist;
};

module.exports = { Macd };
