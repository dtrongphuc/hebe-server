const bcrypt = require('bcrypt');
const Account = require('../../models/account.model');
const { check } = require('express-validator');

exports.validateLogin = [
	check('email')
		.notEmpty()
		.withMessage('Please enter your email')
		.isEmail()
		.withMessage('Invalid email format')
		.custom((value) => {
			return Account.findOne({ email: value }).then((user) => {
				if (!user) {
					return Promise.reject('Email does not exist');
				}
			});
		}),
	check('password')
		.notEmpty()
		.withMessage('Please enter your password')
		.custom(async (value, { req }) => {
			try {
				const account = await Account.findOne({ email: req.body?.email });
				if (account) {
					const isValid = await bcrypt.compare(value, account.password);
					if (!isValid) {
						throw new Error('Password incorrect');
					}
				}
			} catch (error) {
				console.log(error);
				throw new Error('Password incorrect');
			}
		}),
];

exports.validateRegister = [
	check('firstname').notEmpty().withMessage('Please enter your first name'),
	check('lastname').notEmpty().withMessage('Please enter your last name'),
	check('email')
		.notEmpty()
		.withMessage('Please enter your email')
		.isEmail()
		.withMessage('Invalid email format')
		.custom((value) => {
			return Account.findOne({ email: value }).then((account) => {
				if (account) {
					return Promise.reject('Email already exists');
				}
			});
		}),
	check('password').notEmpty().withMessage('Please enter your password'),
];
