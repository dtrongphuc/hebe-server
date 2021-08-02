const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const discountSchema = new Schema(
	{
		code: String,
		discountRule: {
			type: Schema.Types.ObjectId,
			ref: 'discountRule',
		},
		usageCount: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true }
);

let Discount = mongoose.model('Discount', discountSchema, 'discounts');

module.exports = Discount;
