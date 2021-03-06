const { Router } = require('express');
const {
	addToCart,
	fetchCart,
	updateCart,
	checkProductQuantity,
} = require('../../services/cart');
const {
	validateAddToCart,
	validateUpdateCart,
} = require('../validations/cart');
const rejection = require('../validations/rejection');
const isAuth = require('../middlewares/isAuth');
const isUser = require('../middlewares/isUser');

const route = Router();

module.exports = (app) => {
	app.use('/cart', isAuth, isUser, route);

	route.get('/', async (req, res, next) => {
		try {
			const { cart } = await fetchCart(req.user);

			return res.status(200).json({
				success: true,
				cart,
			});
		} catch (error) {
			next(error);
		}
	});

	route.post(
		'/add',

		validateAddToCart,
		rejection,
		async (req, res, next) => {
			try {
				await addToCart(req.body, req.user);

				return res.status(200).json({
					success: true,
				});
			} catch (error) {
				next(error);
			}
		}
	);

	route.post(
		'/update',

		validateUpdateCart,
		rejection,
		async (req, res, next) => {
			try {
				const { cart, updateResult } = await updateCart(req.body, req.user);

				return res.status(200).json({
					success: true,
					cart,
					...updateResult,
				});
			} catch (error) {
				next(error);
			}
		}
	);

	route.get('/check', async (req, res, next) => {
		try {
			const { invalid } = await checkProductQuantity(req.user);
			return res.status(200).json({ success: true, invalid });
		} catch (error) {
			next(error);
		}
	});
};
