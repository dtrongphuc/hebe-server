const { check } = require('express-validator');

exports.validateProduct = [
	check('name').notEmpty().withMessage('Name is required'),
	check('brand').notEmpty().withMessage('Brand is required'),
	check('category').notEmpty().withMessage('Category is required'),
	check('price').notEmpty().withMessage('Price is required'),
	check('description').notEmpty().withMessage('Description is required'),
	check('variants').notEmpty().withMessage('Variants is required'),
	check('images').notEmpty().withMessage('Images is required'),
];
