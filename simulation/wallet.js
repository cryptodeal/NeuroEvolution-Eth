const Wallet = class {
	constructor(startingBalance, txFee) {
		this.startingBalance = startingBalance;
		this.balance = startingBalance;
		this.txDiscountFactor = 1 - txFee;
		this.ethBalance = 0;
	}
	buySignal(price) {
		if (this.ethBalance == 0) {
			this.ethBalance = (this.balance / price) * this.txDiscountFactor;
			this.balance = 0;
		}
	}

	sellSignal(price) {
		if (this.balance == 0) {
			this.balance = this.ethBalance * price * this.txDiscountFactor;
			this.ethBalance = 0;
		}
	}

	getReturn() {
		return (this.balance / this.startingBalance - 1) * 100;
	}
};
module.exports = { Wallet };
