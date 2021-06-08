const stdScaler = (matrix) => {
	return matrix.apply((i, j) => {
		let res = (matrix.get(i, j) - matrix.mean) / matrix.standardDeviation;
		return res;
	});
};
module.exports = { stdScaler };
