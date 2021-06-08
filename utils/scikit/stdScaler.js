function stdScaler(i, j) {
	this.set((i, j, this.get(i, j) - this.mean) / this.standardDeviation);
}
module.exports = { stdScaler };
