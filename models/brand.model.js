const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const brandSchema = new Schema(
	{
		name: String,
		path: String,
		image: {
			publicId: String,
			link: String,
		},
		description: String,
		showing: {
			type: Boolean,
			default: true,
		},
	},
	{ versionKey: false }
);

let Brand = mongoose.model('Brand', brandSchema, 'brands');

module.exports = Brand;
