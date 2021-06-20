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
		const validate = [
			{
				message: 'Please enter your first name',
				inValid: isNullOrEmpty(firstname),
				inputName: 'firstname',
			},
			{
				message: 'Please enter your last name',
				inValid: isNullOrEmpty(lastname),
				inputName: 'lastname',
			},
			{
				message: 'Please enter your email',
				inValid: isNullOrEmpty(email),
				inputName: 'email',
			},
			{
				message: 'Please enter your password',
				inValid: isNullOrEmpty(password),
				inputName: 'password',
			},
		];

		let inValids = validate.filter((field) => field.inValid === true);
		if (inValids.length > 0) {
			return res.status(200).json({
				success: false,
				fieldsError: 'input',
				errors: inValids,
			});
		}

		const account = await Account.findOne({
			email: email,
		});

		if (!!account) {
			return res.status(200).json({
				success: false,
				fieldsError: 'input',
				errors: [
					{
						message: 'Email has registered',
						inputName: 'email',
					},
				],
			});
		}

		next();
	},

	loginValidate: async (req, res, next) => {
		const { email, password } = req.body;
		const validate = [
			{
				message: 'Please enter your email',
				inValid: isNullOrEmpty(email),
				inputName: 'email',
				fields: 'input',
			},
			{
				message: 'Please enter your password',
				inValid: isNullOrEmpty(password),
				inputName: 'password',
				fields: 'input',
			},
		];
		let inValids = validate.filter((field) => field.inValid === true);
		if (inValids.length > 0) {
			return res.status(200).json({
				success: false,
				fieldsError: 'input',
				errors: inValids,
			});
		}

		const account = await Account.findOne({
			email: email,
		});

		if (!account) {
			return res.status(200).json({
				success: false,
				fieldsError: 'input',
				errors: [
					{
						message: 'Email does not exist',
						inputName: 'email',
					},
				],
			});
		}

		res.locals.account = account;
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
				fieldsError: 'page',
				message: 'Lỗi khi hash pw',
			});
		}
	},

	comparePassword: async (req, res, next) => {
		try {
			const { password } = req.body;
			const hashedPassword = res.locals.account.password;

			const isValid = await bcrypt.compare(password, hashedPassword);
			if (!isValid) {
				return res.status(200).json({
					success: false,
					fieldsError: 'page',
					message: 'Email or password incorrect',
				});
			}

			next();
		} catch (error) {
			return res.status(500).json({
				success: false,
				fieldsError: 'page',
				message: 'Lỗi khi hash pw',
			});
		}
	},
};
