const { check } = require('express-validator');
const Discount = require('../../models/discount.model');

exports.validateNewDiscount = [
	check('code')
		.notEmpty()
		.withMessage('Code is required')
		.custom((value) => {
			return Discount.findOne({ code: value }).then((code) => {
				if (code) {
					return Promise.reject('Code has existed');
				}
			});
		}),
	check('apply_to').notEmpty(),
	check('one_per_customer').isBoolean(),
	check('date_range').custom((value) => {
		if (value && Array.isArray(value) && value.length < 2) {
			return Promise.reject('Date is not valid');
		}

		return Promise.resolve();
	}),
	check('discount_amount').notEmpty().isInt({ min: 0 }),
	check('discount_type').notEmpty().isIn(['fixed_amount', 'percentage']),
];
