const { Router } = require('express');
const {
	createOrder,
	countOrder,
	getOrdersOfUser,
	countPagination,
	getOrders,
} = require('../../services/order');
const rejection = require('../validations/rejection');
const isAuth = require('../middlewares/isAuth');

const route = Router();

module.exports = (app) => {
	app.use('/orders', isAuth, route);

	// get orders
	route.get('/', async (req, res, next) => {
		try {
			const { orders } = await getOrders();
			return res.status(200).json({ success: true, orders });
		} catch (error) {
			next(error);
		}
	});

	route.post('/create', async (req, res, next) => {
		try {
			await createOrder(req.body, req.user);
			return res.status(200).json({ success: true });
		} catch (error) {
			next(error);
		}
	});

	route.get('/count', async (req, res, next) => {
		try {
			const { count } = await countOrder(req.user);
			return res.status(200).json({ success: true, count });
		} catch (error) {
			next(error);
		}
	});

	route.get('/by-user', async (req, res, next) => {
		try {
			const { orders } = await getOrdersOfUser(req.query, req.user);
			return res.status(200).json({ success: true, orders });
		} catch (error) {
			next(error);
		}
	});

	route.get('/max-page', async (req, res, next) => {
		try {
			const { maxPage } = await countPagination(req.user);
			return res.status(200).json({ success: true, maxPage });
		} catch (error) {
			next(error);
		}
	});
};
