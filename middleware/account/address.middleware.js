const { check } = require('express-validator');

exports.validateAddress = [
	check('address').notEmpty().withMessage({
		message: 'Please enter your address',
		inputName: 'address',
	}),
	check('city')
		.notEmpty()
		.withMessage({ message: 'Please enter your city', inputName: 'city' }),
	check('country').notEmpty().withMessage({
		message: 'Please enter your country',
		inputName: 'country',
	}),
	check('postal').notEmpty().withMessage({
		message: 'Please enter your postal/zip code',
		inputName: 'postal',
	}),
	check('phone').notEmpty().withMessage({
		message: 'Please enter your phone number',
		inputName: 'phone',
	}),
];
