const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const discountRuleSchema = new Schema({
	allocationMethod: {
		type: String,
		enum: ['each', 'across'],
		default: 'across',
	},
	customerSelection: {
		type: String,
		enum: ['all', 'prerequisite'],
		require: true,
		default: 'all',
	},
	productSelection: {
		type: String,
		enum: ['all', 'entitled'],
		require: true,
		default: 'all',
	},
	entitledProducts: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Product',
		},
	],
	prerequisiteCustomers: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Account',
		},
	],
	customerPurchase: {
		type: Number,
		default: 0,
	},
	onePerCustomer: {
		type: Boolean,
		default: true,
	},
	startsAt: Date,
	endsAt: Date,
	targetType: {
		type: String,
		//line_item: The price rule applies to the cart's line items.
		//shipping_line: The price rule applies to the cart's shipping lines.
		enum: ['line_item', 'shipping_line'],
	},
	usageLimit: Number,
	value: Number, // example: -35,
	valueType: {
		type: String,
		enum: ['fixed_amount', 'percentage'],
		require: true,
	},
});

discountRuleSchema.pre('save', function () {
	if (this.productSelection === 'entitled' && this.targetType === 'line_item') {
		this.allocationMethod = 'each';
	}
});

let DiscountRule = mongoose.model(
	'DiscountRule',
	discountRuleSchema,
	'discount_rules'
);

module.exports = DiscountRule;
