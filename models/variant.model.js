const mongoose = require('mongoose');
const VariantDetail = require('./variant_detail.model');
const Schema = mongoose.Schema;

const variantSchema = new Schema(
	{
		color: String,
		stock: Number,
		freeSize: Boolean,
		details: [
			{
				ref: 'VariantDetail',
				type: Schema.Types.ObjectId,
				required: false,
			},
		],
		product: {
			ref: 'Product',
			type: Schema.Types.ObjectId,
		},
	},
	{ versionKey: false }
);

variantSchema.pre('save', async function () {
	if (!this.freeSize) {
		const quantities = await Promise.all(
			this.details.map(async (detail) => {
				let vDetail = await VariantDetail.findById(detail);
				return vDetail.quantity;
			})
		);
		this.stock = quantities.reduce((total, current) => total + current, 0);
	}
});

let Variant = mongoose.model('Variant', variantSchema, 'variants');

module.exports = Variant;
