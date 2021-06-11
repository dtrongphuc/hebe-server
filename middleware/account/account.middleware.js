const bcrypt = require('bcrypt');
const Account = require('../../models/account.model');

const isNullOrEmpty = (value) => {
	if (typeof value !== 'string' || value === '') {
		return true;
	}

	return false;
};

module.exports = {
	createAccountValidate: async (req, res, next) => {
		const { firstname, lastname, email, password } = req.body;

		if (
			isNullOrEmpty(firstname) ||
			isNullOrEmpty(lastname) ||
			isNullOrEmpty(email) ||
			isNullOrEmpty(password)
		) {
			return res.status(500).json({
				success: false,
				message: 'Vui lòng điền đẩy đủ thông tin',
			});
		}

		const account = await Account.findOne({
			email: email,
		});

		if (!!account) {
			return res.status(500).json({
				success: false,
				message: 'Email đã dược đăng ký',
			});
		}

		next();
	},

	hashPassword: async (req, res, next) => {
		try {
			const { password } = req.body;

			const hashedPw = await bcrypt.hash(password, 10);

			res.locals.hashedPw = hashedPw;

			next();
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: 'Lỗi khi hash pw',
			});
		}
	},
};
