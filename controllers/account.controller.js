const Account = require('../models/account.model');

module.exports = {
	createAccount: async (req, res) => {
		const { firstname, lastname, email } = req.body;
		const { hashedPw } = res.locals;

		try {
			await Account.create({
				firstname,
				lastname,
				email,
				password: hashedPw,
			});

			return res.status(200).json({
				success: true,
				message: 'Tạo tài khoản thành công',
			});
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: error,
			});
		}
	},
};
