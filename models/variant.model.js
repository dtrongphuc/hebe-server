const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const variantSchema = new Schema(
	{
		color: String,
		stock: Number,
		freeSize: Boolean,
		details: [
			{
				sku: String,
				size: String,
				quantity: Number,
			},
		],
		product: {
			ref: 'Product',
			type: Schema.Types.ObjectId,
		},
	},
	{ versionKey: false }
);

let Variant = mongoose.model('Variant', variantSchema, 'variants');

module.exports = Variant;
