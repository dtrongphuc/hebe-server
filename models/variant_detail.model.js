const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const variantDetailSchema = new Schema(
	{
		size: String,
		quantity: Number,
		variant: {
			ref: 'Variant',
			type: Schema.Types.ObjectId,
		},
	},
	{ versionKey: false }
);

let VariantDetail = mongoose.model(
	'VariantDetail',
	variantDetailSchema,
	'variant_detail'
);

module.exports = VariantDetail;
