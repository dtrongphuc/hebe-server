const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shippingMethodSchema = new Schema(
	{
		name: String,
		displayPrice: String,
		price: Number,
		instruction: String,
		address: String,
	},
	{ versionKey: false }
);

const ShippingMethod = mongoose.model(
	'ShippingMethod',
	shippingMethodSchema,
	'shipping_methods'
);
module.exports = ShippingMethod;
