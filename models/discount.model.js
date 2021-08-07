const mongoose = require('mongoose');
const {
	convertDiscountType,
	convertDiscountDeliveryFee,
} = require('../utils/utils');
const Cart = require('./cart.model');
const Schema = mongoose.Schema;

const discountSchema = new Schema(
	{
		code: String,
		discountRule: {
			type: Schema.Types.ObjectId,
			ref: 'DiscountRule',
		},
		usageCount: {
			type: Number,
			default: 0,
		},
		description: String,
		status: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

discountSchema.methods.discountValueByUser = async function (
	userId,
	deliveryFee
) {
	const cart = await Cart.findOne({
		account: userId,
	}).populate({
		path: 'products',
		populate: {
			path: 'product',
		},
	});

	const { discountRule } = this;

	if (
		discountRule.targetType === 'line_item' &&
		discountRule.allocationMethod === 'each'
	) {
		let reduction =
			cart.products
				.filter((item) =>
					discountRule.entitledProducts.includes(item.product._id)
				)
				.reduce((acc, item) => {
					let amount = convertDiscountType(discountRule, item.total);

					return acc + amount;
				}, 0) ?? 0;

		return reduction;
	} else if (discountRule.targetType === 'line_item') {
		return convertDiscountType(discountRule, cart.totalPrice);
	}
	// shipping_line
	// have a two case:
	// discount type: fixed_amount || percentage
	return convertDiscountDeliveryFee(discountRule, deliveryFee);
};

let Discount = mongoose.model('Discount', discountSchema, 'discounts');

module.exports = Discount;
