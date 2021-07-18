const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
	account: {
		type: mongoose.Types.ObjectId,
		ref: 'Account',
	},
	products: [
		{
			product: {
				type: Schema.Types.ObjectId,
				ref: 'Product',
			},
			variant: {
				type: Schema.Types.ObjectId,
				ref: 'Variant',
			},
			sku: {
				type: Schema.Types.ObjectId,
				ref: 'VariantDetail',
			},
			quantity: Number,
			total: Number,
		},
	],
	shippingInfo: String,
	shippingMethod: {
		type: String,
		name: String,
	},
});
