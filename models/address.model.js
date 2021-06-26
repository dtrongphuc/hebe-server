const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema(
	{
		customer: {
			type: Schema.Types.ObjectId,
			ref: 'Account',
		},
		firstname: String,
		lastname: String,
		company: String,
		address: String,
		city: String,
		country: String,
		postal: String,
		phone: String,
		isDefault: Boolean,
	},
	{
		versionKey: false,
	}
);

let Address = mongoose.model('Address', addressSchema, 'addresses');

module.exports = Address;
