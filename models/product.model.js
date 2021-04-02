const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema(
	{
		name: String,
		brand: {
			type: Schema.Types.ObjectId,
			ref: 'Brand',
			required: true,
		},
		path: String,
		price: Number,
		salePrice: {
			type: Schema.Types.ObjectId,
			ref: 'Sale',
			required: false,
		},
		description: Array,
		variant: {
			type: Schema.Types.ObjectId,
			ref: 'Variant',
			required: true,
		},
		images: [
			{
				index: Number,
				link: String,
			},
		],
	},
	{ timestamps: { createdAt: 'created_at' } }
);

let Product = mongoose.model('Product', productSchema, 'products');

module.exports = Product;
