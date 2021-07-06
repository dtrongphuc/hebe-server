const { check } = require('express-validator');
const Variant = require('../../models/variant.model');

exports.validateAddToCart = [
	check('_id').notEmpty().withMessage('variant id is required'),
	check('quantity')
		.notEmpty()
		.isNumeric()
		.custom(async (value, { req }) => {
			const { _id } = req.body;
			try {
				const variant = await Variant.findById(_id);
				if (value > variant?.stock) {
					return Promise.reject('Quantity invalid');
				}
			} catch (error) {
				console.log(error);
				return Promise.reject('Quantity invalid');
			}
		}),
];

exports.validateUpdateCart = [
	check('action_type').notEmpty(),
	check('info').notEmpty(),
	check('update').notEmpty(),
];
