const { check } = require('express-validator');

exports.validateBrand = [
	check('name').notEmpty().withMessage('Name is required'),
	check('description').notEmpty().withMessage('Description is required'),
	check('image').notEmpty().withMessage('Image is required'),
];
