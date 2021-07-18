const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema(
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

let Category = mongoose.model('Category', categorySchema, 'categories');

module.exports = Category;
