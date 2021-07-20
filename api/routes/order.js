const { Router } = require('express');
const { createOrder } = require('../../services/order');
const rejection = require('../validations/rejection');
const isAuth = require('../middlewares/isAuth');

const route = Router();

module.exports = (app) => {
	app.use('/orders', isAuth, route);

	route.post('/create', async (req, res, next) => {
		try {
			await createOrder(req.body, req.user);
			return res.status(200).json({ success: true });
		} catch (error) {
			next(error);
		}
	});
};
