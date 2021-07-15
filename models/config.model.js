const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const configSchema = new Schema(
	{
		banner: {
			src: String,
			public_id: String,
			title: String,
			link: String,
		},
		locations: [
			{
				name: String,
				displayPrice: String,
				price: Number,
				instruction: String,
				address: String,
			},
		],
		shippingMethods: [
			{
				name: String,
				price: Number,
				displayPrice: String,
			},
		],
	},
	{ versionKey: false, id: false }
);

const Config = mongoose.model('Config', configSchema, 'configs');

module.exports = Config;
