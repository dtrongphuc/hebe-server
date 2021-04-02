const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const brandSchema = new Schema({
	name: String,
	path: String,
	image: String,
	description: Array,
});

let Brand = mongoose.model('Brand', brandSchema, 'brand');

module.exports = Brand;
