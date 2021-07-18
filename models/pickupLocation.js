const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pickupLocationSchema = new Schema(
	{
		name: String,
		displayPrice: String,
		price: Number,
		instruction: String,
		address: String,
	},
	{ versionKey: false }
);

const PickupLocation = mongoose.model(
	'PickupLocation',
	pickupLocationSchema,
	'pickup_locations'
);
module.exports = PickupLocation;
