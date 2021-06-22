const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountSchema = new Schema(
	{
		email: String,
		firstname: String,
		lastname: String,
		password: String,
		verifyCode: String,
		role: {
			type: String,
			enum: ['user', 'admin'],
			default: 'user',
		},
		addresses: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Address',
			},
		],
	},
	{
		versionKey: false,
	}
);

let Account = mongoose.model('Account', accountSchema, 'accounts');

module.exports = Account;
