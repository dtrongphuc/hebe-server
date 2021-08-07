exports.nameToPath = (name) => name.toLowerCase().replace(/\W+/g, '-');

//convert discount amount to number with discount type
exports.convertDiscountType = ({ value, valueType, targetType }, amount) => {
	if (valueType === 'percentage' && targetType === 'line_item') {
		return amount * value * 0.01;
	}

	return value;
};

exports.convertDiscountDeliveryFee = ({ value, valueType }, deliveryFee) => {
	if (valueType === 'percentage') {
		return deliveryFee * value * 0.01;
	}

	let rs = deliveryFee - value;
	return rs > 0 ? value : deliveryFee;
};
