const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Variant = require('./variant.model');

const productSchema = new Schema(
	{
		name: String,
		path: String,
		brand: {
			type: Schema.Types.ObjectId,
			ref: 'Brand',
			required: true,
		},
		category: {
			type: Schema.Types.ObjectId,
			ref: 'Category',
			required: true,
		},
		specialCategories: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Category',
				required: false,
			},
		],
		price: Number,
		salePrice: {
			type: Number,
			default: 0,
		},
		description: String,
		variants: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Variant',
			},
		],
		quantity: {
			type: Number,
			default: 0,
		},
		images: [
			{
				type: Schema.Types.ObjectId,
				ref: 'ProductImage',
			},
		],
		showing: {
			type: Boolean,
			default: true,
		},
		sold: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: { createdAt: 'created_at' }, versionKey: false }
);

productSchema.pre('save', async function () {
	let variants = await Promise.all(
		this.variants.map((variant) => Variant.findById(variant))
	);

	this.quantity = variants.reduce((total, current) => total + current.stock, 0);
});

let Product = mongoose.model('Product', productSchema, 'products');

module.exports = Product;
