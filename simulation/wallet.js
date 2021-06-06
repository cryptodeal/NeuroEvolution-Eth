/* eslint-disable no-unused-vars */

const Wallet = class {
	constructor(startingBalance, txFee) {
		this.startingBalance = startingBalance;
		this.balance = startingBalance;
		this.txDiscountFactor = 1 - txFee;
		this.ethBalance = 0;
	}
	buySignal() {}
};
