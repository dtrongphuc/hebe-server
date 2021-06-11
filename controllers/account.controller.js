const jwtHelper = require('../helpers/jwt');
const Account = require('../models/account.model');

module.exports = {
	createAccount: async (req, res) => {
		const { firstname, lastname, email } = req.body;
		const { hashedPw } = res.locals;

		try {
			let account = await Account.create({
				firstname,
				lastname,
				email,
				password: hashedPw,
			});
			let token = jwtHelper.createToken(account._id);

			res.header('Authorization', `Bearer ${token}`);

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

	login: async (req, res) => {
		try {
			const { account } = res.locals;
			let token = jwtHelper.createToken({ sub: account._id });

			res.header('Authorization', `Bearer ${token}`);
			return res.status(200).json({
				success: true,
				message: 'Đăng nhập thành công',
			});
		} catch (error) {
			console.log(error);
			return res.status(500).json({
				success: false,
				message: error,
			});
		}
	},
};
