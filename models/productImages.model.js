const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productImageSchema = new Schema(
	{
		publicId: String,
		src: String,
		position: Number,
		product: {
			type: Schema.Types.ObjectId,
			ref: 'Product',
		},
	},
	{ versionKey: false }
);

let ProductImage = mongoose.model(
	'ProductImage',
	productImageSchema,
	'productImages'
);

module.exports = ProductImage;
