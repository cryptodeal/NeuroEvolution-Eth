const { loadTradingData } = require('./utils/data');
const dayjs = require('dayjs');

var start = dayjs().subtract(16, 'day').toISOString();
loadTradingData(start)
	.then((data) => {
		console.log(data);
	})
	.catch((error) => console.log(error));
