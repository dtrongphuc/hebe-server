const { check } = require('express-validator');

exports.validatePickupLocations = [
	check('pickup_locations')
		.notEmpty()
		.isArray()
		.withMessage('Pickup_locations is required'),
];

exports.validateShippingMethods = [
	check('shipping_methods')
		.notEmpty()
		.isArray()
		.withMessage('Shipping_methods is required'),
];
