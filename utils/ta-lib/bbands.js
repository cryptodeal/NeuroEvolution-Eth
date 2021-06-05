const { Ma } = require('./ma');
const { StdDev } = require('./stddev');
const BBands = (inReal, inTimePeriod, inNbDevUp, inNbDevDn, inMaType) => {
	var bbands = {
		outRealUpperBand: new Array(inReal.length),
		outRealMiddleBand: Ma(inReal, inTimePeriod, 0),
		outRealLowerBand: new Array(inReal.length)
	};

	let tempBuffer2 = StdDev(inReal, inTimePeriod, 1.0);

	if (inNbDevUp == inNbDevDn) {
		if (inNbDevUp == 1.0) {
			for (let i = 0; i < inReal.length; i++) {
				let tempReal = tempBuffer2[i];
				let tempReal2 = bbands.outRealMiddleBand[i];
				bbands.outRealUpperBand[i] = tempReal2 + tempReal;
				bbands.outRealLowerBand[i] = tempReal2 - tempReal;
			}
		} else {
			for (let i = 0; i < inReal.length; i++) {
				let tempReal = tempBuffer2[i] * inNbDevUp;
				let tempReal2 = bbands.outRealMiddleBand[i];
				bbands.outRealUpperBand[i] = tempReal2 + tempReal;
				bbands.outRealLowerBand[i] = tempReal2 - tempReal;
			}
		}
	} else if (inNbDevUp == 1.0) {
		for (let i = 0; i < inReal.length; i++) {
			let tempReal = tempBuffer2[i];
			let tempReal2 = bbands.outRealMiddleBand[i];
			bbands.outRealUpperBand[i] = tempReal2 + tempReal;
			bbands.outRealLowerBand[i] = tempReal2 - tempReal * inNbDevDn;
		}
	} else if (inNbDevDn == 1.0) {
		for (let i = 0; i < inReal.length; i++) {
			let tempReal = tempBuffer2[i];
			let tempReal2 = bbands.outRealMiddleBand[i];
			bbands.outRealLowerBand[i] = tempReal2 - tempReal;
			bbands.outRealUpperBand[i] = tempReal2 + tempReal * inNbDevUp;
		}
	} else {
		for (let i = 0; i < inReal.length; i++) {
			let tempReal = tempBuffer2[i];
			let tempReal2 = bbands.outRealMiddleBand[i];
			bbands.outRealUpperBand[i] = tempReal2 + tempReal * inNbDevUp;
			bbands.outRealLowerBand[i] = tempReal2 - tempReal * inNbDevDn;
		}
	}
	return bbands;
};
module.exports = { BBands };
