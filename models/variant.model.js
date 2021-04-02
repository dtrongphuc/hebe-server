const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const variantSchema = new Schema({
	product: {
		type: Schema.Types.ObjectId,
		ref: 'Product',
		required: true,
	},
	list: [
		{
			color: String,
			detail: [
				{
					size: String,
					quantity: Number,
				},
			],
		},
	],
	quantity: Number,
});

let Variant = mongoose.model('Variant', variantSchema, 'variant');

module.exports = Variant;
