const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema(
	{
		name: String,
		path: String,
		brand: {
			type: Schema.Types.ObjectId,
			ref: 'Brand',
			required: true,
		},
		group: {
			type: Schema.Types.ObjectId,
			ref: 'Group',
			required: false,
		},
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
	},
	{ timestamps: { createdAt: 'created_at' } }
);

let Product = mongoose.model('Product', productSchema, 'products');

module.exports = Product;
