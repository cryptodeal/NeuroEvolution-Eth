const { Ma } = require('./ma');
const { StdDev } = require('./stddev');
const BBands = (inReal, inTimePeriod, inNbDevUp, inNbDevDn, inMaType) => {
	var outRealUpperBand = new Array(inReal.length).fill(0.0);
	var outRealMiddleBand = Ma(inReal, inTimePeriod, inMaType);
	var outRealLowerBand = new Array(inReal.length).fill(0.0);

	let tempBuffer2 = StdDev(inReal, inTimePeriod, 1.0);

	if (inNbDevUp == inNbDevDn) {
		if (inNbDevUp == 1.0) {
			for (let i = 0; i < inReal.length; i++) {
				let tempReal = tempBuffer2[i];
				let tempReal2 = outRealMiddleBand[i];
				outRealUpperBand[i] = tempReal2 + tempReal;
				outRealLowerBand[i] = tempReal2 - tempReal;
			}
		} else {
			for (let i = 0; i < inReal.length; i++) {
				let tempReal = tempBuffer2[i] * inNbDevUp;
				let tempReal2 = outRealMiddleBand[i];
				outRealUpperBand[i] = tempReal2 + tempReal;
				outRealLowerBand[i] = tempReal2 - tempReal;
			}
		}
	} else if (inNbDevUp == 1.0) {
		for (let i = 0; i < inReal.length; i++) {
			let tempReal = tempBuffer2[i];
			let tempReal2 = outRealMiddleBand[i];
			outRealUpperBand[i] = tempReal2 + tempReal;
			outRealLowerBand[i] = tempReal2 - tempReal * inNbDevDn;
		}
	} else if (inNbDevDn == 1.0) {
		for (let i = 0; i < inReal.length; i++) {
			let tempReal = tempBuffer2[i];
			let tempReal2 = outRealMiddleBand[i];
			outRealLowerBand[i] = tempReal2 - tempReal;
			outRealUpperBand[i] = tempReal2 + tempReal * inNbDevUp;
		}
	} else {
		for (let i = 0; i < inReal.length; i++) {
			let tempReal = tempBuffer2[i];
			let tempReal2 = outRealMiddleBand[i];
			outRealUpperBand[i] = tempReal2 + tempReal * inNbDevUp;
			outRealLowerBand[i] = tempReal2 - tempReal * inNbDevDn;
		}
	}
	return [outRealUpperBand, outRealMiddleBand, outRealLowerBand];
};
module.exports = { BBands };
