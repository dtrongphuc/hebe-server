const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema(
	{
		account: {
			type: Schema.Types.ObjectId,
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
				quantity: Number,
				total: Number,
			},
		],
		totalPrice: Number,
	},
	{
		versionKey: false,
	}
);

const Cart = mongoose.model('Cart', cartSchema, 'carts');

module.exports = Cart;
