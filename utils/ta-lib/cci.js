const Cci = (inHigh, inLow, inClose, inTimePeriod) => {
	let outReal = new Array(inClose.length).fill(0.0);

	let circBufferIdx = 0;
	let lookbackTotal = inTimePeriod - 1;
	let startIdx = lookbackTotal;
	let circBuffer = new Array(inTimePeriod).fill(0.0);
	let maxIdxCircBuffer = inTimePeriod - 1;
	let i = startIdx - lookbackTotal;
	if (inTimePeriod > 1) {
		while (i < startIdx) {
			circBuffer[circBufferIdx] = (inHigh[i] + inLow[i] + inClose[i]) / 3;
			i++;
			circBufferIdx++;
			if (circBufferIdx > maxIdxCircBuffer) circBufferIdx = 0;
		}
	}
	let outIdx = inTimePeriod - 1;
	while (i < inClose.length) {
		let lastValue = (inHigh[i] + inLow[i] + inClose[i]) / 3;
		circBuffer[circBufferIdx] = lastValue;
		let theAverage = 0.0;
		for (let j = 0; j < inTimePeriod; j++) {
			theAverage += circBuffer[j];
		}

		theAverage /= inTimePeriod;
		let tempReal2 = 0.0;
		for (let j = 0; j < inTimePeriod; j++) {
			tempReal2 += Math.abs(circBuffer[j] - theAverage);
		}
		let tempReal = lastValue - theAverage;
		if (tempReal != 0.0 && tempReal2 != 0.0) {
			outReal[outIdx] = tempReal / (0.015 * (tempReal2 / inTimePeriod));
		} else {
			outReal[outIdx] = 0.0;
		}
		{
			circBufferIdx++;
			if (circBufferIdx > maxIdxCircBuffer) {
				circBufferIdx = 0;
			}
		}
		outIdx++;
		i++;
	}
	return outReal;
};
module.exports = { Cci };
