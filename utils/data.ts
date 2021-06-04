/* eslint-disable */
const { CoinbasePro } = require('coinbase-pro-node');

const loadTradingData = async (start) => {
	const minute = 60000;
	const client = new CoinbasePro();
	var end = Math.floor(new Date().getTime() / 1000);
	const parseFloat = (value) => {
		return parseFloat(value);
	};
	const closes = [];
	const volumes = [];
	const highs = [];
	const lows = [];

	console.log('Loading historical trading data');
	while (start < end) {
		console.log(start);
		//here I need to get candle data at set intervals (default 15)
		//maybe allow intervals to be specified as a param??
	}
};
