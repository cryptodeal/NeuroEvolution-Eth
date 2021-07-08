const Var = (inReal, inTimePeriod) => {
	var outReal = new Array(inReal.length).fill(0.0);
	var nbInitialElementNeeded = inTimePeriod - 1;
	var startIdx = nbInitialElementNeeded;
	var periodTotal1 = 0.0;
	var periodTotal2 = 0.0;
	var trailingIdx = startIdx - nbInitialElementNeeded;
	let i = trailingIdx;
	if (inTimePeriod > 1) {
		while (i < startIdx) {
			let tempReal = inReal[i];
			periodTotal1 += tempReal;
			tempReal *= tempReal;
			periodTotal2 += tempReal;
			i++;
		}
	}
	var outIdx = startIdx;
	do {
		let tempReal = inReal[i];
		periodTotal1 += tempReal;
		tempReal *= tempReal;
		periodTotal2 += tempReal;
		let meanValue1 = periodTotal1 / inTimePeriod;
		let meanValue2 = periodTotal2 / inTimePeriod;
		tempReal = inReal[trailingIdx];
		periodTotal1 -= tempReal;
		tempReal *= tempReal;
		periodTotal2 -= tempReal;
		outReal[outIdx] = meanValue2 - meanValue1 * meanValue1;
		i++;
		trailingIdx++;
		outIdx++;
	} while (i < inReal.length);
	return outReal;
};
module.exports = { Var };
