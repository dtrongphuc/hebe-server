const mongoose = require('mongoose');
const Product = require('./product.model');
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
				sku: {
					type: Schema.Types.ObjectId,
					ref: 'VariantDetail',
				},
				quantity: Number,
				total: {
					type: Number,
					default: 0,
				},
				createdAt: {
					type: Date,
					default: Date.now,
				},
			},
		],
		totalPrice: {
			type: Number,
			default: 0,
		},
	},
	{
		versionKey: false,
	}
);

cartSchema.pre('save', async function () {
	await Promise.all(
		this.products?.map(async (item) => {
			let pr = await Product.findById(item.product);
			item.total =
				(pr.salePrice > 0 ? pr.salePrice : pr.price) * item.quantity || 0;
			return item.total;
		})
	);

	this.totalPrice =
		this.products?.reduce((total, current) => total + current.total, 0) || 0;
});

cartSchema.post('findOneAndUpdate', function (result) {
	this.model
		.updateOne(
			{ _id: result._id },
			{
				totalPrice:
					result.products.reduce(
						(total, current) => total + current.total,
						0
					) || 0,
			}
		)
		.exec();
});
const Cart = mongoose.model('Cart', cartSchema, 'carts');

module.exports = Cart;
