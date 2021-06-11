const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountSchema = new Schema(
	{
		email: String,
		firstname: String,
		lastname: String,
		password: String,
		verifyCode: String,
	},
	{
		versionKey: false,
	}
);

let Account = mongoose.model('Account', accountSchema, 'accounts');

module.exports = Account;
