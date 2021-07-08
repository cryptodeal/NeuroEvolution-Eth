const Mfi = (inHigh, inLow, inClose, inVolume, inTimePeriod) => {
	let moneyFlow = { positive: undefined, negative: undefined };
	let outReal = new Array(inHigh.length).fill(0.0);
	let mflowIdx = 0;
	let maxIdxMflow = 50 - 1;
	let mflow = new Array(inTimePeriod).fill(moneyFlow);
	maxIdxMflow = inTimePeriod - 1;
	let lookbackTotal = inTimePeriod;
	let startIdx = lookbackTotal;
	let outIdx = startIdx;
	let today = startIdx - lookbackTotal;
	let prevValue = (inHigh[today] + inLow[today] + inClose[today]) / 3.0;
	let posSumMF = 0.0;
	let negSumMF = 0.0;
	today++;
	for (let i = inTimePeriod; i > 0; i--) {
		let tempValue1 = (inHigh[today] + inLow[today] + inClose[today]) / 3.0;
		let tempValue2 = tempValue1 - prevValue;
		prevValue = tempValue1;
		tempValue1 *= inVolume[today];
		today++;
		if (tempValue2 < 0) {
			mflow[mflowIdx].negative = tempValue1;
			negSumMF += tempValue1;
			mflow[mflowIdx].positive = 0.0;
		} else if (tempValue2 > 0) {
			mflow[mflowIdx].positive = tempValue1;
			posSumMF += tempValue1;
			mflow[mflowIdx].negative = 0.0;
		} else {
			mflow[mflowIdx].positive = 0.0;
			mflow[mflowIdx].negative = 0.0;
		}
		mflowIdx++;
		if (mflowIdx > maxIdxMflow) mflowIdx = 0;
	}
	if (today > startIdx) {
		let tempValue1 = posSumMF + negSumMF;
		if (tempValue1 >= 1.0) {
			outReal[outIdx] = 100.0 * (posSumMF / tempValue1);
			outIdx++;
		}
	} else {
		while (today < startIdx) {
			posSumMF -= mflow[mflowIdx].positive;
			negSumMF -= mflow[mflowIdx].negative;
			let tempValue1 = (inHigh[today] + inLow[today] + inClose[today]) / 3.0;
			let tempValue2 = tempValue1 - prevValue;
			prevValue = tempValue1;
			tempValue1 *= inVolume[today];
			today++;
			if (tempValue2 < 0) {
				mflow[mflowIdx].negative = tempValue1;
				negSumMF += tempValue1;
				mflow[mflowIdx].positive = 0.0;
			} else if (tempValue2 > 0) {
				mflow[mflowIdx].positive = tempValue1;
				posSumMF += tempValue1;
				mflow[mflowIdx].negative = 0.0;
			} else {
				mflow[mflowIdx].positive = 0.0;
				mflow[mflowIdx].negative = 0.0;
			}
			mflowIdx++;
			if (mflowIdx > maxIdxMflow) mflowIdx = 0;
		}
	}
	while (today < inClose.length) {
		posSumMF -= mflow[mflowIdx].positive;
		negSumMF -= mflow[mflowIdx].negative;
		let tempValue1 = (inHigh[today] + inLow[today] + inClose[today]) / 3.0;
		let tempValue2 = tempValue1 - prevValue;
		prevValue = tempValue1;
		tempValue1 *= inVolume[today];
		today++;
		if (tempValue2 < 0) {
			mflow[mflowIdx].negative = tempValue1;
			negSumMF += tempValue1;
			mflow[mflowIdx].positive = 0.0;
		} else if (tempValue2 > 0) {
			mflow[mflowIdx].positive = tempValue1;
			posSumMF += tempValue1;
			mflow[mflowIdx].negative = 0.0;
		} else {
			mflow[mflowIdx].positive = 0.0;
			mflow[mflowIdx].negative = 0.0;
		}
		tempValue1 = posSumMF + negSumMF;
		tempValue1 < 1.0
			? (outReal[outIdx] = 0.0)
			: (outReal[outIdx] = 100.0 * (posSumMF / tempValue1));
		outIdx++;
		mflowIdx++;
		if (mflowIdx > maxIdxMflow) mflowIdx = 0;
	}
	return outReal;
};
module.exports = { Mfi };
