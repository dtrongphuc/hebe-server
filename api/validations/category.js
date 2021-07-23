const { check } = require('express-validator');

exports.validateCategory = [
	check('name').notEmpty().withMessage('Name is required'),
	check('description').notEmpty().withMessage('Description is required'),
	check('image').notEmpty().withMessage('Image is required'),
];
