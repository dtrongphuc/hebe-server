const Account = require('../models/account.model');

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
};
