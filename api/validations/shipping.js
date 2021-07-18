const { check } = require('express-validator');

exports.validateShipping = [
	check('pickup_locations')
		.notEmpty()
		.isArray()
		.withMessage('Pickup_locations is required'),
	check('shipping_methods')
		.notEmpty()
		.isArray()
		.withMessage('Shipping_methods is required'),
];
