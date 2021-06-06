const stdScaler = (matrix) => {
	matrix.apply((row, col) => {
		matrix.set(row, col, (matrix.get(row, col) - matrix.mean) / matrix.standardDeviation);
	});
	return matrix;
};
module.exports = { stdScaler };
