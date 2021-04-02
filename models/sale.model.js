const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const saleSchema = new Schema({
	product: {
		type: Schema.Types.ObjectId,
		ref: 'Product',
		required: true,
	},
	originPrice: Number,
	salePrice: Number,
	dateStart: Date,
	dateEnd: Date,
});

let Sale = mongoose.model('Sale', saleSchema, 'sale');

module.exports = Sale;
