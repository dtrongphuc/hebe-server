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
			let token = jwtHelper.createToken({
				id: account._id,
				role: account.role,
			});

			return res.status(200).json({
				success: true,
				msg: 'Tạo tài khoản thành công',
				token,
			});
		} catch (error) {
			return res.status(500).json({
				success: false,
				msg: error,
			});
		}
	},

	login: async (req, res) => {
		try {
			const account = await Account.findOne({ email: req.body?.email });

			let token = jwtHelper.createToken({
				id: account._id,
				role: account.role,
			});

			return res.status(200).json({
				success: true,
				msg: 'Đăng nhập thành công',
				token,
			});
		} catch (error) {
			console.log(error);
			return res.status(500).json({
				success: false,
				msg: 'Login failed',
			});
		}
	},

	createNewAddress: async (req, res) => {
		res.send('ok');
	},
};
