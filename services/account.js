const config = require('../config');
const Account = require('../models/account.model');
const bcrypt = require('bcrypt');

module.exports = {
	getUserAccounts: async () => {
		try {
			const accounts = await Account.find({ role: 'user' }).select(
				'-password -verifyCode'
			);

			return { accounts };
		} catch (error) {
			return Promise.reject(error);
		}
	},

	getAccountById: async ({ id }) => {
		try {
			const account = await Account.findById(id).select(
				'-password -verifyCode'
			);

			return { account };
		} catch (error) {
			return Promise.reject(error);
		}
	},

	submitEditAccount: async (accountInput) => {
		try {
			const { id, password, first_name, last_name, active } = accountInput;
			if (!password) {
				let updated_no_pw = await Account.findByIdAndUpdate(
					id,
					{
						firstname: first_name,
						lastname: last_name,
						active: active,
					},
					{ new: true }
				);

				return !!updated_no_pw ? true : false;
			}

			let salt = config.password.salt;
			const hashedPw = await bcrypt.hash(password, salt);
			let updated_has_pw = await Account.findByIdAndUpdate(
				id,
				{
					firstname: first_name,
					lastname: last_name,
					active: active,
					password: hashedPw,
				},
				{ new: true }
			);

			return !!updated_has_pw ? true : false;
		} catch (error) {
			return Promise.reject(error);
		}
	},
};
