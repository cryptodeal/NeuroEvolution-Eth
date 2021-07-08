const { Var } = require('./var');

const StdDev = (inReal, inTimePeriod, inNbDev) => {
	var outReal = Var(inReal, inTimePeriod);
	if (inNbDev != 1.0) {
		for (let i = 0; i < inReal.length; i++) {
			let tempReal = outReal[i];
			tempReal >= 0.00000000000001
				? (outReal[i] = Math.sqrt(tempReal)) * inNbDev
				: (outReal[i] = 0.0);
		}
	} else {
		for (let i = 0; i < inReal.length; i++) {
			let tempReal = outReal[i];
			tempReal >= 0.00000000000001 ? (outReal[i] = Math.sqrt(tempReal)) : (outReal[i] = 0.0);
		}
	}
	return outReal;
};

module.exports = { StdDev };
