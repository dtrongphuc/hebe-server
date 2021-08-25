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
				if (!user.active) {
					return Promise.reject('Account has been blocked');
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
						return Promise.reject('Password incorrect');
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

exports.validateEditUserAccount = [
	check('email')
		.notEmpty()
		.withMessage('Please enter your email')
		.isEmail()
		.withMessage('Invalid email format')
		.custom((value, { req }) => {
			return Account.findOne({ email: value }).then((user) => {
				if (user && String(user._id) !== req.body.id) {
					return Promise.reject('Email is already in use');
				}
			});
		}),
	check('first_name').notEmpty().withMessage('Please enter your first name'),
	check('last_name').notEmpty().withMessage('Please enter your last name'),
];

exports.validateExistEmail = [
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
];

exports.validateResetPassword = [
	check('password').notEmpty().withMessage('Please enter your password'),
	check('confirmPw').custom((value, { req }) => {
		if (value !== req.body.password) {
			return Promise.reject('New password and confirm password does not match');
		}

		return true;
	}),
];
