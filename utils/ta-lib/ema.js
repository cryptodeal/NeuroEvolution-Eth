const ema = (inReal, inTimePeriod, k1) => {
	var outReal = new Array(inReal.length);

	let lookbackTotal = inTimePeriod - 1;
	let startIdx = lookbackTotal;
	let today = startIdx - lookbackTotal;
	let i = inTimePeriod;
	let tempReal = 0.0;
	while (i > 0) {
		tempReal += inReal[today];
		today++;
		i--;
	}

	let prevMA = tempReal / parseFloat(inTimePeriod);

	while (today <= startIdx) {
		prevMA = (inReal[today] - prevMA) * k1 + prevMA;
		today++;
	}
	outReal[startIdx] = prevMA;
	let outIdx = startIdx + 1;
	while (today < inReal.length) {
		prevMA = (inReal[today] - prevMA) * k1 + prevMA;
		outReal[outIdx] = prevMA;
		today++;
		outIdx++;
	}
	return outReal;
};
module.exports = { ema };
