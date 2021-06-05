const { Sma } = require('./sma');
const Ma = (inReal, inTimePeriod, inMAType) => {
	var outReal = new Array(inReal.length);
	if (inTimePeriod == 1) {
		outReal = [...inReal];
		return outReal;
	}
	switch (inMAType) {
		/*case 0: //SMA
			outReal = Sma(inReal, inTimePeriod);
			break;
		case 1: //EMA
			outReal = Ema(inReal, inTimePeriod);
			break;
		case 2: //WMA
			outReal = Wma(inReal, inTimePeriod);
			break;
		case 3: //DEMA
			outReal = Dema(inReal, inTimePeriod);
			break;
		case 4: //TEMA
			outReal = Tema(inReal, inTimePeriod);
			break;
		case 5: //TRIMA
			outReal = Trima(inReal, inTimePeriod);
			break;
		case 6: //KAMA
			outReal = Kama(inReal, inTimePeriod);
			break;
		case 7: //MAMA
			let [tempOutReal,] = Mama(inReal, 0.5, 0.05);
			break;
    */
		default:
			outReal = Sma(inReal, inTimePeriod);
	}
	return outReal;
};
module.exports = { Ma };
