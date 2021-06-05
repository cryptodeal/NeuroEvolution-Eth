const { CoinbasePro, CandleGranularity } = require('coinbase-pro-node');
const dayjs = require('dayjs');

const loadTradingData = async (start) => {
	const client = new CoinbasePro();
	const granularity = CandleGranularity.FIFTEEN_MINUTES;
	const end = dayjs().toISOString();
	const closes = [];
	const volumes = [];
	const highs = [];
	const lows = [];
	console.log('Loading historical trading data');
	while (start < end) {
		let ticks = await client.rest.product.getCandles('ETH-USD', {
			end,
			granularity,
			start
		});
		ticks.map((tick) => {
			let { close, high, low, volume } = tick;
			closes.push(parseFloat(close));
			volumes.push(parseFloat(volume));
			highs.push(parseFloat(high));
			lows.push(parseFloat(low));
		});
		start = dayjs(ticks[ticks.length - 1].openTimeInISO)
			.add(15, 'minute')
			.toISOString();
	}
	console.log(`Returning ${closes.length} candles\n`);
	return { closes, volumes, highs, lows };
};

module.exports = { loadTradingData };
