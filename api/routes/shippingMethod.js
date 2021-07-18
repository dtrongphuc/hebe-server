const { Router } = require('express');
const rejection = require('../validations/rejection');
const { getReviews } = require('../../services/review');
const { getShippingMethods } = require('../../services/shippingMethod');

const route = Router();

module.exports = (app) => {
	app.use('/shipping-methods', route);

	route.get('/', async (req, res, next) => {
		try {
			let { shippingMethods } = await getShippingMethods();
			return res.status(200).json({ success: true, shippingMethods });
		} catch (error) {
			next(error);
		}
	});
};
