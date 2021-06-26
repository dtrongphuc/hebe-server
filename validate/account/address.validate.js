const { check } = require('express-validator');

exports.validateAddress = [
	check('firstname').notEmpty().withMessage('Please enter your first name'),
	check('lastname').notEmpty().withMessage('Please enter your last name'),
	check('address').notEmpty().withMessage('Please enter your address'),
	check('city').notEmpty().withMessage('Please enter your city'),
	check('country').notEmpty().withMessage('Please enter your country'),
	check('postal').notEmpty().withMessage('Please enter your postal/zip code'),
	check('phone').notEmpty().withMessage('Please enter your phone number'),
];
