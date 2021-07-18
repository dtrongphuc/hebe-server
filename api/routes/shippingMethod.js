const { Router } = require('express');
const rejection = require('../validations/rejection');
const {
	getShippingMethods,
	putShippingMethods,
} = require('../../services/shippingMethod');
const { validateShippingMethods } = require('../validations/shipping');

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

	route.put('/', validateShippingMethods, rejection, async (req, res, next) => {
		try {
			await putShippingMethods(req.body);
			return res.status(200).json({ success: true });
		} catch (error) {
			next(error);
		}
	});
};
